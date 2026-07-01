import { useState } from "react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to a real contact endpoint when available
    setSent(true);
  };

  return (
    <>
      <style>{`
        .cp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .cp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:600px;margin-left:auto;margin-right:auto;}
        .cp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .cp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .cp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .cp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .cp-hero{max-width:600px;margin:0 auto 3rem;text-align:center;}
        .cp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .cp-title{font-size:38px;font-weight:normal;letter-spacing:0.5px;margin-bottom:14px;}
        .cp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .cp-lede{font-size:15px;line-height:1.8;color:rgba(255,245,230,0.62);font-style:italic;}
        .cp-form{max-width:600px;margin:0 auto;background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:2.5rem;position:relative;}
        .cp-field{margin-bottom:1.4rem;}
        .cp-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:8px;font-style:italic;display:block;}
        .cp-input,.cp-textarea{width:100%;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:11px 14px;font-family:Georgia,serif;font-size:14px;color:rgba(255,245,230,0.85);outline:none;}
        .cp-textarea{min-height:120px;resize:vertical;line-height:1.6;}
        .cp-input:focus,.cp-textarea:focus{border-color:rgba(201,168,76,0.45);}
        .cp-submit{width:100%;background:#1a0808;border:0.5px solid #8b2020;padding:13px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:0.5rem;}
        .cp-submit:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .cp-sent{text-align:center;padding:2rem 0;}
        .cp-sent-icon{font-size:28px;color:#c9a84c;opacity:0.6;margin-bottom:1rem;}
        .cp-sent-text{font-size:15px;font-style:italic;color:rgba(255,245,230,0.7);}
      `}</style>
      <div className="cp-root">
        <div className="cp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">Contact</span></div>
        <div className="cp-hero">
          <div className="cp-kicker">✦ Reach Out</div>
          <h1 className="cp-title">Write To <em>Us</em></h1>
          <p className="cp-lede">A question, a recommendation, or a story about a book that found you — we read every letter.</p>
        </div>

        <div className="cp-form">
          {[{ top: 14, left: 16 }, { top: 14, right: 16 }, { bottom: 14, left: 16 }, { bottom: 14, right: 16 }].map((s, i) => (
            <span key={i} style={{ position: "absolute", ...s, fontSize: 14, color: "#c9a84c", opacity: 0.35 }}>✦</span>
          ))}
          {sent ? (
            <div className="cp-sent">
              <div className="cp-sent-icon">✦</div>
              <p className="cp-sent-text">Your message has been received. We'll reply soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="cp-field">
                <label className="cp-label">Name</label>
                <input className="cp-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="cp-field">
                <label className="cp-label">Email</label>
                <input className="cp-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="cp-field">
                <label className="cp-label">Message</label>
                <textarea className="cp-textarea" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="cp-submit">⊷ Send Message ⊶</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}