import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const links = [
  { to: "/themes", label: "🎨 Thèmes" },
  { to: "/questions", label: "💬 Questions" },
  { to: "/discussions", label: "🗨️ Discussions" },
  { to: "/admins", label: "🔐 Administrateurs" },
];

function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">🌿</span>
        <div>
          <div className="sidebar-title">Skin Care</div>
          <div className="sidebar-subtitle">Backoffice</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? " sidebar-link-active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {admin && (
          <div className="sidebar-user">
            <div className="sidebar-user-name">{admin.name}</div>
            <div className="sidebar-user-role">{admin.role === "super_admin" ? "Super admin" : "Admin"}</div>
          </div>
        )}
        <button className="btn btn-secondary sidebar-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
