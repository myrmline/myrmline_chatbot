// ============================================================
// Middleware global de gestion des erreurs.
// Toute erreur (ApiError, erreur Joi, erreur inattendue) transite
// ici et est renvoyée au format JSON uniforme, sans jamais exposer
// de détails sensibles (stack trace) en production.
// ============================================================

const config = require("../config/env");

function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route non trouvée." });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Erreur applicative connue
  if (err.isApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: "Données invalides.",
      details: err.details.map((d) => d.message),
    });
  }

  // Erreur Multer (upload)
  if (err.name === "MulterError") {
    return res.status(400).json({ error: `Erreur d'upload : ${err.message}` });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Session invalide ou expirée." });
  }

  // Violation de contrainte PostgreSQL (ex: unicité)
  if (err.code === "23505") {
    return res.status(409).json({ error: "Cette ressource existe déjà." });
  }
  if (err.code === "23503") {
    return res.status(409).json({ error: "Cette opération viole une contrainte de référence." });
  }

  // Erreur inattendue : on log côté serveur, on masque le détail côté client
  console.error("Erreur non gérée :", err);
  return res.status(500).json({
    error: "Une erreur interne est survenue.",
    ...(config.env !== "production" ? { debug: err.message } : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };
