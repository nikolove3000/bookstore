import { useState } from "react";
import authApi from "../../api/authApi";
import { books } from "../../data/books";
import FloatingInput from "./FloatingInput";

const RegisterForm = ({ dustRef, currentBook, displayedBg, bgOpacity, onFlip }) => {
  const [form, setForm] = useState({
    username: "", email: "", fullName: "", password: "", confirmPassword: "",
    address: "", phone: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const book = books[currentBook] ?? books[0];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    setError(null); setLoading(true);
    try {
      const { _confirmPassword, ...payload } = form;

      await authApi.register(payload);

      setSuccess(true);
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 relative"
      style={{ background: "#0f0d0d", outline: "2px solid red" }}>

      <canvas ref={dustRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 2
      }} />
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
        }}>begin your journey</p>

        <div className="flex items-center gap-2 mb-5">
          <hr className="flex-1" style={{ borderColor: book.titleColor, opacity: 0.4 }} />
          <span style={{ color: book.titleColor, fontSize: "12px" }}>✦</span>
          <hr className="flex-1" style={{ borderColor: book.titleColor, opacity: 0.4 }} />
        </div>

        {success ? (
          <div style={{ textAlign: "center", fontFamily: "Georgia, serif" }}>
            <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#5a4030", margin: "0 0 20px" }}>— ✦ —</p>

            <p style={{ fontSize: "13px", letterSpacing: "3px", color: "#7a6040", textTransform: "uppercase", margin: "0 0 8px" }}>
              your name has been
            </p>

            <p style={{ fontSize: "34px", fontWeight: "300", fontStyle: "italic", color: "#c9a84c", margin: "0 0 4px", lineHeight: 1.1 }}>
              Inscribed
            </p>

            <p style={{ fontSize: "13px", fontStyle: "italic", color: "#7a6040", margin: "0 0 24px", letterSpacing: "1px" }}>
              into the pages of The Liminal Shelf
            </p>

            <div className="flex items-center gap-2" style={{ margin: "0 0 28px" }}>
              <hr className="flex-1" style={{ borderColor: "#2a1a1a" }} />
              <span style={{ color: "#c9a84c", fontSize: "12px" }}>✦</span>
              <hr className="flex-1" style={{ borderColor: "#2a1a1a" }} />
            </div>

            <button onClick={onFlip}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#8b3010"; e.currentTarget.style.color = "#8b3010"; }}
              style={{
                padding: "10px 28px", border: "0.5px solid #8b3010", background: "transparent",
                color: "#8b3010", letterSpacing: "3px", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "11px",
                borderRadius: "4px", transition: "all 0.3s ease",
              }}>
              Return to the Library
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FloatingInput label="Username" name="username" value={form.username} onChange={handleChange} />
            <FloatingInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
            <FloatingInput label="Full name" type="text" name="fullName" value={form.fullName} onChange={handleChange} />
            <FloatingInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
            <FloatingInput label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

            {error && <p className="text-xs mb-3 text-center" style={{ color: "#c0392b" }}>{error}</p>}

            <button type="submit" disabled={loading}
              onMouseEnter={e => { e.currentTarget.style.background = "#0a1a10"; e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#081208"; e.currentTarget.style.borderColor = "#1d9e75"; e.currentTarget.style.color = "#1d9e75"; }}
              style={{
                width: "100%", padding: "11px", background: "#081208",
                border: "0.5px solid #1d9e75", borderRadius: "6px", color: "#1d9e75",
                fontFamily: "Georgia, serif", fontSize: "12px", letterSpacing: "3px",
                cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase",
                transition: "all 0.3s ease", opacity: loading ? 0.6 : 1, marginBottom: "12px",
              }}>
              {loading ? "Inscribing..." : "⊷  Enter the Shelf  ⊶"}
            </button>
          </form>

        )}
        {!success && (
          <p className="text-center text-xs" style={{ color: "#4a3528", fontFamily: "Georgia, serif" }}>
            Already a reader?{" "}
            <span onClick={onFlip} style={{ color: "#8b3010", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#8b3010"}>
              Return to the library
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
