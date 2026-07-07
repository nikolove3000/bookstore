import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookApi from "../api/bookApi";
import authorApi from "../api/authorApi";
import publisherApi from "../api/publisherApi";
import categoryApi from "../api/categoryApi";

const PAGE_SIZE = 20;

const EMPTY_FORM = {
  title: "", isbn: "", price: "", stockQuantity: "", coverUrl: "",
  publicationYear: "", description: "", authorId: "", publisherId: "", categoryIds: [],
};

export default function AdminBookPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
    if (!user.role?.includes("ADMIN")) { navigate("/"); return; }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    Promise.all([authorApi.getAll(), publisherApi.getAll(), categoryApi.getAll()])
      .then(([aRes, pRes, cRes]) => {
        setAuthors(aRes.data);
        setPublishers(pRes.data);
        setCategories(cRes.data);
      })
      .catch(console.error);
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    bookApi.getAll({ page, size: PAGE_SIZE, sort: "createdAt,desc" })
      .then(res => {
        setBooks(res.data.content);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchBooks, [page]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = async (book) => {
    try {
      const res = await bookApi.getById(book.id);
      const b = res.data;
      setEditingId(b.id);
      setForm({
        title: b.title ?? "",
        isbn: b.isbn ?? "",
        price: b.price ?? "",
        stockQuantity: b.stockQuantity ?? "",
        coverUrl: b.coverUrl ?? "",
        publicationYear: b.publicationYear ?? "",
        description: b.description ?? "",
        authorId: b.author?.id ?? "",
        publisherId: b.publisher?.id ?? "",
        categoryIds: b.categories?.map(c => c.id) ?? [],
      });
      setFormError(null);
      setShowForm(true);
    } catch (err) {
      alert("Could not load book details");
    }
  };

  const toggleCategory = (catId) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        publicationYear: form.publicationYear ? parseInt(form.publicationYear, 10) : null,
        authorId: form.authorId || null,
        publisherId: form.publisherId || null,
      };
      if (editingId) {
        await bookApi.updateBook(editingId, payload);
      } else {
        await bookApi.createBook(payload);
      }
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await bookApi.deleteBook(deleteTarget.id);
      setDeleteTarget(null);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete book");
    } finally {
      setDeleting(false);
    }
  };

  const pages = [];
  if (totalPages > 0) {
    pages.push(0);
    for (let p = Math.max(1, page - 1); p <= Math.min(totalPages - 2, page + 1); p++) {
      if (!pages.includes(p)) pages.push(p);
    }
    if (totalPages > 1) pages.push(totalPages - 1);
  }

  return (
    <>
      <style>{`
        .abk-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .abk-inner{max-width:1200px;margin:0 auto;}
        .abk-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2rem;}
        .abk-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .abk-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .abk-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .abk-breadcrumb span.current{color:rgba(201,168,76,0.9);}

        .abk-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;}
        .abk-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:7px;font-style:italic;}
        .abk-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .abk-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .abk-add-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 24px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .abk-add-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}

        .abk-table{width:100%;border-collapse:collapse;margin-bottom:2.5rem;}
        .abk-th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);padding:0 1rem 1rem;text-align:left;border-bottom:0.5px solid rgba(201,168,76,0.15);font-style:italic;}
        .abk-th:last-child{text-align:right;}
        .abk-tr{border-bottom:0.5px solid rgba(201,168,76,0.07);transition:background 0.15s;}
        .abk-tr:hover{background:rgba(201,168,76,0.03);}
        .abk-td{padding:0.9rem 1rem;font-size:14px;color:rgba(255,245,230,0.78);vertical-align:middle;}
        .abk-td.right{text-align:right;}
        .abk-td-cover{width:40px;height:58px;object-fit:cover;border:0.5px solid rgba(201,168,76,0.18);}
        .abk-td-fallback{width:40px;height:58px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c,#0c0a0a);border:0.5px solid rgba(201,168,76,0.18);font-size:12px;color:rgba(201,168,76,0.35);}
        .abk-td-title{font-size:15px;color:rgba(255,245,230,0.85);}
        .abk-td-author{font-size:12px;font-style:italic;color:rgba(201,168,76,0.55);margin-top:2px;}
        .abk-td-price{font-size:14px;color:#c9a84c;}
        .abk-td-stock{font-size:12px;letter-spacing:1px;text-transform:uppercase;font-style:italic;}
        .abk-td-stock.low{color:#c0392b;}
        .abk-td-stock.ok{color:rgba(201,168,76,0.6);}
        .abk-actions{display:flex;gap:8px;justify-content:flex-end;}
        .abk-action-btn{background:none;border:0.5px solid rgba(201,168,76,0.25);padding:6px 14px;font-family:Georgia,serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
        .abk-action-btn.edit{color:rgba(201,168,76,0.65);}
        .abk-action-btn.edit:hover{border-color:#c9a84c;color:#c9a84c;}
        .abk-action-btn.delete{color:#c0392b;border-color:rgba(192,57,43,0.25);}
        .abk-action-btn.delete:hover{border-color:#c0392b;background:rgba(192,57,43,0.06);}

        .abk-pagination{display:flex;align-items:center;justify-content:center;gap:14px;}
        .abk-page-link{font-size:13px;color:rgba(201,168,76,0.5);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .abk-page-link:hover{color:#c9a84c;}
        .abk-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .abk-page-link:disabled{opacity:0.25;cursor:default;}
        .abk-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}

        .abk-loading{text-align:center;padding:4rem 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);font-style:italic;}

        .abk-modal-overlay{position:fixed;inset:0;background:rgba(4,2,2,0.85);display:flex;align-items:center;justify-content:center;z-index:2000;padding:2rem;animation:abkFade 0.2s ease;overflow-y:auto;}
        @keyframes abkFade{from{opacity:0;}to{opacity:1;}}
        .abk-modal{position:relative;background:#0F1720;border:0.5px solid rgba(201,168,76,0.22);padding:2.5rem;max-width:640px;width:100%;max-height:90vh;overflow-y:auto;animation:abkIn 0.25s ease;}
        @keyframes abkIn{from{opacity:0;transform:translateY(10px) scale(0.98);}to{opacity:1;transform:translateY(0) scale(1);}}
        .abk-modal-title{font-size:20px;color:rgba(255,245,230,0.9);letter-spacing:0.3px;margin-bottom:1.5rem;font-weight:normal;}
        .abk-form-row{display:grid;grid-template-columns:1fr 1fr;gap:0 1.4rem;}
        .abk-field{margin-bottom:1.1rem;}
        .abk-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:6px;font-style:italic;display:block;}
        .abk-input,.abk-select,.abk-textarea{width:100%;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:9px 12px;font-family:Georgia,serif;font-size:13px;color:rgba(255,245,230,0.85);outline:none;}
        .abk-textarea{min-height:80px;resize:vertical;line-height:1.6;}
        .abk-input:focus,.abk-select:focus,.abk-textarea:focus{border-color:rgba(201,168,76,0.45);}
        .abk-cat-grid{display:flex;flex-wrap:wrap;gap:8px;}
        .abk-cat-chip{padding:5px 12px;font-size:11px;border:0.5px solid rgba(201,168,76,0.25);color:rgba(201,168,76,0.55);cursor:pointer;transition:all 0.2s;}
        .abk-cat-chip.active{border-color:#c9a84c;color:#c9a84c;background:rgba(201,168,76,0.08);}
        .abk-form-error{font-size:12px;color:#c0392b;font-style:italic;margin-bottom:1rem;}
        .abk-form-actions{display:flex;gap:12px;margin-top:1.5rem;}
        .abk-save-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 26px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .abk-save-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .abk-save-btn:disabled{opacity:0.4;cursor:default;}
        .abk-cancel-btn{background:none;border:0.5px solid rgba(201,168,76,0.22);padding:11px 22px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:rgba(201,168,76,0.55);text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .abk-cancel-btn:hover{border-color:rgba(201,168,76,0.45);color:#c9a84c;}

        .abk-del-modal{position:relative;background:#0F1720;border:0.5px solid rgba(201,168,76,0.25);padding:2.5rem;max-width:380px;text-align:center;animation:abkIn 0.25s ease;}
        .abk-del-icon{font-size:22px;color:#c0392b;opacity:0.6;margin-bottom:14px;}
        .abk-del-title{font-size:18px;font-weight:normal;color:rgba(255,245,230,0.92);letter-spacing:0.5px;margin-bottom:14px;}
        .abk-del-text{font-size:14px;line-height:1.75;color:rgba(255,245,230,0.62);font-style:italic;margin-bottom:24px;}
        .abk-del-actions{display:flex;align-items:center;gap:12px;}
        .abk-del-keep{flex:1;background:none;border:0.5px solid rgba(201,168,76,0.25);padding:11px;font-family:Georgia,serif;font-size:12px;letter-spacing:1.5px;color:rgba(201,168,76,0.6);text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .abk-del-keep:hover{border-color:rgba(201,168,76,0.5);color:#c9a84c;}
        .abk-del-confirm{flex:1;background:#1a0808;border:0.5px solid #8b2020;padding:11px;font-family:Georgia,serif;font-size:12px;letter-spacing:1.5px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .abk-del-confirm:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .abk-del-confirm:disabled,.abk-del-keep:disabled{opacity:0.4;cursor:default;}
      `}</style>

      <div className="abk-root">
        <div className="abk-inner">
          <div className="abk-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">·</span>
            <span className="current">Admin — Books</span>
          </div>

          <div className="abk-head">
            <div>
              <div className="abk-kicker">✦ Admin Panel</div>
              <h1 className="abk-title">Book <em>Management</em></h1>
            </div>
            <button className="abk-add-btn" onClick={openCreateForm}>+ Add New Book</button>
          </div>

          {loading ? (
            <div className="abk-loading">✦ &nbsp;Loading&nbsp; ✦</div>
          ) : (
            <table className="abk-table">
              <thead>
                <tr>
                  <th className="abk-th"></th>
                  <th className="abk-th">Title</th>
                  <th className="abk-th">Price</th>
                  <th className="abk-th">Stock</th>
                  <th className="abk-th" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="abk-tr">
                    <td className="abk-td">
                      {book.coverUrl ? (
                        <img className="abk-td-cover" src={book.coverUrl} alt={book.title} />
                      ) : (
                        <div className="abk-td-fallback">✦</div>
                      )}
                    </td>
                    <td className="abk-td">
                      <div className="abk-td-title">{book.title}</div>
                      <div className="abk-td-author">{book.authorName}</div>
                    </td>
                    <td className="abk-td"><span className="abk-td-price">${Number(book.price).toFixed(2)}</span></td>
                    <td className="abk-td">
                      <span className={`abk-td-stock ${book.inStock ? "ok" : "low"}`}>
                        {book.inStock ? "✦ In Stock" : "✦ Out of Stock"}
                      </span>
                    </td>
                    <td className="abk-td right">
                      <div className="abk-actions">
                        <button className="abk-action-btn edit" onClick={() => openEditForm(book)}>Edit</button>
                        <button className="abk-action-btn delete" onClick={() => setDeleteTarget(book)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="abk-pagination">
              <button className="abk-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
              {pages.map((p, i) => (
                <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && p - pages[i - 1] > 1 && <span className="abk-page-gem">◆</span>}
                  <button className={`abk-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                </span>
              ))}
              <button className="abk-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="abk-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="abk-modal" onClick={e => e.stopPropagation()}>
            <h3 className="abk-modal-title">{editingId ? "Edit Book" : "Add New Book"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="abk-field">
                <label className="abk-label">Title</label>
                <input className="abk-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="abk-form-row">
                <div className="abk-field">
                  <label className="abk-label">ISBN</label>
                  <input className="abk-input" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
                </div>
                <div className="abk-field">
                  <label className="abk-label">Publication Year</label>
                  <input className="abk-input" type="number" value={form.publicationYear} onChange={e => setForm({ ...form, publicationYear: e.target.value })} />
                </div>
                <div className="abk-field">
                  <label className="abk-label">Price ($)</label>
                  <input className="abk-input" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="abk-field">
                  <label className="abk-label">Stock Quantity</label>
                  <input className="abk-input" type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} required />
                </div>
                <div className="abk-field">
                  <label className="abk-label">Author</label>
                  <select className="abk-select" value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })}>
                    <option value="">— Select —</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="abk-field">
                  <label className="abk-label">Publisher</label>
                  <select className="abk-select" value={form.publisherId} onChange={e => setForm({ ...form, publisherId: e.target.value })}>
                    <option value="">— Select —</option>
                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="abk-field">
                <label className="abk-label">Cover URL</label>
                <input className="abk-input" value={form.coverUrl} onChange={e => setForm({ ...form, coverUrl: e.target.value })} />
              </div>

              <div className="abk-field">
                <label className="abk-label">Description</label>
                <textarea className="abk-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="abk-field">
                <label className="abk-label">Categories</label>
                <div className="abk-cat-grid">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      className={`abk-cat-chip ${form.categoryIds.includes(c.id) ? "active" : ""}`}
                      onClick={() => toggleCategory(c.id)}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {formError && <p className="abk-form-error">{formError}</p>}

              <div className="abk-form-actions">
                <button type="submit" className="abk-save-btn" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Create Book"}
                </button>
                <button type="button" className="abk-cancel-btn" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="abk-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="abk-del-modal" onClick={e => e.stopPropagation()}>
            <div className="abk-del-icon">✦</div>
            <h3 className="abk-del-title">Delete This Book?</h3>
            <p className="abk-del-text">
              "{deleteTarget.title}" will be permanently removed from the catalogue. This action cannot be undone.
            </p>
            <div className="abk-del-actions">
              <button className="abk-del-keep" onClick={() => setDeleteTarget(null)} disabled={deleting}>Keep Book</button>
              <button className="abk-del-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}