import React, { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const EMPTY_FORM = { theme_id: "", question: "", answer: "", is_active: true };

function QuestionsPage() {
  const [themes, setThemes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [themeFilter, setThemeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [importOpen, setImportOpen] = useState(false);
  const [importThemeId, setImportThemeId] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);

  const loadThemes = async () => {
    const res = await api.get("/themes");
    setThemes(res.data.themes);
  };

  const loadQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/questions", {
        params: { theme_id: themeFilter || undefined, search: search || undefined, page, pageSize: 10 },
      });
      setQuestions(res.data.questions);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadQuestions();
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setForm({ ...EMPTY_FORM, theme_id: themeFilter || (themes[0]?.id ?? "") });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setForm({
      theme_id: question.theme_id,
      question: question.question,
      answer: question.answer,
      is_active: question.is_active,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, theme_id: parseInt(form.theme_id, 10) };
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion.id}`, payload);
      } else {
        await api.post("/questions", payload);
      }
      setModalOpen(false);
      loadQuestions();
    } catch (err) {
      setFormError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    if (!window.confirm("Supprimer cette question ?")) return;
    try {
      await api.delete(`/questions/${question.id}`);
      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  const openImportModal = () => {
    setImportThemeId(themeFilter || (themes[0]?.id ?? ""));
    setImportFile(null);
    setImportResult(null);
    setImportError("");
    setImportOpen(true);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) {
      setImportError("Veuillez sélectionner un fichier (TXT, PDF ou DOCX).");
      return;
    }
    setImporting(true);
    setImportError("");
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("theme_id", importThemeId);
      formData.append("file", importFile);
      const res = await api.post("/imports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult(res.data);
      loadQuestions();
    } catch (err) {
      setImportError(err.response?.data?.error || "Erreur lors de l'import du fichier.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Questions & Réponses</h2>
        <div>
          <button className="btn btn-secondary" onClick={openImportModal} style={{ marginRight: 8 }}>
            ⬆ Importer un fichier
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Nouvelle question
          </button>
        </div>
      </div>

      <form className="filters-bar" onSubmit={handleSearchSubmit}>
        <select value={themeFilter} onChange={(e) => { setThemeFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les thèmes</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <input
          placeholder="Rechercher dans les questions/réponses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <button className="btn btn-secondary" type="submit">Rechercher</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state">Chargement...</div>
        ) : questions.length === 0 ? (
          <div className="empty-state">Aucune question trouvée.</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Thème</th>
                  <th>Question</th>
                  <th>Réponse</th>
                  <th>Origine</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.theme_name}</td>
                    <td style={{ maxWidth: 260 }}>{q.question}</td>
                    <td style={{ maxWidth: 320, color: "#666" }}>{q.answer}</td>
                    <td>{q.source === "import" ? "Import" : "Manuel"}</td>
                    <td>
                      <span className={`badge ${q.is_active ? "badge-active" : "badge-inactive"}`}>
                        {q.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-small" onClick={() => openEditModal(q)}>
                        Modifier
                      </button>{" "}
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(q)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                className="btn btn-secondary btn-small"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Précédent
              </button>
              <span>Page {pagination.page} / {pagination.totalPages || 1}</span>
              <button
                className="btn btn-secondary btn-small"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant →
              </button>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingQuestion ? "Modifier la question" : "Nouvelle question"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="form-row">
              <label htmlFor="q-theme">Thème</label>
              <select
                id="q-theme"
                value={form.theme_id}
                onChange={(e) => setForm({ ...form, theme_id: e.target.value })}
                required
              >
                <option value="" disabled>Choisir un thème</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="q-question">Question</label>
              <textarea
                id="q-question"
                rows={2}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="q-answer">Réponse</label>
              <textarea
                id="q-answer"
                rows={4}
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                required
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
                Question active (utilisée par le chatbot)
              </label>
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </Modal>
      )}

      {importOpen && (
        <Modal title="Importer des questions/réponses" onClose={() => setImportOpen(false)}>
          <form onSubmit={handleImportSubmit}>
            {importError && <div className="alert alert-error">{importError}</div>}
            {importResult && (
              <div className="alert alert-success">
                {importResult.questionsImported} question(s) importée(s) avec succès dans le thème
                choisi. Le fichier a été stocké dans son dossier dédié.
              </div>
            )}

            <div className="form-row">
              <label htmlFor="import-theme">Thème cible</label>
              <select
                id="import-theme"
                value={importThemeId}
                onChange={(e) => setImportThemeId(e.target.value)}
                required
              >
                <option value="" disabled>Choisir un thème</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="import-file">Fichier (.txt, .pdf, .docx)</label>
              <input
                id="import-file"
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={(e) => setImportFile(e.target.files[0])}
                required
              />
              <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                Format attendu : lignes "Q: ..." suivies de "R: ..." (ou "Question :" / "Réponse :"),
                séparées par une ligne vide entre chaque couple.
              </p>
            </div>

            <button className="btn btn-primary" type="submit" disabled={importing}>
              {importing ? "Import en cours..." : "Importer"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default QuestionsPage;
