const express = require("express");
const router = express.Router();

const { listDiscussions, getDiscussion } = require("../../controllers/discussionController");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { listDiscussionsQuerySchema } = require("../../validators/discussionValidators");
const { idParamSchema } = require("../../validators/commonValidators");

router.use(requireAuth);

router.get("/", validate(listDiscussionsQuerySchema, "query"), listDiscussions);
router.get("/:id", validate(idParamSchema, "params"), getDiscussion);

module.exports = router;
