// ============================================================
// CRUD des thèmes du chatbot.
// Chaque thème possède un dossier d'upload dédié (nommé d'après
// le thème) créé/renommé/supprimé automatiquement sur le disque.
// ============================================================

const fs = require("fs");
const path = require("path");
const db = require("../db");
const config = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { slugify } = require("../utils/slugify");

async function buildUniqueSlug(baseName, excludeId = null) {
  const base = slugify(baseName) || "theme";
  let slug = base;
  let suffix = 1;

  // Garantit l'unicité du slug (donc du nom de dossier) en base
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = db("chatbot_themes").where({ slug });
    if (excludeId) query.andWhereNot({ id: excludeId });
    const existing = await query.first();
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

function withStats(themesQuery) {
  return themesQuery
    .leftJoin("chatbot_questions", "chatbot_questions.theme_id", "chatbot_themes.id")
    .groupBy("chatbot_themes.id")
    .select(
      "chatbot_themes.*",
      db.raw("COUNT(chatbot_questions.id)::int as questions_count")
    );
}

// GET /api/admin/themes
const listThemes = asyncHandler(async (req, res) => {
  const themes = await withStats(db("chatbot_themes")).orderBy("chatbot_themes.created_at", "asc");
  res.json({ themes });
});

// GET /api/admin/themes/:id
const getTheme = asyncHandler(async (req, res) => {
  const theme = await db("chatbot_themes").where({ id: req.params.id }).first();
  if (!theme) throw new ApiError(404, "Thème introuvable.");
  res.json({ theme });
});

// POST /api/admin/themes
const createTheme = asyncHandler(async (req, res) => {
  const { name, description, is_active } = req.body;

  const existingName = await db("chatbot_themes")
    .whereRaw("LOWER(name) = ?", [name.toLowerCase()])
    .first();
  if (existingName) {
    throw new ApiError(409, "Un thème avec ce nom existe déjà.");
  }

  const slug = await buildUniqueSlug(name);
  const folderPath = path.join(config.uploadsRoot, slug);
  fs.mkdirSync(folderPath, { recursive: true });

  const [theme] = await db("chatbot_themes")
    .insert({
      name,
      slug,
      folder_name: slug,
      description: description || null,
      is_active: is_active !== undefined ? is_active : true,
      created_by: req.admin.id,
    })
    .returning("*");

  res.status(201).json({ theme });
});

// PUT /api/admin/themes/:id
const updateTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const theme = await db("chatbot_themes").where({ id }).first();
  if (!theme) throw new ApiError(404, "Thème introuvable.");

  const updates = { ...req.body };

  // Si le nom change, on renomme aussi le slug/dossier physique pour rester cohérent
  if (updates.name && updates.name !== theme.name) {
    const existingName = await db("chatbot_themes")
      .whereRaw("LOWER(name) = ?", [updates.name.toLowerCase()])
      .andWhereNot({ id })
      .first();
    if (existingName) {
      throw new ApiError(409, "Un thème avec ce nom existe déjà.");
    }

    const newSlug = await buildUniqueSlug(updates.name, id);
    const oldFolder = path.join(config.uploadsRoot, theme.folder_name);
    const newFolder = path.join(config.uploadsRoot, newSlug);

    if (fs.existsSync(oldFolder)) {
      fs.renameSync(oldFolder, newFolder);
    } else {
      fs.mkdirSync(newFolder, { recursive: true });
    }

    updates.slug = newSlug;
    updates.folder_name = newSlug;
  }

  const [updated] = await db("chatbot_themes").where({ id }).update(updates).returning("*");
  res.json({ theme: updated });
});

// DELETE /api/admin/themes/:id
const deleteTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const theme = await db("chatbot_themes").where({ id }).first();
  if (!theme) throw new ApiError(404, "Thème introuvable.");

  const discussionsCount = await db("chatbot_discussions")
    .where({ theme_id: id })
    .count("id as count")
    .first();

  if (parseInt(discussionsCount.count, 10) > 0) {
    throw new ApiError(
      409,
      "Impossible de supprimer ce thème : des discussions y sont rattachées. Désactivez-le plutôt."
    );
  }

  await db("chatbot_themes").where({ id }).del(); // CASCADE supprime questions & imports liés

  const folderPath = path.join(config.uploadsRoot, theme.folder_name);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }

  res.json({ message: "Thème supprimé avec succès." });
});

module.exports = { listThemes, getTheme, createTheme, updateTheme, deleteTheme };
