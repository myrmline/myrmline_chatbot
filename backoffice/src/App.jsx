import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import ThemesPage from "./pages/ThemesPage";
import QuestionsPage from "./pages/QuestionsPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import AdminsPage from "./pages/AdminsPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/themes"
          element={
            <ProtectedRoute>
              <Layout>
                <ThemesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Layout>
                <QuestionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/discussions"
          element={
            <ProtectedRoute>
              <Layout>
                <DiscussionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admins"
          element={
            <ProtectedRoute requireRole="super_admin">
              <Layout>
                <AdminsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/themes" replace />} />
        <Route path="*" element={<Navigate to="/themes" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
