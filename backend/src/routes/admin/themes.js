const express = require("express");
const router = express.Router();

const {
  listThemes,
  getTheme,
  createTheme,
  updateTheme,
  deleteTheme,
} = require("../../controllers/themeController");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { createThemeSchema, updateThemeSchema } = require("../../validators/themeValidators");
const { idParamSchema } = require("../../validators/commonValidators");

router.use(requireAuth);

router.get("/", listThemes);
router.get("/:id", validate(idParamSchema, "params"), getTheme);
router.post("/", validate(createThemeSchema), createTheme);
router.put("/:id", validate(idParamSchema, "params"), validate(updateThemeSchema), updateTheme);
router.delete("/:id", validate(idParamSchema, "params"), deleteTheme);

module.exports = router;
