const express = require("express");
const router = express.Router();

const {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/adminController");
const { requireAuth, requireRole } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { createAdminSchema, updateAdminSchema } = require("../../validators/adminValidators");
const { idParamSchema } = require("../../validators/commonValidators");

// Toutes les routes de ce fichier sont réservées aux super_admin
router.use(requireAuth, requireRole("super_admin"));

router.get("/", listAdmins);
router.post("/", validate(createAdminSchema), createAdmin);
router.put("/:id", validate(idParamSchema, "params"), validate(updateAdminSchema), updateAdmin);
router.delete("/:id", validate(idParamSchema, "params"), deleteAdmin);

module.exports = router;
