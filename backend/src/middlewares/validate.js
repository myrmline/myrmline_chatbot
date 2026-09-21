// ============================================================
// Middleware générique de validation (Joi).
// Usage : validate(schema, "body" | "query" | "params")
// ============================================================

function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(error); // capturé par errorHandler (err.isJoi === true)
    }

    req[source] = value;
    next();
  };
}

module.exports = validate;
