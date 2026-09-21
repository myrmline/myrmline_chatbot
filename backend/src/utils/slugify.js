// ============================================================
// Transforme un texte en slug sûr pour URL et noms de dossiers
// (minuscules, sans accents, sans caractères spéciaux)
// ============================================================

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // remplace tout ce qui n'est pas alphanumérique par un tiret
    .replace(/^-+|-+$/g, ""); // supprime les tirets en début/fin
}

module.exports = { slugify };
