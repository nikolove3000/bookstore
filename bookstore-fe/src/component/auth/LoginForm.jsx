import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { books } from "../../data/books";
import FloatingInput from "./FloatingInput";

const LoginForm = ({ dustRef, currentBook, displayedBg, bgOpacity, onFlip }) => {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const book = books[currentBook] ?? books[0];
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login(form);
      login(response.data);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 relative"
      style={{ background: "#0f0d0d" }}>
      <canvas ref={dustRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 2
      }} />

      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${displayedBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: bgOpacity, transition: "opacity 0.2s ease", zIndex: 0,
      }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(8,4,4,0.55)", zIndex: 1 }} />

      <div style={{ width: "100%", maxWidth: 320, position: "relative", zIndex: 3, padding: "2.5rem" }}>
        <p style={{
          fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "normal",
          letterSpacing: "1px", color: "#c9a84c", textAlign: "center",
          textShadow: "0 1px 8px rgba(0,0,0,0.9)",
        }}>The Liminal Shelf</p>

        <p style={{
          fontSize: "10px", letterSpacing: "3px", color: book.titleColor,
          textAlign: "center", textTransform: "uppercase", marginBottom: "1.2rem",
          opacity: 0.7, textShadow: "0 1px 6px rgba(0,0,0,0.9)",
        }}>where stories linger between worlds</p>

        <div className="flex items-center gap-2 mb-5">
          <hr className="flex-1" style={{ borderColor: book.titleColor, opacity: 0.4 }} />
          <span style={{ color: book.titleColor, fontSize: "12px" }}>✦</span>
          <hr className="flex-1" style={{ borderColor: book.titleColor, opacity: 0.4 }} />
        </div>

        <form onSubmit={handleSubmit}>
          <FloatingInput label="Username or Email" name="usernameOrEmail"
            value={form.usernameOrEmail} onChange={handleChange} />
          <FloatingInput label="Password" type="password" name="password"
            value={form.password} onChange={handleChange} />

          {error && <p className="text-xs mb-3 text-center" style={{ color: "#c0392b" }}>{error}</p>}

          <div className="text-right mb-4">
            <a
              href="mailto:support@theliminal shelf.com?subject=Password%20Reset%20Request"
              className="text-xs italic cursor-pointer"
              style={{ color: "#4a3528", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#4a3528"}>
              Forgot your key?
            </a>
          </div>

          <button type="submit" disabled={loading}
            onMouseEnter={e => { e.currentTarget.style.background = "#2a1010"; e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1a0808"; e.currentTarget.style.borderColor = "#8b2020"; e.currentTarget.style.color = "#c0392b"; }}
            style={{
              width: "100%", padding: "11px", background: "#1a0808",
              border: "0.5px solid #8b2020", borderRadius: "6px", color: "#c0392b",
              fontFamily: "Georgia, serif", fontSize: "12px", letterSpacing: "3px",
              cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase",
              transition: "all 0.3s ease", opacity: loading ? 0.6 : 1,
            }}>
            {loading ? "Opening..." : "⊷  Sign In  ⊶"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: "#4a3528", fontFamily: "Georgia, serif" }}>
          No account yet?{" "}
          <span onClick={onFlip} style={{ color: "#8b3010", cursor: "pointer" }}
            onMouseEnter={e => e.target.style.color = "#c9a84c"}
            onMouseLeave={e => e.target.style.color = "#8b3010"}>
            Begin your journey
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;