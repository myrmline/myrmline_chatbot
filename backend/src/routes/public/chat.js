const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  listActiveThemes,
  startDiscussion,
  getDiscussion,
  postMessage,
  closeDiscussion,
} = require("../../controllers/publicChatController");
const validate = require("../../middlewares/validate");
const { startDiscussionSchema, postMessageSchema } = require("../../validators/publicChatValidators");
const { idParamSchema } = require("../../validators/commonValidators");

// Anti-abus : limite le nombre de messages/discussions par IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes. Merci de ralentir un instant." },
});

router.use(chatLimiter);

router.get("/themes", listActiveThemes);
router.post("/discussions", validate(startDiscussionSchema), startDiscussion);
router.get("/discussions/:id", validate(idParamSchema, "params"), getDiscussion);
router.post(
  "/discussions/:id/messages",
  validate(idParamSchema, "params"),
  validate(postMessageSchema),
  postMessage
);
router.post("/discussions/:id/close", validate(idParamSchema, "params"), closeDiscussion);

module.exports = router;
