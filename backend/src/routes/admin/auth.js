const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const { login, me, changePassword } = require("../../controllers/authController");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { loginSchema, changePasswordSchema } = require("../../validators/authValidators");

// Limite les tentatives de connexion pour freiner le bruteforce
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives de connexion. Réessayez plus tard." },
});

router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;
