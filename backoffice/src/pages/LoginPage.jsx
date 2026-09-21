import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/themes");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">🌿</div>
        <h1>Skin Care Assistant</h1>
        <p className="login-subtitle">Connexion au backoffice</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@skincare.local"
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
