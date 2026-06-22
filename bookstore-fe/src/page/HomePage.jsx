import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import bookApi from "../api/bookApi";
import categoryApi from "../api/categoryApi";
import { ShelfRow } from "../component/ShelfBook";
import Footer from "../component/Footer";

/* ─── Static accent/quote map ─── */
const BOOK_META = {
  "The Name of the Rose": { accent: "#8B5E3C", quote: "Books are not made to be believed, but to be subjected to inquiry.", src: "Umberto Eco, 1980" },
  "Piranesi": { accent: "#4A6B8A", quote: "The Beauty of the House is immeasurable; its Kindness infinite.", src: "Susanna Clarke, 2020" },
  "House of Leaves": { accent: "#6B3A5A", quote: "This is not for you.", src: "Mark Z. Danielewski, 2000" },
};
const DEFAULT_META = { accent: "#c9a84c", quote: "", src: "" };
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/* ─── Intersection observer ─── */

function useReveal(threshold = 0.08, deps = []) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, deps);
  return [ref, visible];
}

/* ─── Corner ✦ ornaments ─── */
function Corners({ accent = "#c9a84c" }) {
  return (
    <>
      {[[{ top: 10, left: 12 }, "✦"], [{ top: 10, right: 12 }, "✦"], [{ bottom: 10, left: 12 }, "✦"], [{ bottom: 10, right: 12 }, "✦"]].map(([s, sym], i) => (
        <span key={i} style={{ position: "absolute", ...s, fontSize: 13, color: accent, opacity: 0.45, fontFamily: "Georgia,serif", lineHeight: 1 }}>{sym}</span>
      ))}
    </>
  );
}

/* ─── Divider ─── */
function Divider({ accent = "#c9a84c", label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 1.75rem 0" }}>
      <div style={{ flex: 1, height: "0.5px", background: accent, opacity: 0.15 }} />
      {label
        ? <span style={{ fontSize: 8, color: accent, opacity: 0.45, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Georgia,serif", whiteSpace: "nowrap" }}>{label}</span>
        : <span style={{ fontSize: 10, color: accent, opacity: 0.4 }}>✦</span>
      }
      <div style={{ flex: 1, height: "0.5px", background: accent, opacity: 0.15 }} />
    </div>
  );
}

/* ─── PileImage — ảnh trong Editorial Banner, có fallback khi lỗi ─── */
function PileImage({ src, title }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div style={{
        position: "absolute", width: 155, height: 220,
        background: "#0F1720", border: "0.5px solid rgba(201,168,76,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: "rgba(201,168,76,0.3)", fontFamily: "Georgia,serif",
      }}>✦</div>
    );
  }
  return <img src={src} alt={title || ""} onError={() => setError(true)} />;
}

/* ─── Main ─── */
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [heroIdx, setHeroIdx] = useState(0);
  const [textAnim, setTextAnim] = useState(true);
  const [manualPick, setManualPick] = useState(false);

  /* ── reveal-on-scroll refs (CSS animation, không dùng inline opacity) ── */
  const [genresRef, genresVisible] = useReveal(0.05, [loading]);
  const [arrivalsRef, arrivalsVisible] = useReveal(0.04, [loading]);
  const [bannerRef, bannerVisible] = useReveal(0.08, [loading]);

  /* ── fetch data từ backend ── */
  useEffect(() => {
    Promise.all([
      bookApi.getFeatured(3),
      bookApi.getNewArrivals(6),
      categoryApi.getAll(),
    ]).then(([featRes, arrRes, catRes]) => {
      setFeatured(featRes.data.map(b => ({
        ...b,
        author: b.authorName,
        cover: b.coverUrl,
        price: parseFloat(b.price),
        tag: b.category || "Fiction",
        ...(BOOK_META[b.title] ?? DEFAULT_META),
      })));
      setNewArrivals(arrRes.data.map((b, i) => ({
        ...b,
        author: b.authorName,
        cover: b.coverUrl,
        price: parseFloat(b.price),
        tag: b.category || "Fiction",
        featured: i === 0,
        isNew: i < 2,
      })));
      setGenres(catRes.data.map((c, i) => ({
        ...c,
        slug: c.name.toLowerCase().replace(/\s+/g, "-"),
        roman: ROMAN[i] ?? String(i + 1),
        count: c.bookCount ?? 0,
      })));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = featured[heroIdx] ?? DEFAULT_META;

  /* ── auto-advance hero ── */
  const switchHero = useCallback((i) => {
    if (i === heroIdx || featured.length === 0) return;
    setTextAnim(false);
    setTimeout(() => { setHeroIdx(i); setTextAnim(true); }, 280);
  }, [heroIdx, featured.length]);

  useEffect(() => {
    if (manualPick || featured.length === 0) return;
    const t = setInterval(() => switchHero((heroIdx + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [heroIdx, manualPick, switchHero, featured.length]);

  const pickHero = (i) => { setManualPick(true); switchHero(i); };

  /* ── loading state ── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.35)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
    </div>
  );

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        .hp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding-top:82px;overflow-x:hidden;}
        .hp-fade{transition:opacity 0.28s ease,transform 0.28s ease;}
        .hp-fade.in{opacity:1;transform:translateY(0);}
        .hp-fade.out{opacity:0;transform:translateY(8px);}
        .hp-hero{position:relative;height:calc(100vh - 82px);min-height:540px;max-height:860px;background:#0f0d0d;overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .hp-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(32px);transform:scale(1.14);transition:background-image 0.7s ease;z-index:0;}
        .hp-hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse 85% 90% at 50% 50%,rgba(15,13,13,0.75) 0%,rgba(15,13,13,0.94) 65%,rgba(15,13,13,0.99) 100%);z-index:1;}
        .hp-vline{position:absolute;top:40px;bottom:40px;display:flex;flex-direction:column;align-items:center;gap:6px;z-index:4;}
        .hp-vline-bar{width:0.5px;flex:1;background:linear-gradient(to bottom,transparent,rgba(201,168,76,0.22),transparent);}
        .hp-vline-text{font-size:8px;letter-spacing:4px;text-transform:uppercase;color:rgba(201,168,76,0.45);writing-mode:vertical-rl;font-family:Georgia,serif;}
        .hp-hero-content{position:relative;z-index:3;text-align:center;padding:0 5rem;max-width:760px;width:100%;}
        .hp-book-row{display:flex;justify-content:center;gap:16px;align-items:flex-end;margin-top:24px;}
        .hp-book-item{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;}
        .hp-book-thumb{width:60px;height:86px;object-fit:cover;display:block;transition:transform 0.35s ease,border-color 0.35s,filter 0.35s;}
        .hp-book-item.active .hp-book-thumb{transform:translateY(-10px);border-color:rgba(201,168,76,0.75) !important;filter:brightness(1);}
        .hp-book-item:not(.active) .hp-book-thumb{filter:brightness(0.5);}
        .hp-book-roman{font-size:8px;letter-spacing:2px;font-family:Georgia,serif;transition:color 0.3s;}
        .hp-book-item.active .hp-book-roman{color:rgba(201,168,76,0.8);}
        .hp-book-item:not(.active) .hp-book-roman{color:rgba(201,168,76,0.3);}
        .hp-dot{width:8px;height:8px;border-radius:50%;border:0.5px solid rgba(201,168,76,0.3);background:transparent;cursor:pointer;transition:all 0.25s;padding:0;}
        .hp-genre-band{background:#0F1720;border-top:0.5px solid rgba(201,168,76,0.1);border-bottom:0.5px solid rgba(201,168,76,0.1);}
        .hp-genre-grid{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr);}
        .hp-genre-item{padding:2.2rem 1.5rem;border-right:0.5px solid rgba(201,168,76,0.07);cursor:pointer;transition:background 0.25s;text-decoration:none;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;min-height:140px;}
        .hp-genre-item:last-child{border-right:none;}
        .hp-genre-item:hover{background:rgba(201,168,76,0.04);}
        .hp-genre-main{display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);}
        .hp-genre-item:hover .hp-genre-main{transform:translateY(-12px);}
        .hp-genre-roman{font-size:9px;color:rgba(201,168,76,0.45);letter-spacing:3px;text-align:center;}
        .hp-genre-name{font-size:16px;color:rgba(255,245,230,0.78);letter-spacing:0.5px;text-align:center;}
        .hp-genre-gem{font-size:9px;color:rgba(201,168,76,0.35);}
        .hp-genre-reveal{position:absolute;bottom:0;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:4px;padding-bottom:1.4rem;opacity:0;transform:translateY(10px);transition:opacity 0.35s ease,transform 0.35s ease;}
        .hp-genre-item:hover .hp-genre-reveal{opacity:1;transform:translateY(0);}
        .hp-genre-count{font-size:9px;color:rgba(201,168,76,0.55);letter-spacing:2px;text-transform:uppercase;}
        .hp-genre-arrow{font-size:9px;color:rgba(201,168,76,0.4);letter-spacing:2px;}
        .hp-section{max-width:1300px;margin:0 auto;padding:4rem 3rem;}
        .hp-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.08);padding-bottom:1rem;}
        .hp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:2rem 1.25rem;}
        .hp-banner{background:#0F1720;border-top:0.5px solid rgba(201,168,76,0.1);border-bottom:0.5px solid rgba(201,168,76,0.1);}
        .hp-banner-inner{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;align-items:center;}
        .hp-banner-text{padding:5rem 3rem;border-right:0.5px solid rgba(201,168,76,0.08);}
        .hp-banner-visual{padding:4rem 3rem;display:flex;align-items:center;justify-content:center;}
        .hp-pile{position:relative;width:240px;height:300px;}
        .hp-pile img{position:absolute;width:155px;height:220px;object-fit:cover;border:0.5px solid rgba(201,168,76,0.12);box-shadow:0 8px 28px rgba(0,0,0,0.7);transition:transform 0.4s ease;will-change:transform;backface-visibility:hidden;}
        .hp-pile img:nth-child(1){top:0;left:40px;transform:rotate(-5deg);z-index:1;}
        .hp-pile img:nth-child(2){top:22px;left:0;transform:rotate(-1deg);z-index:2;}
        .hp-pile img:nth-child(3){top:50px;left:58px;transform:rotate(7deg);z-index:3;}
        .hp-pile:hover img:nth-child(1){transform:rotate(-9deg) translateX(-12px);}
        .hp-pile:hover img:nth-child(3){transform:rotate(11deg) translateX(14px);}
        .hp-footer{border-top:0.5px solid rgba(201,168,76,0.08);padding:2rem 3rem;max-width:1300px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;}
        .hp-btn-primary{background:#1a0808;border:0.5px solid #8b2020;padding:10px 24px;font-family:Georgia,serif;font-size:11px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block;}
        .hp-btn-primary:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .hp-btn-ghost{background:none;border:none;border-bottom:0.5px solid rgba(201,168,76,0.15);font-family:Georgia,serif;font-size:11px;letter-spacing:3px;color:rgba(201,168,76,0.38);text-transform:uppercase;cursor:pointer;padding:8px 0;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:color 0.2s,border-color 0.2s;}
        .hp-btn-ghost:hover{color:rgba(201,168,76,0.8);border-color:rgba(201,168,76,0.4);}
        .hp-view-all{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.35);text-decoration:none;display:flex;align-items:center;gap:6px;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:2px;transition:color 0.2s,border-color 0.2s;}
        .hp-view-all:hover{color:rgba(201,168,76,0.7);border-color:rgba(201,168,76,0.35);}
        .hp-arrivals-layout{display:grid;grid-template-columns:300px 1fr;gap:1.5rem;align-items:start;}
        .hp-feat{display:flex;flex-direction:column;background:#0F1720;border:0.5px solid rgba(201,168,76,0.12);position:relative;overflow:hidden;cursor:pointer;transition:border-color 0.3s;text-decoration:none;}
        .hp-feat:hover{border-color:rgba(201,168,76,0.28);}
        .hp-feat-img-wrap{position:relative;overflow:hidden;aspect-ratio:2/3;}
        .hp-feat-cover{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s ease;}
        .hp-feat:hover .hp-feat-cover{transform:scale(1.03);}
        .hp-feat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,32,1) 0%,rgba(15,23,32,0.6) 45%,transparent 100%);}
        .hp-feat-tag{position:absolute;top:10px;left:10px;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.7);background:rgba(4,2,2,0.88);padding:2px 8px;border:0.5px solid rgba(201,168,76,0.15);font-family:Georgia,serif;}
        .hp-feat-badge{position:absolute;top:10px;right:10px;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.6);background:rgba(15,23,32,0.9);padding:2px 8px;border:0.5px solid rgba(201,168,76,0.2);font-family:Georgia,serif;}
        .hp-feat-body{padding:1.2rem 1.2rem 1.4rem;}
        .hp-feat-ornament{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
        .hp-feat-ornament-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}
        .hp-feat-footer{display:flex;align-items:center;justify-content:space-between;}
        .hp-feat-price{font-size:17px;color:rgba(201,168,76,0.72);letter-spacing:1px;font-family:Georgia,serif;}
        .hp-feat-btn{background:#1a0808;border:0.5px solid #8b2020;padding:7px 14px;font-family:Georgia,serif;font-size:9px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .hp-feat-btn:hover{border-color:#c9a84c;color:#c9a84c;}
        .hp-arrivals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1.2rem 1rem;}
        .hp-card-viewall{opacity:0.5;cursor:pointer;transition:opacity 0.25s;text-decoration:none;}
        .hp-card-viewall:hover{opacity:0.8;}
        .hp-card-viewall-inner{aspect-ratio:2/3;background:#0F1720;border:0.5px solid rgba(201,168,76,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;margin-bottom:9px;transition:border-color 0.25s;}
        .hp-card-viewall:hover .hp-card-viewall-inner{border-color:rgba(201,168,76,0.25);}
        .hp-new-badge{position:absolute;bottom:6px;right:6px;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);background:rgba(4,2,2,0.9);padding:2px 6px;border:0.5px solid rgba(201,168,76,0.12);font-family:Georgia,serif;}
        .hp-footer-wrap{background:#0d0b0b;border-top:0.5px solid rgba(201,168,76,0.12);}
        .hp-footer-inner{max-width:1300px;margin:0 auto;padding:3.5rem 3rem 0;}
        .hp-footer-top{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:3rem;padding-bottom:3rem;border-bottom:0.5px solid rgba(201,168,76,0.07);}
        .hp-footer-col-title{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);margin-bottom:1.2rem;display:flex;align-items:center;gap:7px;}
        .hp-footer-col-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.1);}
        .hp-footer-link{display:block;font-size:12px;font-style:italic;color:rgba(255,245,230,0.42);padding:4px 0;letter-spacing:0.3px;text-decoration:none;transition:color 0.2s,padding-left 0.2s;cursor:pointer;}
        .hp-footer-link:hover{color:rgba(201,168,76,0.65);padding-left:5px;}
        .hp-footer-bottom{display:flex;align-items:center;justify-content:space-between;padding:1.4rem 0;}
        .hp-footer-brand{display:flex;align-items:center;gap:10px;}
        .hp-footer-social{display:flex;align-items:center;gap:14px;}
        .hp-footer-social-link{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.25);cursor:pointer;transition:color 0.2s;text-decoration:none;}
        .hp-footer-social-link:hover{color:rgba(201,168,76,0.55);}
        .hp-shelf{position:relative;padding-top:1.5rem;}
        .hp-shelf-row{display:flex;align-items:flex-end;gap:20px;padding-bottom:36px;justify-content:space-between;flex-wrap:nowrap;width:100%;}
        .hp-shelf-wood{position:relative;height:14px;margin-top:8px;background:linear-gradient(to bottom, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 30%, transparent 100%);border-top:0.5px solid rgba(201,168,76,0.25);}
        .hp-shelf-wood::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 50%, transparent);}
        .hp-shelf-ends{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:6px;}

        /* ── Reveal-on-scroll: dùng @keyframes thay inline opacity transition,
             tránh bug compositing Chromium khi container chứa <img> ── */
        .hp-reveal{opacity:0;}
        .hp-reveal.hp-reveal-in{animation:hpRevealIn 0.6s ease forwards;}
        @keyframes hpRevealIn{
          from{opacity:0;transform:translateY(14px);}
          to{opacity:1;transform:translateY(0);}
        }
      `}</style>

      <div className="hp-root">

        {/* ══ HERO ══ */}
        <section className="hp-hero">

          {/* blurred cover background */}
          <div className="hp-hero-bg" style={{ backgroundImage: `url(${current.cover})` }} />
          <div className="hp-hero-overlay" />

          {/* vertical lines */}
          <div className="hp-vline" style={{ left: 18 }}>
            <div className="hp-vline-bar" />
            <div className="hp-vline-text">BIBLIOTHECA</div>
            <div className="hp-vline-bar" />
          </div>
          <div className="hp-vline" style={{ right: 18 }}>
            <div className="hp-vline-bar" />
            <div className="hp-vline-text">NOCTIS</div>
            <div className="hp-vline-bar" />
          </div>

          <Corners accent={current.accent} />

          {/* centered content */}
          <div className="hp-hero-content">
            <div className={`hp-fade ${textAnim ? "in" : "out"}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* top divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: 280, marginBottom: 18 }}>
                <div style={{ flex: 1, height: "0.5px", background: current.accent, opacity: 0.25 }} />
                <span style={{ fontSize: 11, color: current.accent, opacity: 0.6 }}>✦</span>
                <div style={{ flex: 1, height: "0.5px", background: current.accent, opacity: 0.25 }} />
              </div>

              <div style={{ fontSize: 9, letterSpacing: "3px", color: current.accent, opacity: 0.75, textTransform: "uppercase", marginBottom: 14, fontStyle: "italic" }}>
                — {current.tag} &nbsp;·&nbsp; Staff Pick —
              </div>

              <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2.6rem,5vw,5rem)", fontWeight: "normal", lineHeight: 1.04, color: "rgba(255,245,230,0.93)", margin: "0 0 8px", letterSpacing: "0.5px", textAlign: "center" }}>
                {current.title}
              </h1>

              <div style={{ fontSize: 13, fontStyle: "italic", color: current.accent, opacity: 0.8, marginBottom: 20, letterSpacing: "1px" }}>
                by {current.author}
              </div>

              {/* divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: 280, marginBottom: 16 }}>
                <div style={{ flex: 1, height: "0.5px", background: current.accent, opacity: 0.2 }} />
                <span style={{ fontSize: 9, color: current.accent, opacity: 0.45 }}>✦</span>
                <div style={{ flex: 1, height: "0.5px", background: current.accent, opacity: 0.2 }} />
              </div>

              {/* quote */}
              <p style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,245,230,0.68)", lineHeight: 1.75, maxWidth: 460, marginBottom: 6, textAlign: "center" }}>
                "{current.quote}"
              </p>
              <p style={{ fontSize: 9, color: current.accent, opacity: 0.5, letterSpacing: "2px", marginBottom: 24 }}>
                {current.src}
              </p>

              {/* actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <Link to={`/books/${current.id}`} className="hp-btn-primary">⊷ &nbsp;View Book&nbsp; ⊶</Link>
                <Link to="/books" className="hp-btn-ghost">
                  Browse Collection
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>

            </div>

            {/* book thumbnails as navigation — always visible */}
            <div className="hp-book-row">
              {featured.map((book, i) => (
                <div
                  key={book.id}
                  className={`hp-book-item ${i === heroIdx ? "active" : ""}`}
                  onClick={() => pickHero(i)}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="hp-book-thumb"
                    style={{ border: `0.5px solid rgba(201,168,76,0.2)`, boxShadow: "0 6px 20px rgba(0,0,0,0.7)" }}
                  />
                  <span className="hp-book-roman">{["I", "II", "III"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ GENRE BAND ══ */}
        <div
          ref={genresRef}
          className={`hp-genre-band hp-reveal ${genresVisible ? "hp-reveal-in" : ""}`}
        >
          <div className="hp-genre-grid">
            {genres.map(g => (
              <Link key={g.name} to={`/category/${g.slug}`} className="hp-genre-item">
                <div className="hp-genre-main">
                  <div className="hp-genre-roman">{g.roman}</div>
                  <div className="hp-genre-name">{g.name}</div>
                  <div className="hp-genre-gem">◆</div>
                </div>
                <div className="hp-genre-reveal">
                  <div className="hp-genre-count">{g.count.toLocaleString()} titles</div>
                  <div className="hp-genre-arrow">→ Browse</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="hp-section">
          <div className="hp-section-head">
            <div>
              <div style={{ fontSize: 9, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.32)", marginBottom: 7, fontStyle: "italic" }}>✦ &nbsp;Recently Added</div>
              <h2 style={{ fontSize: 26, fontWeight: "normal", color: "rgba(255,245,230,0.85)", letterSpacing: "0.5px", margin: 0 }}>
                New <em style={{ fontStyle: "italic", color: "rgba(201,168,76,0.62)" }}>Arrivals</em>
              </h2>
            </div>
            <Link to="/books?sort=newest" className="hp-view-all">
              View all
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <ShelfRow books={newArrivals} sectionRef={arrivalsRef} visible={arrivalsVisible} />
        </section>

        {/* ══ EDITORIAL BANNER ══ */}
        <div
          ref={bannerRef}
          className={`hp-banner hp-reveal ${bannerVisible ? "hp-reveal-in" : ""}`}
        >
          <div className="hp-banner-inner">
            <div className="hp-banner-text">
              <Divider label="Our Philosophy" />
              <div style={{ fontSize: 9, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.32)", marginBottom: 16, fontStyle: "italic" }}>· Curated for You ·</div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.7rem,2.8vw,2.6rem)", fontWeight: "normal", lineHeight: 1.12, color: "rgba(255,245,230,0.88)", marginBottom: 16, letterSpacing: "0.5px" }}>
                Where every shelf<br />holds a{" "}
                <em style={{ color: "rgba(201,168,76,0.62)" }}>secret passage</em>
              </h2>
              <p style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(255,245,230,0.35)", maxWidth: 420, marginBottom: 28, fontStyle: "italic" }}>
                The Liminal Shelf is not merely a bookstore. It is a threshold — a place where
                language becomes architecture, and stories become rooms you can inhabit.
                We hand-select each title for the reader who notices the margins.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Link to="/about" className="hp-btn-primary">Our Story</Link>
                <Link to="/books" className="hp-btn-ghost">
                  Explore
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
            <div className="hp-banner-visual">
              <div className="hp-pile">
                {featured.slice(0, 3).map((b) => (
                  <PileImage key={b.id} src={b.cover} title={b.title} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}