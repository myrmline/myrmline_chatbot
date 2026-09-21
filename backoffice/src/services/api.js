// ============================================================
// Instance Axios partagée par tout le backoffice.
// Injecte automatiquement le token JWT stocké après connexion,
// et redirige vers /login si le token devient invalide (401).
// ============================================================

import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api/admin";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skincare_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("skincare_admin_token");
      localStorage.removeItem("skincare_admin_profile");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
