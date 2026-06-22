import { useState } from "react";

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function ShelfBook({ book, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const w = book.featured ? 195 : 165;
  const h = book.featured ? 288 : 244;

  return (
    <div
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative" }}>
        {imgError ? (
          <div style={{
            width: w, height: h, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            background: "linear-gradient(160deg, #14171c 0%, #0c0a0a 100%)",
            border: book.featured ? "0.5px solid rgba(201,168,76,0.4)" : "0.5px solid rgba(201,168,76,0.18)",
            boxShadow: hovered
              ? "-4px 16px 24px rgba(0,0,0,0.6), -3px 3px 0 0.5px rgba(201,168,76,0.25)"
              : "-3px 3px 0 rgba(0,0,0,0.55), -3px 3px 0 0.5px rgba(201,168,76,0.06)",
            transform: hovered ? "translateY(-14px) rotate(-1.5deg)" : "translateY(0) rotate(0)",
            transition: "transform 0.32s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.32s ease",
            padding: "0 14px",
          }}>
            <span style={{ fontSize: 18, color: "rgba(201,168,76,0.35)" }}>✦</span>
            <span style={{
              fontSize: 11, color: "rgba(255,245,230,0.5)", letterSpacing: "0.5px",
              textAlign: "center", lineHeight: 1.4, fontFamily: "Georgia,serif", fontStyle: "italic",
            }}>{book.title}</span>
            <span style={{
              fontSize: 8, color: "rgba(201,168,76,0.3)", letterSpacing: "2px",
              textTransform: "uppercase", fontFamily: "Georgia,serif",
            }}>No Cover</span>
          </div>
        ) : (
          <img
            src={book.cover} alt={book.title}
            onError={() => setImgError(true)}
            style={{
              width: w, height: h, objectFit: "cover", display: "block",
              willChange: "transform",
              backfaceVisibility: "hidden",
              transform: hovered
                ? "translateY(-14px) rotate(-1.5deg) translateZ(0)"
                : "translateY(0) rotate(0) translateZ(0)",
              border: book.featured ? "0.5px solid rgba(201,168,76,0.4)" : "0.5px solid rgba(201,168,76,0.18)",
              boxShadow: hovered
                ? "-4px 16px 24px rgba(0,0,0,0.6), -3px 3px 0 0.5px rgba(201,168,76,0.25)"
                : book.featured
                  ? "-3px 3px 0 rgba(0,0,0,0.6), 0 0 18px rgba(201,168,76,0.1)"
                  : "-3px 3px 0 rgba(0,0,0,0.55), -3px 3px 0 0.5px rgba(201,168,76,0.06)",
              transition: "transform 0.32s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.32s ease",
            }}
          />
        )}

        {book.featured && (
          <div style={{
            position: "absolute", top: -9, right: -9, width: 22, height: 22,
            background: "#0d0b0b", border: "0.5px solid rgba(201,168,76,0.5)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "#c9a84c", zIndex: 3,
          }}>✦</div>
        )}

        {book.isNew && (
          <div style={{
            position: "absolute", bottom: 6, right: 6, width: 6, height: 6, borderRadius: "50%",
            background: "#c9a84c", boxShadow: "0 0 6px rgba(201,168,76,0.6)",
          }} />
        )}
      </div>

      <span style={{
        position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)",
        fontSize: 8, color: "rgba(201,168,76,0.3)", letterSpacing: "2px",
        opacity: hovered ? 0 : 1, transition: "opacity 0.3s ease", fontFamily: "Georgia,serif",
      }}>{ROMANS[index % ROMANS.length]}</span>

      <div style={{
        marginTop: 12, textAlign: "center", width: 160, minHeight: 64,
        opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-4px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        <div style={{
          fontSize: 8, letterSpacing: "2px", textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)", marginBottom: 4, fontFamily: "Georgia,serif", fontStyle: "italic",
        }}>{book.tag}</div>

        <div style={{
          fontSize: 14, color: "rgba(255,245,230,0.8)", lineHeight: 1.3, marginBottom: 4, fontFamily: "Georgia,serif",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{book.title}</div>
        <div style={{ fontSize: 10, fontStyle: "italic", color: "rgba(201,168,76,0.5)", marginBottom: 5, fontFamily: "Georgia,serif" }}>{book.author}</div>
        <div style={{ fontSize: 11, color: "rgba(201,168,76,0.68)", letterSpacing: "0.5px", fontFamily: "Georgia,serif" }}>${book.price.toFixed(2)}</div>
      </div>
    </div>
  );
}

/* ─── ShelfRow — wraps a row of ShelfBook with the wooden shelf line below ─── */
export function ShelfRow({ books, sectionRef, visible }) {
  return (
    <div
      ref={sectionRef}
      className={`hp-shelf hp-reveal ${visible ? "hp-reveal-in" : ""}`}
      style={{
        position: "relative", paddingTop: "1.5rem",
      }}
    >
      <style>{`
        .hp-shelf-row{display:flex;align-items:flex-end;gap:20px;padding-bottom:36px;justify-content:space-between;flex-wrap:nowrap;width:100%;}
        .hp-shelf-wood{position:relative;height:14px;margin-top:8px;background:linear-gradient(to bottom, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 30%, transparent 100%);border-top:0.5px solid rgba(201,168,76,0.25);}
        .hp-shelf-wood::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 50%, transparent);}
        .hp-shelf-ends{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:6px;}
        .hp-reveal{opacity:0;}
        .hp-reveal.hp-reveal-in{animation:hpRevealIn 0.6s ease forwards;}
        @keyframes hpRevealIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <div className="hp-shelf-row">
        {books.map((book, i) => (
          <ShelfBook key={book.id} book={book} index={i} />
        ))}
      </div>
      <div className="hp-shelf-wood" />
      <div className="hp-shelf-ends">
        <div style={{ width: 60, height: "0.5px", background: "rgba(201,168,76,0.15)" }} />
        <span style={{ fontSize: 9, color: "rgba(201,168,76,0.35)" }}>◆</span>
        <div style={{ width: 60, height: "0.5px", background: "rgba(201,168,76,0.15)" }} />
      </div>
    </div>
  );
}