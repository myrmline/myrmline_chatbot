import React, { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = { name: "", email: "", password: "", role: "admin" };

function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admins");
      setAdmins(res.data.admins);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "Accès réservé aux super administrateurs."
          : err.response?.data?.error || "Erreur lors du chargement."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setForm({ name: admin.name, email: admin.email, password: "", role: admin.role });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingAdmin) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/admins/${editingAdmin.id}`, payload);
      } else {
        await api.post("/admins", form);
      }
      setModalOpen(false);
      loadAdmins();
    } catch (err) {
      setFormError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (admin) => {
    try {
      await api.put(`/admins/${admin.id}`, { is_active: !admin.is_active });
      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Supprimer l'administrateur "${admin.name}" ?`)) return;
    try {
      await api.delete(`/admins/${admin.id}`);
      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Administrateurs & accès au backoffice</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Nouvel administrateur
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state">Chargement...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>{a.name} {a.id === currentAdmin?.id && <em>(vous)</em>}</td>
                  <td>{a.email}</td>
                  <td>{a.role === "super_admin" ? "Super admin" : "Admin"}</td>
                  <td>
                    <span className={`badge ${a.is_active ? "badge-active" : "badge-inactive"}`}>
                      {a.is_active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td>{a.last_login_at ? new Date(a.last_login_at).toLocaleString("fr-FR") : "Jamais"}</td>
                  <td>
                    <button className="btn btn-secondary btn-small" onClick={() => openEditModal(a)}>
                      Modifier
                    </button>{" "}
                    <button className="btn btn-secondary btn-small" onClick={() => toggleActive(a)}>
                      {a.is_active ? "Désactiver" : "Activer"}
                    </button>{" "}
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(a)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingAdmin ? "Modifier l'administrateur" : "Nouvel administrateur"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="form-row">
              <label htmlFor="a-name">Nom</label>
              <input
                id="a-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="a-email">Email</label>
              <input
                id="a-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="a-password">
                {editingAdmin ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
              </label>
              <input
                id="a-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingAdmin}
                minLength={8}
              />
            </div>

            <div className="form-row">
              <label htmlFor="a-role">Rôle</label>
              <select id="a-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super admin</option>
              </select>
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminsPage;
