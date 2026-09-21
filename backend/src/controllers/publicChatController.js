// ============================================================
// API publique consommée par le client chatbot.
// Aucune authentification requise, mais chaque discussion est
// protégée par un token opaque (public_token) généré à sa création.
// ============================================================

const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { findAnswer } = require("../utils/matcher");

// GET /api/public/themes  -> liste des thèmes actifs, proposés à l'utilisateur
const listActiveThemes = asyncHandler(async (req, res) => {
  const themes = await db("chatbot_themes")
    .where({ is_active: true })
    .select("id", "name", "description")
    .orderBy("name", "asc");
  res.json({ themes });
});

// Vérifie que la discussion existe et que le token fourni correspond bien
async function getOwnedDiscussion(discussionId, token) {
  const discussion = await db("chatbot_discussions").where({ id: discussionId }).first();
  if (!discussion || discussion.public_token !== token) {
    throw new ApiError(404, "Discussion introuvable.");
  }
  return discussion;
}

// POST /api/public/discussions
// Body: { name, email, phone, theme_id }
// Crée le contact (chatbot_users) et une discussion indépendante.
// Un même contact peut démarrer autant de discussions qu'il le souhaite :
// chaque appel de cette route crée une NOUVELLE ligne dans chatbot_users
// et une NOUVELLE discussion, jamais fusionnée avec une précédente.
const startDiscussion = asyncHandler(async (req, res) => {
  const { name, email, phone, theme_id } = req.body;

  const theme = await db("chatbot_themes").where({ id: theme_id, is_active: true }).first();
  if (!theme) {
    throw new ApiError(404, "Thème introuvable ou inactif.");
  }

  const discussion = await db.transaction(async (trx) => {
    const [user] = await trx("chatbot_users")
      .insert({ name, email: email.toLowerCase(), phone })
      .returning("*");

    const [newDiscussion] = await trx("chatbot_discussions")
      .insert({ chatbot_user_id: user.id, theme_id: theme.id, status: "open" })
      .returning("*");

    return newDiscussion;
  });

  res.status(201).json({
    discussionId: discussion.id,
    token: discussion.public_token,
    theme: { id: theme.id, name: theme.name },
  });
});

// GET /api/public/discussions/:id?token=...  -> relit une conversation en cours
const getDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  if (!token) throw new ApiError(400, "Token de discussion manquant.");

  const discussion = await getOwnedDiscussion(id, token);
  const messages = await db("chatbot_messages")
    .where({ discussion_id: id })
    .orderBy("created_at", "asc")
    .select("id", "sender", "content", "created_at");

  res.json({ discussion: { id: discussion.id, status: discussion.status }, messages });
});

// POST /api/public/discussions/:id/messages?token=...
// Body: { message }
const postMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { message } = req.body;

  if (!token) throw new ApiError(400, "Token de discussion manquant.");

  const discussion = await getOwnedDiscussion(id, token);
  if (discussion.status === "closed") {
    throw new ApiError(400, "Cette discussion est déjà terminée.");
  }

  // Charge uniquement les questions actives du thème choisi pour cette discussion
  const questions = await db("chatbot_questions")
    .where({ theme_id: discussion.theme_id, is_active: true })
    .select("id", "question", "answer");

  const { answer, matchedQuestionId } = findAnswer(questions, message);

  const [userMessage, botMessage] = await db.transaction(async (trx) => {
    const [userMsg] = await trx("chatbot_messages")
      .insert({ discussion_id: id, sender: "user", content: message })
      .returning("*");

    const [botMsg] = await trx("chatbot_messages")
      .insert({
        discussion_id: id,
        sender: "bot",
        content: answer,
        matched_question_id: matchedQuestionId,
      })
      .returning("*");

    return [userMsg, botMsg];
  });

  res.status(201).json({ reply: answer, userMessage, botMessage });
});

// POST /api/public/discussions/:id/close?token=...
const closeDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  if (!token) throw new ApiError(400, "Token de discussion manquant.");

  const discussion = await getOwnedDiscussion(id, token);
  await db("chatbot_discussions")
    .where({ id: discussion.id })
    .update({ status: "closed", ended_at: db.fn.now() });

  res.json({ message: "Discussion clôturée." });
});

module.exports = { listActiveThemes, startDiscussion, getDiscussion, postMessage, closeDiscussion };
