import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../api/categoryApi";

/** Converts a category name into a URL-safe slug. */
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getAll()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <style>{`
        .hp-footer-wrap{background:#0d0b0b;border-top:0.5px solid rgba(201,168,76,0.12);}
        .hp-footer-inner{max-width:1300px;margin:0 auto;padding:3.5rem 3rem 0;}
        .hp-footer-top{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:3rem;padding-bottom:3rem;border-bottom:0.5px solid rgba(201,168,76,0.07);}
        .hp-footer-col-title{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);margin-bottom:1.2rem;display:flex;align-items:center;gap:7px;}
        .hp-footer-col-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.1);}
        .hp-footer-link{display:block;font-size:12px;font-style:italic;color:rgba(255,245,230,0.42);padding:4px 0;letter-spacing:0.3px;text-decoration:none;transition:color 0.2s,padding-left 0.2s;cursor:pointer;}
        .hp-footer-link:hover{color:rgba(201,168,76,0.65);padding-left:5px;}
        .hp-footer-empty{font-size:11px;color:rgba(201,168,76,0.25);font-style:italic;font-family:Georgia,serif;}
        .hp-footer-bottom{display:flex;align-items:center;justify-content:space-between;padding:1.4rem 0;}
        .hp-footer-brand{display:flex;align-items:center;gap:10px;}
        .hp-footer-social{display:flex;align-items:center;gap:14px;}
        .hp-footer-social-link{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.25);cursor:pointer;transition:color 0.2s;text-decoration:none;}
        .hp-footer-social-link:hover{color:rgba(201,168,76,0.55);}
      `}</style>

      <footer className="hp-footer-wrap">
        <div className="hp-footer-inner">
          <div className="hp-footer-top">

            {/* COL 1 — Brand + about + newsletter */}
            <div>
              <div style={{ marginBottom: "1.2rem" }}>
                <div style={{ fontSize: 17, color: "#c9a84c", letterSpacing: "1.5px", marginBottom: 4, fontFamily: "Georgia,serif" }}>The Liminal Shelf</div>
                <div style={{ fontSize: 9, color: "rgba(201,168,76,0.38)", letterSpacing: "4px", textTransform: "uppercase", fontStyle: "italic", fontFamily: "Georgia,serif" }}>where stories linger between worlds</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <div style={{ width: 18, height: "0.5px", background: "rgba(201,168,76,0.1)" }} />
                <span style={{ fontSize: 9, color: "rgba(201,168,76,0.25)", fontFamily: "Georgia,serif" }}>✦</span>
                <div style={{ flex: 1, height: "0.5px", background: "rgba(201,168,76,0.1)" }} />
              </div>

              <p style={{ fontSize: 12, fontStyle: "italic", color: "rgba(255,245,230,0.3)", lineHeight: 1.8, marginBottom: "1.4rem", maxWidth: 340, fontFamily: "Georgia,serif" }}>
                A threshold between the world of the living and the world of the read. We hand-select each title for the reader who notices the margins, the footnotes, the space between words.
              </p>

              <div style={{ fontSize: 9, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.28)", marginBottom: 14, fontFamily: "Georgia,serif" }}>✦ &nbsp;Join the Reading Room</div>
              <p style={{ fontSize: 12, fontStyle: "italic", color: "rgba(255,245,230,0.25)", lineHeight: 1.75, marginBottom: 14, fontFamily: "Georgia,serif" }}>
                Create an account to save favourites, track orders, and receive curated recommendations.
              </p>
              <Link to="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#1a0808", border: "0.5px solid #8b2020",
                padding: "9px 20px", fontFamily: "Georgia,serif",
                fontSize: 9, letterSpacing: "3px", color: "#c0392b",
                textTransform: "uppercase", textDecoration: "none",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#8b2020"; e.currentTarget.style.color = "#c0392b"; }}
              >
                ⊷ &nbsp;Enter the Shelf&nbsp; ⊶
              </Link>
            </div>

            {/* COL 2 — Catalogue (category thật từ DB) */}
            <div>
              <div className="hp-footer-col-title">
                Catalogue
                <div className="hp-footer-col-title-line" />
              </div>
              {categories.length === 0 ? (
                <span className="hp-footer-empty">No categories yet</span>
              ) : (
                categories.map(c => (
                  <Link key={c.id} to={`/category/${toSlug(c.name)}`} className="hp-footer-link">
                    {c.name}
                  </Link>
                ))
              )}
              <Link to="/books?sort=newest" className="hp-footer-link">New Arrivals</Link>
            </div>

            {/* COL 3 — The Shelf */}
            <div>
              <div className="hp-footer-col-title">
                The Shelf
                <div className="hp-footer-col-title-line" />
              </div>
              {[
                { label: "Our Story", to: "/about" },
                { label: "Curation Philosophy", to: "/about#philosophy" },
                { label: "Reading Notes", to: "/blog" },
                { label: "Events & Readings", to: "/events" },
                { label: "Gift Cards", to: "/gift-cards" },
                { label: "Rare Editions", to: "/rare" },
              ].map(({ label, to }) => (
                <Link key={label} to={to} className="hp-footer-link">{label}</Link>
              ))}
            </div>

            {/* COL 4 — Help */}
            <div>
              <div className="hp-footer-col-title">
                Help
                <div className="hp-footer-col-title-line" />
              </div>
              {[
                { label: "My Orders", to: "/orders" },
                { label: "Shipping & Returns", to: "/shipping" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact", to: "/contact" },
              ].map(({ label, to }) => (
                <Link key={label} to={to} className="hp-footer-link">{label}</Link>
              ))}
              <div style={{ marginTop: "1.4rem" }}>
                {[
                  { label: "◆ \u00a0Privacy Policy", to: "/privacy" },
                  { label: "◆ \u00a0Terms of Service", to: "/terms" },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} className="hp-footer-link">{label}</Link>
                ))}
              </div>
            </div>

          </div>

          {/* bottom bar */}
          <div className="hp-footer-bottom">
            <div className="hp-footer-brand">
              <span style={{ fontSize: 9, color: "rgba(201,168,76,0.28)", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Georgia,serif" }}>The Liminal Shelf</span>
              <span style={{ fontSize: 9, color: "rgba(201,168,76,0.15)", fontFamily: "Georgia,serif" }}>◆</span>
              <span style={{ fontSize: 9, color: "rgba(201,168,76,0.18)", letterSpacing: "1.5px", fontStyle: "italic", fontFamily: "Georgia,serif" }}>where stories linger between worlds</span>
            </div>
            <div className="hp-footer-social">
              {["Instagram", "Goodreads", "Substack"].map((s, i) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && <span style={{ fontSize: 9, color: "rgba(201,168,76,0.12)", fontFamily: "Georgia,serif" }}>◆</span>}
                  <a className="hp-footer-social-link">{s}</a>
                </span>
              ))}
            </div>
            <span style={{ fontSize: 9, color: "rgba(255,245,230,0.14)", letterSpacing: "1px", fontStyle: "italic", fontFamily: "Georgia,serif" }}>
              © {new Date().getFullYear()} &nbsp;·&nbsp; All rights reserved
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}