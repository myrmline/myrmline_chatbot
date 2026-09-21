// ============================================================
// Middleware Multer : gère l'upload des fichiers d'import
// (TXT / PDF / DOCX) et les range dans le dossier du thème
// correspondant (uploads/<folder_name>/).
// ============================================================

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const config = require("../config/env");
const db = require("../db");
const ApiError = require("../utils/ApiError");

const ALLOWED_MIME_TYPES = {
  "text/plain": "txt",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const themeId = parseInt(req.body.theme_id || req.params.themeId, 10);
      if (!themeId) {
        return cb(new ApiError(400, "Le champ theme_id est requis pour l'import."));
      }

      const theme = await db("chatbot_themes").where({ id: themeId }).first();
      if (!theme) {
        return cb(new ApiError(404, "Thème introuvable."));
      }

      // Chaque thème a son propre dossier d'upload, nommé d'après le thème
      const themeFolder = path.join(config.uploadsRoot, theme.folder_name);
      if (!fs.existsSync(themeFolder)) {
        fs.mkdirSync(themeFolder, { recursive: true });
      }

      req.uploadTheme = theme; // rendu disponible au contrôleur
      cb(null, themeFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    return cb(
      new ApiError(400, "Format de fichier non autorisé. Formats acceptés : TXT, PDF, DOCX."),
      false
    );
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = { upload, ALLOWED_MIME_TYPES };
