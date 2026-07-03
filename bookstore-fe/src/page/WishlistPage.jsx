import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { wishlistApi } from "../api/userApi";

const PAGE_SIZE = 20;

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setLoading(true);
    wishlistApi.getAll({ page, size: PAGE_SIZE })
      .then(res => {
        setItems(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate, location.pathname, page]);

  const handleRemove = async (bookId) => {
    setBusyId(bookId);
    try {
      await wishlistApi.remove(bookId);
      setItems(prev => prev.filter(i => i.bookId !== bookId));
      setTotalElements(prev => prev - 1);
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove from wishlist");
    } finally {
      setBusyId(null);
    }
  };

  const handleAddToCart = async (item) => {
    setAddingId(item.bookId);
    try {
      await addItem(item.bookId, 1);
    } catch (err) {
      alert(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAddingId(null);
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

  const isEmpty = !loading && items.length === 0;

  return (
    <>
      <style>{`
        .wl-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .wl-inner{max-width:1000px;margin:0 auto;}
        .wl-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2rem;}
        .wl-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .wl-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .wl-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .wl-breadcrumb span.current{color:rgba(201,168,76,0.9);}

        .wl-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;}
        .wl-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:7px;font-style:italic;}
        .wl-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .wl-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .wl-count{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);}

        .wl-item{display:grid;grid-template-columns:80px 1fr auto;gap:1.6rem;align-items:center;padding:1.4rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);transition:opacity 0.2s;}
        .wl-item:last-child{border-bottom:none;}
        .wl-item.busy{opacity:0.4;pointer-events:none;}
        .wl-cover{width:80px;height:118px;object-fit:cover;display:block;border:0.5px solid rgba(201,168,76,0.18);}
        .wl-fallback{width:80px;height:118px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.18);font-size:16px;color:rgba(201,168,76,0.35);}
        .wl-info-title{font-size:16px;color:rgba(255,245,230,0.88);line-height:1.3;margin-bottom:4px;text-decoration:none;}
        .wl-info-title:hover{color:#c9a84c;}
        .wl-info-author{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);margin-bottom:6px;}
        .wl-info-meta{display:flex;align-items:center;gap:14px;}
        .wl-info-price{font-size:15px;color:#c9a84c;letter-spacing:0.5px;}
        .wl-info-stock{font-size:11px;letter-spacing:1px;text-transform:uppercase;font-style:italic;}
        .wl-info-stock.in{color:rgba(201,168,76,0.65);}
        .wl-info-stock.out{color:#c0392b;}
        .wl-info-date{font-size:11px;font-style:italic;color:rgba(201,168,76,0.42);margin-top:6px;}

        .wl-actions{display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
        .wl-add-btn{background:#1a0808;border:0.5px solid #8b2020;padding:9px 18px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;white-space:nowrap;}
        .wl-add-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .wl-add-btn:disabled{opacity:0.4;cursor:default;}
        .wl-remove-btn{background:none;border:none;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.45);cursor:pointer;font-family:Georgia,serif;transition:color 0.2s;border-bottom:0.5px solid rgba(201,168,76,0.18);padding-bottom:2px;}
        .wl-remove-btn:hover{color:#c0392b;border-color:rgba(192,57,43,0.4);}

        .wl-pagination{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:2.5rem;}
        .wl-page-link{font-size:13px;color:rgba(201,168,76,0.5);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .wl-page-link:hover{color:#c9a84c;}
        .wl-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .wl-page-link:disabled{opacity:0.25;cursor:default;}
        .wl-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}

        .wl-empty{text-align:center;padding:5rem 0;}
        .wl-empty-icon{font-size:32px;color:rgba(201,168,76,0.3);margin-bottom:1.5rem;}
        .wl-empty-text{font-size:16px;font-style:italic;color:rgba(255,245,230,0.55);margin-bottom:2rem;}
        .wl-empty-btn{background:#1a0808;border:0.5px solid #8b2020;padding:13px 30px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.3s;}
        .wl-empty-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}

        .wl-loading{text-align:center;padding:5rem 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);font-style:italic;}
      `}</style>

      <div className="wl-root">
        <div className="wl-inner">
          <div className="wl-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">·</span>
            <span className="current">Wishlist</span>
          </div>

          <div className="wl-head">
            <div>
              <div className="wl-kicker">✦ Saved for Later</div>
              <h1 className="wl-title">My <em>Wishlist</em></h1>
            </div>
            {!isEmpty && <div className="wl-count">{totalElements} {totalElements === 1 ? "title" : "titles"}</div>}
          </div>

          {loading ? (
            <div className="wl-loading">✦ &nbsp;Loading&nbsp; ✦</div>
          ) : isEmpty ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">✦</div>
              <p className="wl-empty-text">Your wishlist is empty — the shelf awaits.</p>
              <Link to="/books" className="wl-empty-btn">⊷ &nbsp;Browse the Catalogue&nbsp; ⊶</Link>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className={`wl-item ${busyId === item.bookId ? "busy" : ""}`}>
                  {item.coverUrl ? (
                    <img className="wl-cover" src={item.coverUrl} alt={item.title} />
                  ) : (
                    <div className="wl-fallback">✦</div>
                  )}
                  <div>
                    <Link to={`/books/${item.bookId}`} className="wl-info-title">{item.title}</Link>
                    <div className="wl-info-author">{item.authorName}</div>
                    <div className="wl-info-meta">
                      <span className="wl-info-price">${Number(item.price).toFixed(2)}</span>
                      <span className={`wl-info-stock ${item.inStock ? "in" : "out"}`}>
                        {item.inStock ? "✦ In Stock" : "✦ Out of Stock"}
                      </span>
                    </div>
                    <div className="wl-info-date">
                      Added {item.addedAt ? new Date(item.addedAt).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <div className="wl-actions">
                    <button
                      className="wl-add-btn"
                      disabled={!item.inStock || addingId === item.bookId}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addingId === item.bookId ? "Adding…" : "⊷ Add to Cart"}
                    </button>
                    <button className="wl-remove-btn" onClick={() => handleRemove(item.bookId)}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="wl-pagination">
                  <button className="wl-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                  {pages.map((p, i) => (
                    <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {i > 0 && p - pages[i - 1] > 1 && <span className="wl-page-gem">◆</span>}
                      <button className={`wl-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                    </span>
                  ))}
                  <button className="wl-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}