// ============================================================
// Import de questions/réponses depuis un fichier TXT / PDF / DOCX.
// Le fichier est stocké dans le dossier du thème choisi, puis
// analysé pour en extraire des couples question/réponse qui sont
// insérés dans chatbot_questions (source = "import").
// ============================================================

const path = require("path");
const fs = require("fs");
const db = require("../db");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parseFile } = require("../utils/fileParser");
const { ALLOWED_MIME_TYPES } = require("../middlewares/upload");

// POST /api/admin/imports  (multipart/form-data : file, theme_id)
const importQuestionsFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Aucun fichier reçu. Champ attendu : 'file'.");
  }

  const theme = req.uploadTheme; // fourni par le middleware upload
  const fileType = ALLOWED_MIME_TYPES[req.file.mimetype];

  let pairs = [];
  let status = "success";
  let errorMessage = null;

  try {
    pairs = await parseFile(req.file.path, fileType);
    if (pairs.length === 0) {
      status = "failed";
      errorMessage =
        "Aucun couple question/réponse détecté. Vérifiez le format du fichier (lignes 'Q:' / 'R:').";
    }
  } catch (err) {
    status = "failed";
    errorMessage = `Erreur lors de l'analyse du fichier : ${err.message}`;
  }

  // Enregistre systématiquement l'import (succès, partiel ou échec) pour traçabilité
  const [importRecord] = await db("chatbot_imports")
    .insert({
      theme_id: theme.id,
      admin_id: req.admin.id,
      original_file_name: req.file.originalname,
      stored_file_name: req.file.filename,
      file_path: path.relative(path.join(__dirname, "..", ".."), req.file.path),
      file_type: fileType,
      questions_imported: pairs.length,
      status,
      error_message: errorMessage,
    })
    .returning("*");

  let insertedQuestions = [];
  if (pairs.length > 0) {
    const rows = pairs.map((p) => ({
      theme_id: theme.id,
      question: p.question,
      answer: p.answer,
      source: "import",
      import_id: importRecord.id,
      is_active: true,
      created_by: req.admin.id,
    }));
    insertedQuestions = await db("chatbot_questions").insert(rows).returning("*");
  }

  res.status(status === "failed" ? 422 : 201).json({
    import: importRecord,
    questionsImported: insertedQuestions.length,
    questions: insertedQuestions,
  });
});

// GET /api/admin/imports?theme_id=
const listImports = asyncHandler(async (req, res) => {
  const query = db("chatbot_imports")
    .join("chatbot_themes", "chatbot_themes.id", "chatbot_imports.theme_id")
    .select(
      "chatbot_imports.*",
      "chatbot_themes.name as theme_name"
    )
    .orderBy("chatbot_imports.created_at", "desc");

  if (req.query.theme_id) query.andWhere("chatbot_imports.theme_id", req.query.theme_id);

  const imports = await query;
  res.json({ imports });
});

// DELETE /api/admin/imports/:id  (supprime aussi le fichier stocké sur disque)
const deleteImport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const importRecord = await db("chatbot_imports").where({ id }).first();
  if (!importRecord) throw new ApiError(404, "Import introuvable.");

  const absolutePath = path.join(__dirname, "..", "..", importRecord.file_path);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await db("chatbot_imports").where({ id }).del(); // questions liées: import_id passe à NULL (SET NULL)
  res.json({ message: "Import supprimé avec succès." });
});

module.exports = { importQuestionsFile, listImports, deleteImport };
