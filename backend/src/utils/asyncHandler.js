// ============================================================
// Enveloppe un contrôleur async pour transmettre automatiquement
// les erreurs au middleware d'erreurs (évite les try/catch répétés)
// ============================================================

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
