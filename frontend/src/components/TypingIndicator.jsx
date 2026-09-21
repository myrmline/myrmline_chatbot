import React from "react";
import "./TypingIndicator.css";

// Petite animation "Le bot est en train d'écrire..."
function TypingIndicator() {
  return (
    <div className="message-row message-row-bot">
      <div className="message-bubble message-bubble-bot typing-bubble">
        <span className="typing-text">Le bot est en train d'écrire</span>
        <span className="typing-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}

export default TypingIndicator;
