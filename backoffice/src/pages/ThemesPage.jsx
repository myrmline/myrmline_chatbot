import React, { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const EMPTY_FORM = { name: "", description: "", is_active: true };

function ThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadThemes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/themes");
      setThemes(res.data.themes);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des thèmes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const openCreateModal = () => {
    setEditingTheme(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (theme) => {
    setEditingTheme(theme);
    setForm({ name: theme.name, description: theme.description || "", is_active: theme.is_active });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingTheme) {
        await api.put(`/themes/${editingTheme.id}`, form);
      } else {
        await api.post("/themes", form);
      }
      setModalOpen(false);
      loadThemes();
    } catch (err) {
      setFormError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (theme) => {
    if (!window.confirm(`Supprimer le thème "${theme.name}" et son dossier d'upload ?`)) return;
    try {
      await api.delete(`/themes/${theme.id}`);
      loadThemes();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Thèmes du chatbot</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Nouveau thème
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state">Chargement...</div>
        ) : themes.length === 0 ? (
          <div className="empty-state">Aucun thème pour le moment.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Dossier d'upload</th>
                <th>Description</th>
                <th>Questions</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme) => (
                <tr key={theme.id}>
                  <td><strong>{theme.name}</strong></td>
                  <td><code>/uploads/{theme.folder_name}</code></td>
                  <td>{theme.description}</td>
                  <td>{theme.questions_count}</td>
                  <td>
                    <span className={`badge ${theme.is_active ? "badge-active" : "badge-inactive"}`}>
                      {theme.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-small" onClick={() => openEditModal(theme)}>
                      Modifier
                    </button>{" "}
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(theme)}>
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
        <Modal title={editingTheme ? "Modifier le thème" : "Nouveau thème"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="form-row">
              <label htmlFor="theme-name">Nom du thème</label>
              <input
                id="theme-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="theme-description">Description</label>
              <textarea
                id="theme-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  style={{ width: "auto", marginRight: 8 }}
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Thème actif (visible pour les utilisateurs du chatbot)
              </label>
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

export default ThemesPage;
