// ============================================================
// Middleware d'authentification (backoffice uniquement).
// Vérifie le token JWT envoyé dans l'en-tête Authorization et
// attache l'administrateur courant à req.admin.
// ============================================================

const jwt = require("jsonwebtoken");
const config = require("../config/env");
const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentification requise.");
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw new ApiError(401, "Token invalide ou expiré.");
  }

  const admin = await db("admins").where({ id: payload.sub }).first();
  if (!admin || !admin.is_active) {
    throw new ApiError(401, "Compte administrateur introuvable ou désactivé.");
  }

  // On ne propage jamais le hash du mot de passe
  delete admin.password_hash;
  req.admin = admin;
  next();
});

// Restreint l'accès à certains rôles (ex: gestion des administrateurs)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return next(new ApiError(403, "Vous n'avez pas les droits nécessaires pour cette action."));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
