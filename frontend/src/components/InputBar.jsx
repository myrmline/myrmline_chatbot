import React, { useState } from "react";
import "./InputBar.css";

// Champ de saisie + bouton Envoyer + bouton Effacer la conversation
function InputBar({ onSend, onClear, disabled, clearLabel = "Effacer la conversation" }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <input
        type="text"
        className="input-field"
        placeholder="Écrivez votre question sur les soins de la peau..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button className="btn btn-send" onClick={handleSend} disabled={disabled}>
        Envoyer
      </button>
      <button className="btn btn-clear" onClick={onClear} disabled={disabled}>
        {clearLabel}
      </button>
    </div>
  );
}

export default InputBar;
