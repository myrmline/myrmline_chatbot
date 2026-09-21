// ============================================================
// Contexte d'authentification : stocke l'administrateur connecté,
// expose login()/logout(), et persiste le token en localStorage.
// ============================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("skincare_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        localStorage.removeItem("skincare_admin_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("skincare_admin_token", res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem("skincare_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
