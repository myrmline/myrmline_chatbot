// ============================================================
// Service de communication avec l'API publique du backend
// (aucune authentification requise ; chaque discussion est
// protégée par un token opaque généré à sa création)
// ============================================================

import axios from "axios";

const API_URL = "http://localhost:5000/api/public";

/**
 * Récupère la liste des thèmes actifs proposés aux utilisateurs.
 * @returns {Promise<Array<{id:number, name:string, description:string}>>}
 */
export async function fetchThemes() {
  const response = await axios.get(`${API_URL}/themes`);
  return response.data.themes;
}

/**
 * Démarre une nouvelle discussion indépendante pour ce contact et ce thème.
 * Chaque appel crée une nouvelle discussion, même si le contact a déjà
 * discuté auparavant avec les mêmes coordonnées.
 * @returns {Promise<{discussionId:number, token:string, theme:object}>}
 */
export async function startDiscussion({ name, email, phone, themeId }) {
  const response = await axios.post(`${API_URL}/discussions`, {
    name,
    email,
    phone,
    theme_id: themeId,
  });
  return response.data;
}

/**
 * Envoie un message utilisateur dans une discussion et retourne la réponse du bot.
 * @returns {Promise<string>} la réponse du chatbot
 */
export async function sendMessage(discussionId, token, message) {
  try {
    const response = await axios.post(
      `${API_URL}/discussions/${discussionId}/messages`,
      { message },
      { params: { token } }
    );
    return response.data.reply;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    return "Une erreur est survenue. Veuillez vérifier que le serveur backend est bien démarré.";
  }
}

/**
 * Clôture la discussion courante (facultatif, appelé à la fin de la session).
 */
export async function closeDiscussion(discussionId, token) {
  try {
    await axios.post(`${API_URL}/discussions/${discussionId}/close`, null, {
      params: { token },
    });
  } catch (error) {
    console.error("Erreur lors de la clôture de la discussion :", error);
  }
}
