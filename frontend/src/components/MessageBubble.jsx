import React from "react";
import "./MessageBubble.css";

// Affiche un message unique dans la conversation
// sender: "user" ou "bot"
function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`message-row ${isUser ? "message-row-user" : "message-row-bot"}`}>
      <div className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-bot"}`}>
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;
