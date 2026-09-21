// ============================================================
// Consultation des discussions côté backoffice : liste filtrable
// et détail complet (fil de conversation façon messagerie).
// ============================================================

const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/discussions?name=&email=&phone=&theme_id=&date_from=&date_to=&page=&pageSize=
const listDiscussions = asyncHandler(async (req, res) => {
  const { name, email, phone, theme_id, date_from, date_to, page, pageSize } = req.query;

  const baseQuery = db("chatbot_discussions")
    .join("chatbot_users", "chatbot_users.id", "chatbot_discussions.chatbot_user_id")
    .join("chatbot_themes", "chatbot_themes.id", "chatbot_discussions.theme_id");

  if (name) baseQuery.andWhereILike("chatbot_users.name", `%${name}%`);
  if (email) baseQuery.andWhereILike("chatbot_users.email", `%${email}%`);
  if (phone) baseQuery.andWhereILike("chatbot_users.phone", `%${phone}%`);
  if (theme_id) baseQuery.andWhere("chatbot_discussions.theme_id", theme_id);
  if (date_from) baseQuery.andWhere("chatbot_discussions.started_at", ">=", date_from);
  if (date_to) baseQuery.andWhere("chatbot_discussions.started_at", "<=", date_to);

  const countRow = await baseQuery.clone().count("chatbot_discussions.id as count").first();
  const total = parseInt(countRow.count, 10);

  const discussions = await baseQuery
    .clone()
    .select(
      "chatbot_discussions.id",
      "chatbot_discussions.started_at",
      "chatbot_discussions.ended_at",
      "chatbot_discussions.status",
      "chatbot_users.name as user_name",
      "chatbot_users.email as user_email",
      "chatbot_users.phone as user_phone",
      "chatbot_themes.id as theme_id",
      "chatbot_themes.name as theme_name",
      db.raw(`(
        SELECT content FROM chatbot_messages
        WHERE chatbot_messages.discussion_id = chatbot_discussions.id
        ORDER BY created_at DESC LIMIT 1
      ) as last_message`),
      db.raw(`(
        SELECT COUNT(*) FROM chatbot_messages
        WHERE chatbot_messages.discussion_id = chatbot_discussions.id
      )::int as messages_count`)
    )
    .orderBy("chatbot_discussions.started_at", "desc")
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  res.json({
    discussions,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
});

// GET /api/admin/discussions/:id  (détail + historique complet des messages)
const getDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await db("chatbot_discussions")
    .join("chatbot_users", "chatbot_users.id", "chatbot_discussions.chatbot_user_id")
    .join("chatbot_themes", "chatbot_themes.id", "chatbot_discussions.theme_id")
    .where("chatbot_discussions.id", id)
    .select(
      "chatbot_discussions.id",
      "chatbot_discussions.started_at",
      "chatbot_discussions.ended_at",
      "chatbot_discussions.status",
      "chatbot_users.name as user_name",
      "chatbot_users.email as user_email",
      "chatbot_users.phone as user_phone",
      "chatbot_themes.id as theme_id",
      "chatbot_themes.name as theme_name"
    )
    .first();

  if (!discussion) throw new ApiError(404, "Discussion introuvable.");

  const messages = await db("chatbot_messages")
    .where({ discussion_id: id })
    .orderBy("created_at", "asc")
    .select("id", "sender", "content", "matched_question_id", "created_at");

  res.json({ discussion, messages });
});

module.exports = { listDiscussions, getDiscussion };
