import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import bookApi from "../api/bookApi";
import categoryApi from "../api/categoryApi";

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest First" },
  { value: "price,asc", label: "Price: Low to High" },
  { value: "price,desc", label: "Price: High to Low" },
  { value: "title,asc", label: "Title A–Z" },
];

const PAGE_SIZE = 20;

/* ─── Catalog Card ─── */
function CatalogCard({ book }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link to={`/books/${book.id}`} className="bl-card">
      <div className="bl-card-cover-wrap">
        {imgError || !book.coverUrl ? (
          <div className="bl-card-fallback">
            <span style={{ fontSize: 16, color: "rgba(201,168,76,0.35)" }}>✦</span>
            <span style={{ fontSize: 9, color: "rgba(201,168,76,0.3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "Georgia,serif" }}>No Cover</span>
          </div>
        ) : (
          <img className="bl-card-cover" src={book.coverUrl} alt={book.title} onError={() => setImgError(true)} />
        )}
        {book.category && <span className="bl-card-tag">{book.category}</span>}
        {book.averageRating != null && (
          <span className="bl-card-rating">★ {book.averageRating.toFixed(1)}</span>
        )}
      </div>
      <div className="bl-card-title">{book.title}</div>
      <div className="bl-card-author">{book.authorName ?? book.author}</div>
      <div className="bl-card-price">${Number(book.price).toFixed(2)}</div>
    </Link>
  );
}

/* ─── Main ─── */
export default function BookListPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [page, setPage] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);

  /* ── fetch categories once, resolve slug → categoryId ── */
  useEffect(() => {
    categoryApi.getAll().then(res => {
      setCategories(res.data);
      if (slug) {
        const match = res.data.find(c => c.name.toLowerCase().replace(/\s+/g, "-") === slug);
        if (match) setActiveCategoryId(match.id);
      }
    }).catch(console.error);
  }, [slug]);

  /* ── close sort dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── fetch books whenever filters change ── */
  const fetchBooks = useCallback(() => {
    setLoading(true);
    const [sortField, sortDir] = sort.split(",");
    bookApi.getAll({
      q: searchInput || undefined,
      categoryId: activeCategoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      page,
      size: PAGE_SIZE,
      sort: `${sortField},${sortDir}`,
    }).then(res => {
      setBooks(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [searchInput, activeCategoryId, minPrice, maxPrice, sort, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  /* ── reset to page 0 when filters change ── */
  useEffect(() => { setPage(0); }, [activeCategoryId, minPrice, maxPrice, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks();
  };

  const clearFilters = () => {
    setSearchInput("");
    setActiveCategoryId(null);
    setMinPrice("");
    setMaxPrice("");
    setSort("createdAt,desc");
    setPage(0);
    navigate("/books");
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "Sort";
  const activeCategoryName = categories.find(c => c.id === activeCategoryId)?.name ?? "All Books";

  /* ── pagination window ── */
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
        .bl-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 4rem;}
        .bl-breadcrumb{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:1.5rem;max-width:1400px;margin-left:auto;margin-right:auto;}
        .bl-breadcrumb a{color:rgba(201,168,76,0.5);text-decoration:none;}
        .bl-breadcrumb a:hover{color:rgba(201,168,76,0.8);}
        .bl-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .bl-breadcrumb span.current{color:rgba(201,168,76,0.8);}
        .bl-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;max-width:1400px;margin-left:auto;margin-right:auto;}
        .bl-kicker{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .bl-title{font-size:30px;font-weight:normal;letter-spacing:0.5px;}
        .bl-title em{font-style:italic;color:rgba(201,168,76,0.65);}
        .bl-count{font-size:11px;font-style:italic;color:rgba(201,168,76,0.55);}
        .bl-layout{display:grid;grid-template-columns:240px 1fr;gap:2.5rem;max-width:1400px;margin:0 auto;}

        .bl-sidebar-block{margin-bottom:2rem;}
        .bl-sidebar-title{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:1rem;display:flex;align-items:center;gap:8px;}
        .bl-sidebar-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}

        .bl-search-box{position:relative;margin-bottom:1.8rem;}
        .bl-search-input{width:100%;background:transparent;border:none;border-bottom:0.5px solid rgba(201,168,76,0.22);padding:7px 6px 7px 26px;font-family:Georgia,serif;font-size:12px;color:rgba(255,245,230,0.78);font-style:italic;outline:none;}
        .bl-search-input::placeholder{color:rgba(201,168,76,0.35);}
        .bl-search-icon{position:absolute;left:6px;top:8px;color:rgba(201,168,76,0.45);}

        .bl-cat-item{display:flex;align-items:center;justify-content:space-between;padding:6px 0;cursor:pointer;font-size:12px;color:rgba(255,245,230,0.6);transition:color 0.2s;background:none;border:none;width:100%;font-family:Georgia,serif;text-align:left;}
        .bl-cat-item:hover{color:rgba(201,168,76,0.85);}
        .bl-cat-item.active{color:#c9a84c;}
        .bl-cat-check{width:11px;height:11px;border:0.5px solid rgba(201,168,76,0.4);display:inline-flex;align-items:center;justify-content:center;font-size:8px;margin-right:8px;flex-shrink:0;}
        .bl-cat-item.active .bl-cat-check{border-color:#c9a84c;color:#c9a84c;}
        .bl-cat-name{display:flex;align-items:center;}
        .bl-cat-count{font-size:9px;color:rgba(201,168,76,0.42);letter-spacing:1px;}

        .bl-price-row{display:flex;align-items:center;gap:8px;margin-bottom:1rem;}
        .bl-price-input{width:70px;background:rgba(201,168,76,0.05);border:0.5px solid rgba(201,168,76,0.22);padding:6px 8px;font-family:Georgia,serif;font-size:11px;color:rgba(255,245,230,0.75);outline:none;text-align:center;}
        .bl-price-sep{color:rgba(201,168,76,0.4);font-size:10px;}

        .bl-clear-link{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);border-bottom:0.5px solid rgba(201,168,76,0.2);padding-bottom:2px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:none;border-top:none;border-left:none;border-right:none;font-family:Georgia,serif;}
        .bl-clear-link:hover{color:rgba(201,168,76,0.85);}

        .bl-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
        .bl-toolbar-count{font-size:11px;font-style:italic;color:rgba(201,168,76,0.5);}
        .bl-sort-wrap{position:relative;}
        .bl-sort-btn{display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);cursor:pointer;border:0.5px solid rgba(201,168,76,0.22);padding:7px 14px;background:rgba(201,168,76,0.04);font-family:Georgia,serif;}
        .bl-sort-menu{position:absolute;top:calc(100% + 6px);right:0;background:#0F1720;border:0.5px solid rgba(201,168,76,0.2);min-width:180px;z-index:10;}
        .bl-sort-opt{padding:9px 14px;font-size:11px;color:rgba(255,245,230,0.6);cursor:pointer;transition:color 0.15s,background 0.15s;}
        .bl-sort-opt:hover{color:#c9a84c;background:rgba(201,168,76,0.06);}
        .bl-sort-opt.active{color:#c9a84c;}

        .bl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.8rem 1.4rem;margin-bottom:3rem;min-height:300px;}
        .bl-card{cursor:pointer;text-decoration:none;display:block;}
        .bl-card-cover-wrap{position:relative;aspect-ratio:2/3;background:#0F1720;border:0.5px solid rgba(201,168,76,0.14);margin-bottom:10px;overflow:hidden;transition:border-color 0.25s;}
        .bl-card:hover .bl-card-cover-wrap{border-color:rgba(201,168,76,0.35);}
        .bl-card-cover{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease;}
        .bl-card:hover .bl-card-cover{transform:scale(1.03);}
        .bl-card-fallback{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);}
        .bl-card-tag{position:absolute;top:6px;left:6px;font-size:7px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.75);background:rgba(4,2,2,0.88);padding:2px 6px;border:0.5px solid rgba(201,168,76,0.18);font-family:Georgia,serif;}
        .bl-card-rating{position:absolute;bottom:6px;right:6px;font-size:8px;color:#c9a84c;background:rgba(4,2,2,0.88);padding:2px 6px;border:0.5px solid rgba(201,168,76,0.18);font-family:Georgia,serif;}
        .bl-card-title{font-size:12px;color:rgba(255,245,230,0.82);line-height:1.3;margin-bottom:3px;}
        .bl-card-author{font-size:10px;font-style:italic;color:rgba(201,168,76,0.55);margin-bottom:4px;}
        .bl-card-price{font-size:11px;color:rgba(201,168,76,0.7);}

        .bl-empty{grid-column:1/-1;text-align:center;padding:4rem 0;color:rgba(201,168,76,0.4);font-style:italic;font-size:13px;}

        .bl-pagination{display:flex;align-items:center;justify-content:center;gap:14px;}
        .bl-page-link{font-size:11px;color:rgba(201,168,76,0.5);cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .bl-page-link:hover{color:#c9a84c;}
        .bl-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .bl-page-link:disabled{opacity:0.25;cursor:default;}
        .bl-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}
      `}</style>

      <div className="bl-root">
        <div className="bl-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">·</span>
          <span className="current">{activeCategoryName}</span>
        </div>

        <div className="bl-head">
          <div>
            <div className="bl-kicker">✦ The Full Collection</div>
            <h1 className="bl-title">Browse the <em>Catalogue</em></h1>
          </div>
          <div className="bl-count">{totalElements.toLocaleString()} titles found</div>
        </div>

        <div className="bl-layout">

          {/* SIDEBAR */}
          <div>
            <div className="bl-sidebar-block">
              <form className="bl-search-box" onSubmit={handleSearchSubmit}>
                <svg className="bl-search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  className="bl-search-input"
                  placeholder="Search titles, authors…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
              </form>
            </div>

            <div className="bl-sidebar-block">
              <div className="bl-sidebar-title">Categories<div className="bl-sidebar-title-line" /></div>
              <button className={`bl-cat-item ${!activeCategoryId ? "active" : ""}`} onClick={() => { setActiveCategoryId(null); navigate("/books"); }}>
                <span className="bl-cat-name"><span className="bl-cat-check">{!activeCategoryId ? "✓" : ""}</span>All Books</span>
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={`bl-cat-item ${activeCategoryId === c.id ? "active" : ""}`}
                  onClick={() => setActiveCategoryId(c.id)}
                >
                  <span className="bl-cat-name"><span className="bl-cat-check">{activeCategoryId === c.id ? "✓" : ""}</span>{c.name}</span>
                  <span className="bl-cat-count">{c.bookCount ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="bl-sidebar-block">
              <div className="bl-sidebar-title">Price Range<div className="bl-sidebar-title-line" /></div>
              <div className="bl-price-row">
                <input className="bl-price-input" placeholder="$0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <span className="bl-price-sep">—</span>
                <input className="bl-price-input" placeholder="$100" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <button className="bl-clear-link" onClick={clearFilters}>✕ &nbsp;Clear all filters</button>
          </div>

          {/* MAIN */}
          <div>
            <div className="bl-toolbar">
              <span className="bl-toolbar-count">
                {totalElements > 0 ? `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, totalElements)} of ${totalElements}` : "No results"}
              </span>
              <div className="bl-sort-wrap" ref={sortRef}>
                <button className="bl-sort-btn" onClick={() => setSortOpen(p => !p)}>
                  Sort: {currentSortLabel}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="bl-sort-menu">
                    {SORT_OPTIONS.map(o => (
                      <div
                        key={o.value}
                        className={`bl-sort-opt ${sort === o.value ? "active" : ""}`}
                        onClick={() => { setSort(o.value); setSortOpen(false); }}
                      >{o.label}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bl-grid">
              {loading ? (
                <div className="bl-empty">✦ Loading the shelves ✦</div>
              ) : books.length === 0 ? (
                <div className="bl-empty">No titles found — try adjusting your filters.</div>
              ) : (
                books.map(book => <CatalogCard key={book.id} book={book} />)
              )}
            </div>

            {totalPages > 1 && (
              <div className="bl-pagination">
                <button className="bl-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                {pages.map((p, i) => (
                  <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {i > 0 && p - pages[i - 1] > 1 && <span className="bl-page-gem">◆</span>}
                    <button className={`bl-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                  </span>
                ))}
                <button className="bl-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}