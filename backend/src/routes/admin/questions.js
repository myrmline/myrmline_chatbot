const express = require("express");
const router = express.Router();

const {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../../controllers/questionController");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
  createQuestionSchema,
  updateQuestionSchema,
  listQuestionsQuerySchema,
} = require("../../validators/questionValidators");
const { idParamSchema } = require("../../validators/commonValidators");

router.use(requireAuth);

router.get("/", validate(listQuestionsQuerySchema, "query"), listQuestions);
router.get("/:id", validate(idParamSchema, "params"), getQuestion);
router.post("/", validate(createQuestionSchema), createQuestion);
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateQuestionSchema),
  updateQuestion
);
router.delete("/:id", validate(idParamSchema, "params"), deleteQuestion);

module.exports = router;
