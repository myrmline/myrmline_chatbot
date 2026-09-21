// ============================================================
// Serveur Express - Skin Care Assistant (Backend)
// Expose deux familles d'API :
//   - /api/public/*  -> consommée par le client chatbot (sans auth)
//   - /api/admin/*   -> consommée par le backoffice (JWT requis)
// ============================================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const config = require("./src/config/env");
const { notFoundHandler, errorHandler } = require("./src/middlewares/errorHandler");

const app = express();

// Sécurité HTTP de base (en-têtes)
app.use(helmet());

// CORS restreint aux origines déclarées dans .env (frontend chatbot + backoffice)
app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origine (ex: curl, Postman) et les origines listées
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origine non autorisée par la politique CORS."));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Route de santé
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Skin Care Assistant API is running." });
});

// APIs
app.use("/api/public", require("./src/routes/public"));
app.use("/api/admin", require("./src/routes/admin"));

// Fichiers importés (accès en lecture seule, utile pour vérification côté backoffice)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 puis gestion centralisée des erreurs (toujours en dernier)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`✅ Skin Care Assistant backend démarré sur http://localhost:${config.port}`);
});
