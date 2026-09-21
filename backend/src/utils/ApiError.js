// ============================================================
// Erreur applicative typée, portant un code de statut HTTP.
// Permet de lever `throw new ApiError(404, "Introuvable")`
// depuis n'importe quel contrôleur.
// ============================================================

class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isApiError = true;
  }
}

module.exports = ApiError;
