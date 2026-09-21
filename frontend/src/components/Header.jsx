import React from "react";
import "./Header.css";

// En-tête de l'application : logo + titre (+ thème choisi, une fois la
// discussion démarrée)
function Header({ themeName }) {
  return (
    <header className="header">
      <div className="header-logo" aria-hidden="true">
        🌿
      </div>
      <div>
        <h1 className="header-title">Skin Care Assistant</h1>
        {themeName && <div className="header-subtitle">Thème : {themeName}</div>}
      </div>
    </header>
  );
}

export default Header;
