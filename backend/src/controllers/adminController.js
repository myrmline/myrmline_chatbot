// ============================================================
// Gestion des administrateurs et de l'accès au backoffice
// Toutes les routes sont réservées au rôle "super_admin"
// ============================================================

const bcrypt = require("bcryptjs");
const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeAdmin } = require("./authController");

// GET /api/admin/admins
const listAdmins = asyncHandler(async (req, res) => {
  const admins = await db("admins")
    .select("id", "name", "email", "role", "is_active", "last_login_at", "created_at")
    .orderBy("created_at", "asc");
  res.json({ admins });
});

// POST /api/admin/admins
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await db("admins").whereRaw("LOWER(email) = ?", [email.toLowerCase()]).first();
  if (existing) {
    throw new ApiError(409, "Un administrateur avec cet email existe déjà.");
  }

  const password_hash = await bcrypt.hash(password, 12);
  const [admin] = await db("admins")
    .insert({ name, email: email.toLowerCase(), password_hash, role })
    .returning("*");

  res.status(201).json({ admin: sanitizeAdmin(admin) });
});

// PUT /api/admin/admins/:id
const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, ...rest } = req.body;

  const admin = await db("admins").where({ id }).first();
  if (!admin) {
    throw new ApiError(404, "Administrateur introuvable.");
  }

  // Empêche un super_admin de se retirer lui-même son propre accès par erreur
  if (String(req.admin.id) === String(id) && rest.is_active === false) {
    throw new ApiError(400, "Vous ne pouvez pas désactiver votre propre compte.");
  }

  const updates = { ...rest };
  if (rest.email) updates.email = rest.email.toLowerCase();
  if (password) {
    updates.password_hash = await bcrypt.hash(password, 12);
  }

  const [updated] = await db("admins").where({ id }).update(updates).returning("*");
  res.json({ admin: sanitizeAdmin(updated) });
});

// DELETE /api/admin/admins/:id
const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (String(req.admin.id) === String(id)) {
    throw new ApiError(400, "Vous ne pouvez pas supprimer votre propre compte.");
  }

  const admin = await db("admins").where({ id }).first();
  if (!admin) {
    throw new ApiError(404, "Administrateur introuvable.");
  }

  await db("admins").where({ id }).del();
  res.json({ message: "Administrateur supprimé avec succès." });
});

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin };
