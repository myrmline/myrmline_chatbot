import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./DiscussionsPage.css";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function DiscussionsPage() {
  const [themes, setThemes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({ name: "", email: "", phone: "", theme_id: "" });
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get("/themes").then((res) => setThemes(res.data.themes));
  }, []);

  const loadDiscussions = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, pageSize: 15 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await api.get("/discussions", { params });
      setDiscussions(res.data.discussions);
      setPagination(res.data.pagination);
      if (!selectedId && res.data.discussions.length > 0) {
        setSelectedId(res.data.discussions[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des discussions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    api
      .get(`/discussions/${selectedId}`)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadDiscussions();
  };

  const handleResetFilters = () => {
    setFilters({ name: "", email: "", phone: "", theme_id: "" });
    setPage(1);
    setTimeout(loadDiscussions, 0);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Discussions</h2>
      </div>

      <form className="filters-bar" onSubmit={handleFilterSubmit}>
        <input
          placeholder="Nom"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          placeholder="Téléphone"
          value={filters.phone}
          onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
        />
        <select
          value={filters.theme_id}
          onChange={(e) => setFilters({ ...filters, theme_id: e.target.value })}
        >
          <option value="">Tous les thèmes</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">Filtrer</button>
        <button className="btn btn-secondary" type="button" onClick={handleResetFilters}>
          Réinitialiser
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="discussions-layout">
        <div className="discussions-list card">
          {loading ? (
            <div className="empty-state">Chargement...</div>
          ) : discussions.length === 0 ? (
            <div className="empty-state">Aucune discussion trouvée.</div>
          ) : (
            <>
              {discussions.map((d) => (
                <button
                  key={d.id}
                  className={`discussion-item${d.id === selectedId ? " discussion-item-active" : ""}`}
                  onClick={() => setSelectedId(d.id)}
                >
                  <div className="discussion-item-top">
                    <span className="discussion-item-name">{d.user_name}</span>
                    <span className="discussion-item-date">{formatDate(d.started_at)}</span>
                  </div>
                  <div className="discussion-item-theme">{d.theme_name}</div>
                  <div className="discussion-item-preview">{d.last_message || "Aucun message"}</div>
                </button>
              ))}

              <div className="pagination">
                <button
                  className="btn btn-secondary btn-small"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </button>
                <span>Page {pagination.page} / {pagination.totalPages || 1}</span>
                <button
                  className="btn btn-secondary btn-small"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>

        <div className="discussion-detail card">
          {detailLoading ? (
            <div className="empty-state">Chargement de la conversation...</div>
          ) : !detail ? (
            <div className="empty-state">Sélectionnez une discussion pour voir le détail.</div>
          ) : (
            <>
              <div className="discussion-detail-header">
                <div>
                  <h3>{detail.discussion.user_name}</h3>
                  <div className="discussion-detail-meta">
                    ✉️ {detail.discussion.user_email} &nbsp;•&nbsp; 📞 {detail.discussion.user_phone}
                  </div>
                  <div className="discussion-detail-meta">
                    🎨 {detail.discussion.theme_name} &nbsp;•&nbsp; 🕒 {formatDate(detail.discussion.started_at)}
                  </div>
                </div>
                <span className={`badge ${detail.discussion.status === "open" ? "badge-active" : "badge-inactive"}`}>
                  {detail.discussion.status === "open" ? "En cours" : "Terminée"}
                </span>
              </div>

              <div className="discussion-messages">
                {detail.messages.length === 0 ? (
                  <div className="empty-state">Aucun message échangé pour l'instant.</div>
                ) : (
                  detail.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`chat-row ${m.sender === "user" ? "chat-row-user" : "chat-row-bot"}`}
                    >
                      <div className={`chat-bubble ${m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
                        {m.content}
                        <div className="chat-bubble-time">{formatDate(m.created_at)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionsPage;
