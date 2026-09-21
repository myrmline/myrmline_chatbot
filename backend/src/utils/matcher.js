// ============================================================
// Moteur de correspondance question -> réponse (aucune IA).
// Reçoit la liste des questions actives d'un thème et le message
// de l'utilisateur, et retourne la meilleure correspondance.
// ============================================================

const DEFAULT_REPLY =
  "Désolé, je ne connais pas encore la réponse à cette question. Essayez une autre question sur les soins de la peau.";

// Normalise une chaîne pour faciliter la comparaison
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[?!.,]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * @param {Array<{id:number, question:string, answer:string}>} questions
 * @param {string} userMessage
 * @returns {{ answer: string, matchedQuestionId: number|null }}
 */
function findAnswer(questions, userMessage) {
  const normalizedUserMessage = normalize(userMessage);

  // 1) Correspondance exacte
  const exactMatch = questions.find(
    (item) => normalize(item.question) === normalizedUserMessage
  );
  if (exactMatch) {
    return { answer: exactMatch.answer, matchedQuestionId: exactMatch.id };
  }

  // 2) Correspondance partielle (une question "contient" l'autre)
  const partialMatch = questions.find((item) => {
    const normalizedQuestion = normalize(item.question);
    return (
      normalizedUserMessage.includes(normalizedQuestion) ||
      normalizedQuestion.includes(normalizedUserMessage)
    );
  });
  if (partialMatch) {
    return { answer: partialMatch.answer, matchedQuestionId: partialMatch.id };
  }

  // 3) Correspondance par mots-clés significatifs communs (au moins 2 mots > 3 lettres)
  const userWords = normalizedUserMessage.split(" ").filter((w) => w.length > 3);

  let bestMatch = null;
  let bestScore = 0;

  questions.forEach((item) => {
    const questionWords = normalize(item.question).split(" ");
    const commonWords = userWords.filter((w) => questionWords.includes(w));
    if (commonWords.length > bestScore) {
      bestScore = commonWords.length;
      bestMatch = item;
    }
  });

  if (bestMatch && bestScore >= 2) {
    return { answer: bestMatch.answer, matchedQuestionId: bestMatch.id };
  }

  return { answer: DEFAULT_REPLY, matchedQuestionId: null };
}

module.exports = { findAnswer, DEFAULT_REPLY };
