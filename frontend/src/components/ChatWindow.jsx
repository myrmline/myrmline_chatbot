import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import "./ChatWindow.css";

// Zone d'affichage de la conversation (historique des messages)
function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);

  // Fait défiler automatiquement vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <p className="chat-window-empty">
          Posez une question sur les soins de la peau pour démarrer la conversation 🌸
        </p>
      )}

      {messages.map((msg, index) => (
        <MessageBubble key={index} sender={msg.sender} text={msg.text} />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
