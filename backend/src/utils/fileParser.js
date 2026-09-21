// ============================================================
// Extrait des couples Question / Réponse depuis un fichier
// TXT, PDF ou DOCX.
//
// Format attendu dans le fichier (souple) :
//   Q: Comment nettoyer son visage ?
//   R: Il est recommandé de...
//
//   Question : Comment hydrater sa peau ?
//   Réponse : L'hydratation...
//
// Chaque question doit commencer par "Q:" / "Q :" / "Question:" /
// "Question :", chaque réponse par "R:" / "R :" / "A:" / "Réponse:" /
// "Réponse :". Une paire peut s'étaler sur plusieurs lignes, jusqu'à
// la balise suivante.
// ============================================================

const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const QUESTION_TAG = /^\s*(q|question)\s*[:\uFF1A]\s*/i;
const ANSWER_TAG = /^\s*(r|a|reponse|réponse|answer)\s*[:\uFF1A]\s*/i;

/**
 * Découpe un texte brut en couples { question, answer }.
 */
function extractPairs(rawText) {
  const lines = rawText
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim());

  const pairs = [];
  let currentQuestion = null;
  let currentAnswerLines = [];

  const pushPairIfComplete = () => {
    if (currentQuestion && currentAnswerLines.length > 0) {
      const answer = currentAnswerLines.join(" ").trim();
      if (answer) {
        pairs.push({ question: currentQuestion.trim(), answer });
      }
    }
  };

  for (const line of lines) {
    if (!line) continue;

    if (QUESTION_TAG.test(line)) {
      // Une nouvelle question commence : on clôt la paire précédente
      pushPairIfComplete();
      currentQuestion = line.replace(QUESTION_TAG, "");
      currentAnswerLines = [];
    } else if (ANSWER_TAG.test(line)) {
      currentAnswerLines.push(line.replace(ANSWER_TAG, ""));
    } else if (currentAnswerLines.length > 0) {
      // Ligne de suite d'une réponse multi-lignes
      currentAnswerLines.push(line);
    } else if (currentQuestion && currentAnswerLines.length === 0) {
      // Ligne de suite d'une question multi-lignes (avant la réponse)
      currentQuestion += ` ${line}`;
    }
  }
  pushPairIfComplete();

  return pairs;
}

async function parseTxtFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return extractPairs(content);
}

async function parsePdfFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return extractPairs(data.text);
}

async function parseDocxFile(filePath) {
  const { value: text } = await mammoth.extractRawText({ path: filePath });
  return extractPairs(text);
}

/**
 * Point d'entrée : détecte le type de fichier et retourne les paires Q/R.
 * @param {string} filePath chemin absolu du fichier stocké
 * @param {"txt"|"pdf"|"docx"} fileType
 */
async function parseFile(filePath, fileType) {
  switch (fileType) {
    case "txt":
      return parseTxtFile(filePath);
    case "pdf":
      return parsePdfFile(filePath);
    case "docx":
      return parseDocxFile(filePath);
    default:
      throw new Error(`Type de fichier non supporté : ${fileType}`);
  }
}

module.exports = { parseFile, extractPairs };
