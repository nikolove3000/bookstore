import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";

import yisang from "../assets/covers/yisang.jpg";
import faust from "../assets/covers/faust.jpg";
import donquixote from "../assets/covers/donquixote.jpg";
import ryoshu from "../assets/covers/ryoshu.jpg";
import meursault from "../assets/covers/meursault.jpg";
import honglu from "../assets/covers/honglu.jpg";
import heathcliff from "../assets/covers/heathcliff.jpg";
import ishmael from "../assets/covers/ishmael.jpg";
import rodion from "../assets/covers/rodion.jpg";
import sinclair from "../assets/covers/sinclair.jpg";
import outis from "../assets/covers/outis.jpg";
import gregor from "../assets/covers/gregor.jpg";
import bgYisang from "../assets/bg/yisang.jpg";
import bgFaust from "../assets/bg/faust.jpg";
import bgDonquixote from "../assets/bg/donquixote.jpg";
import bgRyoshu from "../assets/bg/ryoshu.png";
import bgMeursault from "../assets/bg/meursault.jpg";
import bgHonglu from "../assets/bg/honglu.jpeg";
import bgHeathcliff from "../assets/bg/heathcliff.jpg";
import bgIshmael from "../assets/bg/ishmael.jpeg";
import bgRodion from "../assets/bg/rodion.jpg";
import bgSinclair from "../assets/bg/sinclair.jpg";
import bgOutis from "../assets/bg/outis.jpg";
import bgGregor from "../assets/bg/gregor.jpg";
import useBookCarousel from "../hooks/useBookCarousel";
import useDust from "../hooks/useDust";

const books = [
  { title: "Beneath Broken Wings", accent: "#7b5ea7", titleColor: "#c9b8f0", quote: "Let my wings grow back. Let me fly once more.", src: "— Narrator · Wings", cover: yisang, bg: bgYisang },
  { title: "Beyond Forbidden Knowledge", accent: "#1d9e75", titleColor: "#a8d4c8", quote: "Two souls, alas, are dwelling in my breast.", src: "— Faust · Faust", cover: faust, bg: bgFaust },
  { title: "Against Wandering Winds", accent: "#ba7517", titleColor: "#f0d88a", quote: "Too much sanity may be madness — the maddest of all, to see life as it is and not as it should be.", src: "— Don Quixote · Don Quixote", cover: donquixote, bg: bgDonquixote },
  { title: "Within Painted Agony", accent: "#c0392b", titleColor: "#f0a070", quote: "I cannot paint what I have not seen with my own eyes.", src: "— Yoshihide · Hell Screen", cover: ryoshu, bg: bgRyoshu },
  { title: "Under an Indifferent Sun", accent: "#888888", titleColor: "#b8b8b8", quote: "I had only a little time left and I didn't want to waste it on God.", src: "— Meursault · The Stranger", cover: meursault, bg: bgMeursault },
  { title: "Before Falling Petals", accent: "#d4537e", titleColor: "#f0a0b8", quote: "Truth becomes fiction when the fiction's true; real becomes not-real where the unreal's real.", src: "— Bao-yu · Dream of the Red Chamber", cover: honglu, bg: bgHonglu },
  { title: "Amid Restless Storms", accent: "#2a5f7a", titleColor: "#a0b8c8", quote: "I cannot live without my life! I cannot live without my soul!", src: "— Heathcliff · Wuthering Heights", cover: heathcliff, bg: bgHeathcliff },
  { title: "Across Silent Seas", accent: "#185FA5", titleColor: "#8ab4d4", quote: "It is not down on any map; true places never are.", src: "— Ishmael · Moby Dick", cover: ishmael, bg: bgIshmael },
  { title: "Under the Weight of Guilt", accent: "#8b2020", titleColor: "#d48a8a", quote: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", src: "— Raskolnikov · Crime and Punishment", cover: rodion, bg: bgRodion },
  { title: "Between Shadow and Self", accent: "#3B6D11", titleColor: "#a8c890", quote: "The bird fights its way out of the egg. The egg is the world.", src: "— Sinclair · Demian", cover: sinclair, bg: bgSinclair },
  { title: "Along the Endless Road", accent: "#854F0B", titleColor: "#d4c080", quote: "Of all creatures that breathe and move upon the earth, nothing is bred that is weaker than man.", src: "— Odysseus · The Odyssey", cover: outis, bg: bgOutis },
  { title: "After the Human Shape", accent: "#27500A", titleColor: "#90b890", quote: "I cannot make you understand. I cannot make anyone understand what is happening inside me.", src: "— Gregor Samsa · The Metamorphosis", cover: gregor, bg: bgGregor },
];


const FloatingInput = ({ label, type = "text", name, value, onChange, placeholder = " " }) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="relative mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-md px-3 outline-none transition-all"
        style={{
          paddingTop: isFloated ? "20px" : "13px",
          paddingBottom: isFloated ? "6px" : "13px",
          background: "#0a0808",
          border: `0.5px solid ${focused ? "#c9a84c" : "#2a1a1a"}`,
          color: "#c8b8a8",
          fontFamily: "Georgia, serif",
          fontSize: "13px",
        }}
      />
      <label
        className="absolute left-3 pointer-events-none transition-all"
        style={{
          top: isFloated ? "5px" : "50%",
          transform: isFloated ? "translateY(0)" : "translateY(-50%)",
          fontSize: isFloated ? "10px" : "13px",
          color: focused ? "#c9a84c" : "#6a5040",
          letterSpacing: isFloated ? "1px" : "0px",
          textTransform: isFloated ? "uppercase" : "none",
          fontFamily: "Georgia, serif",
        }}
      >
        {label}
      </label>
    </div>
  );
};

const LoginPage = () => {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { current, slideAnimating, slideDir, coverScale, coverOpacity,
    changeBook, handleCoverClick, pauseAndReset, setIsPaused } = useBookCarousel(12);
  const { login } = useAuth();
  const navigate = useNavigate();

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  const [displayedBg, setDisplayedBg] = useState(books[current].bg);
  const [bgOpacity, setBgOpacity] = useState(1);

  useEffect(() => {
    setBgOpacity(0);
    const timer = setTimeout(() => {
      setDisplayedBg(books[current].bg);
      setBgOpacity(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [current]);

  const book = books[current];

  useDust('dust-right', hexToRgb(book.accent));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login(form);
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0d0b0b", fontFamily: "Georgia, serif" }}>

      {/* LEFT */}
      <div className="flex flex-col items-center justify-center flex-1 relative border-r p-8"
        style={{ background: "#0F1720", borderColor: "#2a1a1a" }}>

        <span className="absolute top-4 left-4 text-xs" style={{ color: book.accent, opacity: 0.8, fontSize: "15px" }}>✦</span>
        <span className="absolute top-4 right-4 text-xs" style={{ color: book.accent, opacity: 0.8, fontSize: "15px" }}>✦</span>
        <span className="absolute bottom-4 left-4 text-xs" style={{ color: book.accent, opacity: 0.8, fontSize: "15px" }}>✦</span>
        <span className="absolute bottom-4 right-4 text-xs" style={{ color: book.accent, opacity: 0.8, fontSize: "15px" }}>✦</span>

        <p className="text-xs tracking-widest mb-3" style={{ color: book.accent, opacity: 0.8, fontSize: "20px" }}>— ✦ —</p>

        <div
          onMouseEnter={pauseAndReset}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: slideAnimating
              ? `translateX(${slideDir === "next" ? -40 : 40}px)`
              : "translateX(0)",
            opacity: slideAnimating ? 0 : 1,
            transition: "transform 0.2s ease, opacity 0.4s ease",
          }}>

          {/* Poetic title */}
          <p className="text-base italic text-center mb-3 tracking-wide"
            style={{ color: book.titleColor }}>
            {book.title}
          </p>

          {/* Book cover */}
          <div className="mb-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCoverClick("next"); pauseAndReset(); }}
            style={{
              width: 180,
              borderRadius: "4px 10px 10px 4px",
              border: `0.5px solid ${book.accent}`,
              overflow: "hidden",
              transform: `scale(${coverScale})`,
              opacity: coverOpacity,
              transition: "transform 0.25s ease, opacity 0.25s ease",
            }}>
            <img src={book.cover} alt={book.title} className="w-full h-auto" />
          </div>

          {/* Quote */}
          <div className="text-center" style={{ maxWidth: 210 }}>
            <p className="text-3xl leading-none mb-1" style={{ color: book.accent }}>"</p>
            <p className="text-sm italic leading-relaxed" style={{ color: book.titleColor }}>{book.quote}</p>
            <p className="text-xs mt-1 tracking-wide" style={{ color: book.accent, opacity: 0.7 }}>{book.src}</p>
          </div>

          {/* Dots */}
          <div className="flex gap-4 justify-center mt-3">
            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map((roman, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {/* Dot — chỉ hiển thị, không bấm */}
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: i === current ? book.accent : "#2a1515",
                  border: i === current ? "none" : `0.5px solid ${book.accent}`,
                  opacity: i === current ? 1 : 0.5,
                  transition: "all 0.2s ease",
                }} />
                {/* Số La Mã — bấm được */}
                <span
                  onClick={() => { changeBook(i); pauseAndReset(); }}
                  style={{
                    fontSize: i === current ? "11px" : "9px",
                    color: i === current ? book.accent : "#4a3030",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    transition: "all 0.2s ease",
                    letterSpacing: "1px",
                  }}
                >
                  {roman}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-center justify-center flex-1 relative overflow-hidden"
        style={{ background: "#0f0d0d" }}>

        {/* Background*/}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${displayedBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.2s ease",
          opacity: bgOpacity,
          zIndex: 0
        }} />

        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(8,4,4,0.3)",
          zIndex: 1
        }} />

        <canvas id="dust-right" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 0
        }} />

        <div style={{ width: "100%", maxWidth: 280, position: "relative", zIndex: 3, padding: "2.5rem" }}>

          {/* Shop name */}
          <p style={{
            fontFamily: "'Purgatorio', serif",
            fontSize: "36px", fontWeight: "normal", letterSpacing: "1px",
            color: "#c9a84c",
            textAlign: "center",
            textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
          }}>
            The Liminal Shelf
          </p>
          <p style={{
            fontSize: "10px", letterSpacing: "3px",
            color: books[current].titleColor,
            textAlign: "center", textTransform: "uppercase", marginBottom: "1.2rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            opacity: 0.7,
          }}>
            Librarian, star and the city
          </p>

          <div className="flex items-center gap-2 mb-5">
            <hr className="flex-1" style={{ borderColor: books[current].titleColor, opacity: 0.6 }} />
            <span className="text-xs tracking-widest" style={{ color: books[current].titleColor }}>✦</span>
            <hr className="flex-1" style={{ borderColor: books[current].titleColor, opacity: 0.6 }} />
          </div>

          <form onSubmit={handleSubmit}>
            <FloatingInput
              label="Username or Email"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
            />
            <FloatingInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            {error && (
              <p className="text-xs mb-3 text-center" style={{ color: "#c0392b" }}>{error}</p>
            )}

            <div className="text-right mb-4">
              <span className="text-xs italic cursor-pointer transition-colors"
                style={{ color: "#4a3528" }}
                onMouseEnter={e => e.target.style.color = "#c9a84c"}
                onMouseLeave={e => e.target.style.color = "#4a3528"}>
                Forgot your key?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#2a1010";
                e.currentTarget.style.borderColor = "#c9a84c";
                e.currentTarget.style.color = "#c9a84c";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#1a0808";
                e.currentTarget.style.borderColor = "#8b2020";
                e.currentTarget.style.color = "#c0392b";
              }}
              style={{
                width: "100%", padding: "11px",
                background: "#1a0808",
                border: "0.5px solid #8b2020",
                borderRadius: "6px", color: "#c0392b",
                fontFamily: "Georgia, serif", fontSize: "12px",
                letterSpacing: "3px", cursor: loading ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
                opacity: loading ? 0.6 : 1,
              }}>
              {loading ? "Opening..." : "⊷  Sign In  ⊶"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "#4a3528", fontFamily: "Georgia, serif" }}>
            No account yet?{" "}
            <Link to="/register"
              style={{ color: "#8b3010" }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#8b3010"}>
              Begin your journey
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;