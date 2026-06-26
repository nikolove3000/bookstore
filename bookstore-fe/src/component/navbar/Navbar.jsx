import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import categoryApi from "../../api/categoryApi";
import cartApi from "../../api/cartApi";
import { useCart } from "../../context/CartContext";

/** Maps pathname → { num, label } */
const FOLIO_MAP = [
  { match: /^\/$/, num: "Folio I", label: "Home" },
  { match: /^\/books\/\d+/, num: "Folio ✦", label: "Book Detail" },
  { match: /^\/books/, num: "Folio II", label: "Books" },
  { match: /^\/category/, num: "Folio ✦", label: "Browse" },
  { match: /^\/search/, num: "Folio ✦", label: "Search" },
  { match: /^\/cart/, num: "Folio III", label: "Cart" },
  { match: /^\/orders\/\d+/, num: "Folio ✦", label: "Order Detail" },
  { match: /^\/orders/, num: "Folio IV", label: "Orders" },
  { match: /^\/profile/, num: "Folio V", label: "Profile" },
  { match: /^\/wishlist/, num: "Folio VI", label: "Wishlist" },
];

/** Bestseller ticker — replace with real API data */
const TICKER_BOOKS = [
  { title: "The Name of the Rose", author: "Umberto Eco" },
  { title: "Steppenwolf", author: "Hermann Hesse" },
  { title: "Pedro Páramo", author: "Juan Rulfo" },
  { title: "The Master and Margarita", author: "Bulgakov" },
  { title: "One Hundred Years of Solitude", author: "García Márquez" },
  { title: "Nausea", author: "Jean-Paul Sartre" },
  { title: "The Trial", author: "Franz Kafka" },
  { title: "Ficciones", author: "Jorge Luis Borges" },
  { title: "Beloved", author: "Toni Morrison" },
  { title: "The Stranger", author: "Albert Camus" },
];

function getFolio(pathname) {
  const hit = FOLIO_MAP.find(f => f.match.test(pathname));
  if (!hit) return { num: "Folio ✦", label: pathname.slice(1) || "Home" };

  if (pathname.startsWith("/category/")) {
    const slug = pathname.split("/")[2] ?? "Browse";
    const label = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
    return { num: "Folio ✦", label };
  }

  return hit;
}

/** Converts a category name into a URL-safe slug. */
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [cartPulse, setCartPulse] = useState(false);


  const folio = getFolio(location.pathname);

  const catRef = useRef(null);
  const avatarRef = useRef(null);
  const overlayInputRef = useRef(null);

  const closeSearch = () => { setSearchOpen(false); setSearchVal(""); };

  /* ── fetch categories từ backend ── */
  useEffect(() => {
    categoryApi.getAll()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (
        catRef.current &&
        !catRef.current.contains(e.target) &&
        !e.target.closest(".nav-cat-panel")
      ) {
        setCatOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Esc closes overlay ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchVal(""); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── focus overlay input when opened ── */
  useEffect(() => {
    if (searchOpen) overlayInputRef.current?.focus();
  }, [searchOpen]);

  const prevCountRef = useRef(0);

  useEffect(() => {
    if (cart.totalItems > prevCountRef.current) {
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 1500);
    }
    prevCountRef.current = cart.totalItems;
  }, [cart.totalItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    closeSearch();
  };

  const handleLogout = async () => {
    await logout();
    setAvatarOpen(false);
  };

  const goToCategory = (name) => {
    navigate(`/category/${toSlug(name)}`);
    setCatOpen(false);
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "?";

  /* ── ticker items (doubled for seamless loop) ── */
  const tickerItems = [...TICKER_BOOKS, ...TICKER_BOOKS];

  return (
    <>
      <style>{`
        /* ─────────────────────────────── BASE ── */
        .navbar-root {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: Georgia, serif;
        }

        /* ─────────────────────────── TOP BAR ── */
        .navbar-top {
          height: 58px; background: #0F1720;
          border-bottom: 0.5px solid rgba(201,168,76,0.15);
          display: flex; align-items: center; padding: 0 1.75rem;
        }

        /* logo */
        .nav-logo { text-decoration: none; line-height: 1; flex-shrink: 0; }
        .nav-logo-main { font-size: 17px; color: #c9a84c; letter-spacing: 1.5px; }
        .nav-logo-sub  { font-size: 8px; color: rgba(201,168,76,0.55); letter-spacing: 4px;
                         text-transform: uppercase; margin-top: 3px; }

        /* diamond divider */
        .nav-diamond {
          display: flex; align-items: center; gap: 7px;
          padding: 0 1rem; flex-shrink: 0;
        }
        .nav-diamond::before, .nav-diamond::after {
          content: ''; display: block;
          width: 20px; height: 0.5px; background: rgba(201,168,76,0.15);
        }
        .nav-diamond-gem { font-size: 9px; color: rgba(201,168,76,0.4); flex-shrink: 0; }

        /* folio */
        .nav-folio {
          position: absolute; left: 50%; transform: translateX(-50%);
          text-align: center; pointer-events: none;
          animation: folioFade 0.25s ease;
        }
        @keyframes folioFade {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .nav-folio-num   { font-size: 15px; color: #c9a84c; letter-spacing: 3px; opacity: 0.9; }
        .nav-folio-label { font-size: 8px; color: rgba(201,168,76,0.58);
                           letter-spacing: 4px; text-transform: uppercase; margin-top: 3px; }

        .nav-spacer { flex: 1; }

        /* right cluster */
        .nav-right { display: flex; align-items: center; gap: 2px; }

        .nav-cat-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          padding: 6px 10px; border-radius: 4px;
          font-family: Georgia, serif; font-size: 10px;
          color: rgba(201,168,76,0.72); letter-spacing: 2.5px;
          text-transform: uppercase;
          transition: color 0.2s, background 0.2s;
        }
        .nav-cat-btn:hover, .nav-cat-btn.open {
          color: #c9a84c; background: rgba(201,168,76,0.07);
        }
        .nav-cat-chevron { transition: transform 0.25s; }
        .nav-cat-btn.open .nav-cat-chevron { transform: rotate(180deg); }

        .nav-gem-div { font-size: 9px; color: rgba(201,168,76,0.45); padding: 0 8px; }

        .nav-icon-btn {
          width: 34px; height: 34px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: rgba(201,168,76,0.65);
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .nav-icon-btn:hover { color: #c9a84c; background: rgba(201,168,76,0.07); }

        .nav-cart-badge {
          position: absolute; top: 3px; right: 3px;
          width: 13px; height: 13px; background: #c9a84c; border-radius: 50%;
          font-size: 7px; color: #0d0b0b; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #0F1720;
        }
        .nav-cart-badge.pulse { animation: badgePulse 1.5s ease 1.2s both; }
        @keyframes badgePulse {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.5); }
          100% { transform: scale(1); }
        }

        .nav-avatar {
          width: 29px; height: 29px; border-radius: 50%;
          background: #1a1508; border: 0.5px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: #c9a84c; letter-spacing: 1px;
          cursor: pointer; transition: border-color 0.2s;
          font-family: Georgia, serif;
        }
        .nav-avatar:hover, .nav-avatar.open { border-color: rgba(201,168,76,0.65); }

        /* ──────────────────── SEARCH OVERLAY ── */
        .nav-search-overlay {
          position: absolute; inset: 0; height: 58px;
          background: #0F1720;
          border-bottom: 0.5px solid rgba(201,168,76,0.25);
          display: flex; align-items: center; padding: 0 1.75rem; gap: 14px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.22s cubic-bezier(0.4,0,0.2,1);
          z-index: 10;
        }
        .nav-search-overlay.visible { opacity: 1; pointer-events: all; }

        .nav-search-overlay form { flex: 1; display: flex; align-items: center; gap: 12px; }

        .nav-search-overlay input {
          flex: 1; background: transparent; border: none;
          border-bottom: 0.5px solid rgba(201,168,76,0.3);
          padding: 8px 0 8px 2px;
          font-family: Georgia, serif; font-size: 16px;
          color: rgba(255,245,230,0.8); font-style: italic; outline: none;
          letter-spacing: 0.5px;
          transition: border-color 0.2s;
        }
        .nav-search-overlay input:focus { border-bottom-color: rgba(201,168,76,0.55); }
        .nav-search-overlay input::placeholder {
          color: rgba(201,168,76,0.22); font-size: 15px;
        }

        .nav-overlay-hint {
          font-size: 9px; color: rgba(201,168,76,0.55);
          letter-spacing: 2px; white-space: nowrap; font-style: italic;
        }
        .nav-overlay-close {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(201,168,76,0.65); border: 0.5px solid rgba(201,168,76,0.15);
          border-radius: 3px; padding: 5px 12px; background: none; cursor: pointer;
          font-family: Georgia, serif; white-space: nowrap;
          transition: color 0.2s, border-color 0.2s;
        }
        .nav-overlay-close:hover { color: #c9a84c; border-color: rgba(201,168,76,0.35); }

        /* ────────────────── CATEGORIES PANEL ──
           Flat single-row list — dữ liệu DB hiện tại không có parent/sub category */
        .nav-cat-panel {
          position: fixed; top: 82px; left: 0; right: 0;
          background: #0F1720;
          border-bottom: 0.5px solid rgba(201,168,76,0.15);
          border-top: 0.5px solid rgba(201,168,76,0.08);
          display: flex; padding: 1.5rem 1.75rem;
          animation: panelIn 0.2s ease;
          z-index: 999;
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-cat-item {
          flex: 1; padding: 0.5rem 1.25rem;
          border-right: 0.5px solid rgba(201,168,76,0.07);
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: color 0.15s, background 0.15s;
          font-size: 12px; color: rgba(255,245,230,0.78);
          letter-spacing: 0.5px;
        }
        .nav-cat-item:first-child { padding-left: 0; }
        .nav-cat-item:last-child  { border-right: none; }
        .nav-cat-item:hover { color: #c9a84c; background: rgba(201,168,76,0.04); }
        .nav-cat-item-gem { font-size: 9px; color: rgba(201,168,76,0.45); flex-shrink: 0; }
        .nav-cat-empty {
          font-size: 11px; color: rgba(201,168,76,0.3); font-style: italic;
          padding: 0.5rem 0;
        }

        /* ─────────────────── AVATAR MENU ── */
        .nav-avatar-menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 210px; background: #0F1720;
          border: 0.5px solid rgba(201,168,76,0.18);
          border-radius: 6px; padding: 0.4rem 0;
          animation: panelIn 0.18s ease; z-index: 1001; overflow: hidden;
        }
        .nav-avatar-header {
          padding: 0.7rem 1rem;
          border-bottom: 0.5px solid rgba(201,168,76,0.1);
          margin-bottom: 0.25rem;
        }
        .nav-avatar-name { font-size: 13px; color: rgba(255,245,230,0.8); letter-spacing: 0.5px; }
        .nav-avatar-role { font-size: 9px; color: rgba(201,168,76,0.60);
                           letter-spacing: 3px; text-transform: uppercase;
                           margin-top: 2px; font-style: italic; }
        .nav-avatar-item {
          display: flex; align-items: center; gap: 9px;
          padding: 0.5rem 1rem; font-size: 12px;
          color: rgba(255,245,230,0.70); letter-spacing: 0.5px;
          cursor: pointer; transition: color 0.15s, background 0.15s;
          background: none; border: none; width: 100%;
          text-align: left; font-family: Georgia, serif; text-decoration: none;
        }
        .nav-avatar-item:hover { color: #c9a84c; background: rgba(201,168,76,0.05); }
        .nav-avatar-item.danger:hover { color: #c0392b; background: rgba(139,32,32,0.08); }
        .nav-avatar-sep { height: 0.5px; background: rgba(201,168,76,0.1); margin: 3px 0; }

        /* enter button (logged out) */
        .nav-enter-btn {
          background: #1a0808; border: 0.5px solid #8b2020;
          border-radius: 6px; padding: 7px 16px;
          font-family: Georgia, serif; font-size: 11px;
          letter-spacing: 3px; color: #c0392b;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.3s ease; text-decoration: none;
          display: flex; align-items: center;
        }
        .nav-enter-btn:hover {
          background: #2a1010; border-color: #c9a84c; color: #c9a84c;
        }

        /* ──────────────────── TICKER BAR ── */
        .nav-ticker {
          height: 24px; background: rgba(4,2,2,0.72);
          border-top: 0.5px solid rgba(201,168,76,0.07);
          display: flex; align-items: center; overflow: hidden;
        }
        .nav-ticker-label {
          flex-shrink: 0; padding: 0 14px; height: 100%;
          display: flex; align-items: center;
          font-size: 8px; color: #c9a84c; opacity: 0.5;
          letter-spacing: 3px; text-transform: uppercase;
          border-right: 0.5px solid rgba(201,168,76,0.1);
          white-space: nowrap;
        }
        .nav-ticker-wrap { flex: 1; overflow: hidden; }
        .nav-ticker-track {
          display: flex; align-items: center; white-space: nowrap;
          animation: tickerScroll 38s linear infinite;
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .nav-ticker-item {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 0 16px;
        }
        .nav-ticker-title  { font-size: 10px; color: rgba(255,245,230,0.68); font-style: italic; letter-spacing: 0.5px; }
        .nav-ticker-author { font-size: 9px; color: rgba(201,168,76,0.62); letter-spacing: 1px; }
        .nav-ticker-gem    { font-size: 8px; color: rgba(201,168,76,0.40); }
      `}</style>

      <div className="navbar-root">

        {/* ── TOP BAR ── */}
        <div className="navbar-top" style={{ position: "relative" }}>

          {/* logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-main">The Liminal Shelf</div>
            <div className="nav-logo-sub">where stories linger between worlds</div>
          </Link>

          {/* folio — centered absolutely */}
          <div className="nav-folio" key={location.pathname}>
            <div className="nav-folio-num">{folio.num}</div>
            <div className="nav-folio-label">{folio.label}</div>
          </div>

          <div className="nav-spacer" />

          {/* right cluster */}
          <div className="nav-right">

            {/* categories */}
            <div ref={catRef} style={{ position: "relative" }}>
              <button
                className={`nav-cat-btn ${catOpen ? "open" : ""}`}
                onClick={() => setCatOpen(p => !p)}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                Categories
                <svg className="nav-cat-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            <span className="nav-gem-div">◆</span>

            {/* search icon */}
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <span className="nav-gem-div">◆</span>

            {/* cart */}
            <button className="nav-icon-btn" onClick={() => navigate("/cart")} title="Cart">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {user && cart.totalItems > 0 && (
                <span className={`nav-cart-badge ${cartPulse ? "pulse" : ""}`}>{cart.totalItems}</span>
              )}
            </button>

            {/* avatar / enter */}
            {user ? (
              <div ref={avatarRef} style={{ position: "relative", marginLeft: 6 }}>
                <div
                  className={`nav-avatar ${avatarOpen ? "open" : ""}`}
                  onClick={() => setAvatarOpen(p => !p)}
                  title={user.username}
                >
                  {initials}
                </div>
                {avatarOpen && (
                  <div className="nav-avatar-menu">
                    <div className="nav-avatar-header">
                      <div className="nav-avatar-name">{user.username}</div>
                      <div className="nav-avatar-role">{user.role?.replace("ROLE_", "") || "Reader"}</div>
                    </div>
                    <Link to="/profile" className="nav-avatar-item" onClick={() => setAvatarOpen(false)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>
                    <Link to="/orders" className="nav-avatar-item" onClick={() => setAvatarOpen(false)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="nav-avatar-item" onClick={() => setAvatarOpen(false)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                      Wishlist
                    </Link>
                    <div className="nav-avatar-sep" />
                    <button className="nav-avatar-item danger" onClick={handleLogout}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-enter-btn" style={{ marginLeft: 8 }}>
                ⊷&nbsp;&nbsp;Enter&nbsp;&nbsp;⊶
              </Link>
            )}
          </div>

          {/* ── SEARCH OVERLAY ── */}
          <div className={`nav-search-overlay ${searchOpen ? "visible" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <form onSubmit={handleSearch}>
              <input
                ref={overlayInputRef}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search across the entire shelf…"
              />
              <span className="nav-overlay-hint">press enter</span>
            </form>
            <button className="nav-overlay-close" onClick={closeSearch}>
              ✕ &nbsp;Close
            </button>
          </div>

        </div>

        {/* ── TICKER BAR ── */}
        <div className="nav-ticker">
          <div className="nav-ticker-label">✦ &nbsp;Now Reading</div>
          <div className="nav-ticker-wrap">
            <div className="nav-ticker-track">
              {tickerItems.map((b, i) => (
                <div key={i} className="nav-ticker-item">
                  <span className="nav-ticker-title">{b.title}</span>
                  <span className="nav-ticker-author">— {b.author}</span>
                  <span className="nav-ticker-gem">◆</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── CATEGORIES PANEL — flat list từ DB ── */}
      {catOpen && (
        <div className="nav-cat-panel">
          {categories.length === 0 ? (
            <div className="nav-cat-empty">No categories yet</div>
          ) : (
            categories.map(cat => (
              <div
                key={cat.id}
                className="nav-cat-item"
                onClick={() => goToCategory(cat.name)}
              >
                <span className="nav-cat-item-gem">◆</span>
                {cat.name}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}