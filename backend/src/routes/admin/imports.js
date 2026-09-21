const express = require("express");
const router = express.Router();

const {
  importQuestionsFile,
  listImports,
  deleteImport,
} = require("../../controllers/importController");
const { requireAuth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");
const validate = require("../../middlewares/validate");
const { idParamSchema } = require("../../validators/commonValidators");

router.use(requireAuth);

router.get("/", listImports);
// "file" est le nom de champ attendu par le formulaire multipart
router.post("/", upload.single("file"), importQuestionsFile);
router.delete("/:id", validate(idParamSchema, "params"), deleteImport);

module.exports = router;
