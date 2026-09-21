import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Empêche l'accès aux pages du backoffice sans authentification valide
function ProtectedRoute({ children, requireRole }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="empty-state">Chargement...</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && admin.role !== requireRole) {
    return <div className="empty-state">Accès réservé aux super administrateurs.</div>;
  }

  return children;
}

export default ProtectedRoute;
