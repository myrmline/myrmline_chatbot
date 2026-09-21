import React, { useEffect, useState } from "react";
import { fetchThemes } from "../services/chatService";
import "./ThemeSelector.css";

// Affiche la liste des thèmes actifs et laisse l'utilisateur en choisir un
function ThemeSelector({ userName, onSelect }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchThemes()
      .then(setThemes)
      .catch(() => setError("Impossible de charger les thèmes. Vérifiez que le serveur backend est démarré."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="theme-selector">
      <h2 className="theme-selector-title">Bonjour {userName} 🌸</h2>
      <p className="theme-selector-subtitle">Sur quel sujet souhaitez-vous échanger aujourd'hui ?</p>

      {loading && <p className="theme-selector-loading">Chargement des thèmes...</p>}
      {error && <p className="field-error">{error}</p>}

      <div className="theme-list">
        {themes.map((theme) => (
          <button key={theme.id} className="theme-card" onClick={() => onSelect(theme)}>
            <div className="theme-card-name">{theme.name}</div>
            {theme.description && <div className="theme-card-description">{theme.description}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
