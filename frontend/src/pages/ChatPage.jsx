import React, { useState } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import ThemeSelector from "../components/ThemeSelector";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import { startDiscussion, sendMessage, closeDiscussion } from "../services/chatService";
import "./ChatPage.css";

// Étapes du parcours utilisateur :
// 1) "contact"  -> saisie nom / email / téléphone
// 2) "theme"    -> choix du thème de discussion
// 3) "chat"     -> conversation avec le chatbot
const STEPS = { CONTACT: "contact", THEME: "theme", CHAT: "chat" };

// Page principale : assemble tout le parcours du chatbot
function ChatPage() {
  const [step, setStep] = useState(STEPS.CONTACT);
  const [contact, setContact] = useState(null);
  const [theme, setTheme] = useState(null);
  const [session, setSession] = useState(null); // { discussionId, token }

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  // Étape 1 : coordonnées saisies -> on passe à la sélection du thème
  const handleContactSubmit = (formValues) => {
    setContact(formValues);
    setStep(STEPS.THEME);
  };

  // Étape 2 : thème choisi -> on démarre une NOUVELLE discussion indépendante
  const handleThemeSelect = async (selectedTheme) => {
    setError("");
    try {
      const result = await startDiscussion({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        themeId: selectedTheme.id,
      });
      setSession({ discussionId: result.discussionId, token: result.token });
      setTheme(selectedTheme);
      setMessages([]);
      setStep(STEPS.CHAT);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Impossible de démarrer la discussion. Vérifiez que le serveur backend est démarré."
      );
    }
  };

  // Étape 3 : envoi d'un message utilisateur
  const handleSend = async (userText) => {
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);

    const reply = await sendMessage(session.discussionId, session.token, userText);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 500);
  };

  // "Nouvelle discussion" : clôture la discussion en cours puis relance tout
  // le parcours depuis le formulaire de contact. Une nouvelle discussion,
  // indépendante, sera créée même si les mêmes coordonnées sont ressaisies.
  const handleNewDiscussion = async () => {
    if (session) {
      await closeDiscussion(session.discussionId, session.token);
    }
    setSession(null);
    setTheme(null);
    setMessages([]);
    setStep(STEPS.CONTACT);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <Header themeName={theme?.name} />

        {error && <div className="chat-error">{error}</div>}

        {step === STEPS.CONTACT && <ContactForm onSubmit={handleContactSubmit} />}

        {step === STEPS.THEME && (
          <ThemeSelector userName={contact?.name} onSelect={handleThemeSelect} />
        )}

        {step === STEPS.CHAT && (
          <>
            <ChatWindow messages={messages} isTyping={isTyping} />
            <InputBar
              onSend={handleSend}
              onClear={handleNewDiscussion}
              disabled={isTyping}
              clearLabel="Nouvelle discussion"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
