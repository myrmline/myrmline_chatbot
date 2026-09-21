// ============================================================
// CRUD des questions/réponses, rattachées chacune à un thème
// ============================================================

const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/questions?theme_id=&search=&page=&pageSize=
const listQuestions = asyncHandler(async (req, res) => {
  const { theme_id, search, page, pageSize } = req.query;

  const baseQuery = db("chatbot_questions").join(
    "chatbot_themes",
    "chatbot_themes.id",
    "chatbot_questions.theme_id"
  );

  if (theme_id) baseQuery.andWhere("chatbot_questions.theme_id", theme_id);
  if (search) {
    baseQuery.andWhere((qb) => {
      qb.whereILike("chatbot_questions.question", `%${search}%`).orWhereILike(
        "chatbot_questions.answer",
        `%${search}%`
      );
    });
  }

  const countRow = await baseQuery.clone().count("chatbot_questions.id as count").first();
  const total = parseInt(countRow.count, 10);

  const questions = await baseQuery
    .clone()
    .select(
      "chatbot_questions.*",
      "chatbot_themes.name as theme_name",
      "chatbot_themes.slug as theme_slug"
    )
    .orderBy("chatbot_questions.created_at", "desc")
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  res.json({
    questions,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
});

// GET /api/admin/questions/:id
const getQuestion = asyncHandler(async (req, res) => {
  const question = await db("chatbot_questions").where({ id: req.params.id }).first();
  if (!question) throw new ApiError(404, "Question introuvable.");
  res.json({ question });
});

// POST /api/admin/questions
const createQuestion = asyncHandler(async (req, res) => {
  const { theme_id, question, answer, is_active } = req.body;

  const theme = await db("chatbot_themes").where({ id: theme_id }).first();
  if (!theme) throw new ApiError(404, "Thème introuvable.");

  const [created] = await db("chatbot_questions")
    .insert({
      theme_id,
      question,
      answer,
      is_active: is_active !== undefined ? is_active : true,
      source: "manual",
      created_by: req.admin.id,
    })
    .returning("*");

  res.status(201).json({ question: created });
});

// PUT /api/admin/questions/:id
const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await db("chatbot_questions").where({ id }).first();
  if (!existing) throw new ApiError(404, "Question introuvable.");

  if (req.body.theme_id) {
    const theme = await db("chatbot_themes").where({ id: req.body.theme_id }).first();
    if (!theme) throw new ApiError(404, "Thème introuvable.");
  }

  const [updated] = await db("chatbot_questions").where({ id }).update(req.body).returning("*");
  res.json({ question: updated });
});

// DELETE /api/admin/questions/:id
const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await db("chatbot_questions").where({ id }).first();
  if (!existing) throw new ApiError(404, "Question introuvable.");

  await db("chatbot_questions").where({ id }).del();
  res.json({ message: "Question supprimée avec succès." });
});

module.exports = { listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion };
