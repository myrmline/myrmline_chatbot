// ============================================================
// Authentification du backoffice (JWT)
// ============================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function signToken(admin) {
  return jwt.sign({ sub: admin.id, role: admin.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function sanitizeAdmin(admin) {
  const { password_hash, ...safe } = admin;
  return safe;
}

// POST /api/admin/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await db("admins").whereRaw("LOWER(email) = ?", [email.toLowerCase()]).first();

  // Message volontairement générique pour ne pas révéler si l'email existe
  if (!admin || !admin.is_active) {
    throw new ApiError(401, "Identifiants incorrects.");
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, "Identifiants incorrects.");
  }

  await db("admins").where({ id: admin.id }).update({ last_login_at: db.fn.now() });

  const token = signToken(admin);
  res.json({ token, admin: sanitizeAdmin(admin) });
});

// GET /api/admin/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});

// POST /api/admin/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await db("admins").where({ id: req.admin.id }).first();
  const matches = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!matches) {
    throw new ApiError(400, "Le mot de passe actuel est incorrect.");
  }

  const password_hash = await bcrypt.hash(newPassword, 12);
  await db("admins").where({ id: admin.id }).update({ password_hash });

  res.json({ message: "Mot de passe mis à jour avec succès." });
});

module.exports = { login, me, changePassword, sanitizeAdmin };
