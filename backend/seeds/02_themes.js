// ============================================================
// Seed : crée les thèmes initiaux du chatbot.
// Chaque thème possède un dossier d'upload dédié (folder_name),
// créé physiquement sur le disque par le script.
// ============================================================

const fs = require("fs");
const path = require("path");
const { slugify } = require("../src/utils/slugify");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

const THEMES = [
  {
    name: "Nettoyage & Hydratation",
    description:
      "Nettoyants, démaquillage, exfoliation, gommages, crèmes de jour/nuit, masques et hydratation quotidienne.",
  },
  {
    name: "Acné & Imperfections",
    description:
      "Acné, points noirs, boutons, cicatrices et conseils pour les peaux à imperfections.",
  },
  {
    name: "Anti-âge & Actifs",
    description:
      "Rides, vieillissement cutané, vitamine C, rétinol, acide hyaluronique, niacinamide et sérums.",
  },
  {
    name: "Types & Besoins de peau",
    description:
      "Peau grasse, sèche, mixte, sensible, soins spécifiques homme/femme, lèvres et contour des yeux.",
  },
  {
    name: "Mode de vie & Habitudes",
    description:
      "Alimentation, sommeil, stress, hydratation interne, routines matin/soir et conseils quotidiens.",
  },
  {
    name: "Protection solaire & Saisons",
    description:
      "Crème solaire, SPF, exposition au soleil, pollution, et adaptation de la routine selon les saisons.",
  },
];

exports.seed = async function (knex) {
  const existingCount = await knex("chatbot_themes").count("id as count").first();
  if (parseInt(existingCount.count, 10) > 0) {
    return; // Seed idempotent : ne recrée pas les thèmes si déjà présents
  }

  const admin = await knex("admins").orderBy("id", "asc").first();

  if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  }

  for (const theme of THEMES) {
    const slug = slugify(theme.name);
    const folderPath = path.join(UPLOADS_ROOT, slug);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await knex("chatbot_themes").insert({
      name: theme.name,
      slug,
      folder_name: slug,
      description: theme.description,
      is_active: true,
      created_by: admin ? admin.id : null,
    });
  }
};
