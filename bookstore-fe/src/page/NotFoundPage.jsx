import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <style>{`
        .nf-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);display:flex;align-items:center;justify-content:center;padding:120px 3rem 5rem;position:relative;overflow:hidden;}
        .nf-vline{position:absolute;top:60px;bottom:60px;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .nf-vline-bar{width:0.5px;flex:1;background:linear-gradient(to bottom,transparent,rgba(201,168,76,0.22),transparent);}
        .nf-vline-text{font-size:8px;letter-spacing:4px;text-transform:uppercase;color:rgba(201,168,76,0.4);writing-mode:vertical-rl;}
        .nf-content{max-width:560px;text-align:center;position:relative;z-index:2;}
        .nf-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 60% at 50% 40%,rgba(201,168,76,0.08) 0%,transparent 70%);}
        .nf-folio{font-size:90px;color:#c9a84c;opacity:0.85;letter-spacing:4px;line-height:1;margin-bottom:1.5rem;font-style:italic;}
        .nf-divider{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;}
        .nf-divider-line{flex:1;height:0.5px;background:rgba(201,168,76,0.2);}
        .nf-divider-gem{font-size:13px;color:rgba(201,168,76,0.5);}
        .nf-title{font-size:30px;font-weight:normal;letter-spacing:0.5px;margin-bottom:16px;color:rgba(255,245,230,0.9);}
        .nf-title em{font-style:italic;color:rgba(201,168,76,0.75);}
        .nf-text{font-size:16px;line-height:1.85;color:rgba(255,245,230,0.62);font-style:italic;margin-bottom:2.5rem;max-width:440px;margin-left:auto;margin-right:auto;}
        .nf-actions{display:flex;align-items:center;justify-content:center;gap:20px;}
        .nf-btn-primary{background:#1a0808;border:0.5px solid #8b2020;padding:13px 30px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;}
        .nf-btn-primary:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .nf-btn-ghost{background:none;border:none;border-bottom:0.5px solid rgba(201,168,76,0.25);font-family:Georgia,serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);cursor:pointer;padding:10px 0;text-decoration:none;transition:color 0.2s,border-color 0.2s;}
        .nf-btn-ghost:hover{color:rgba(201,168,76,0.85);border-color:rgba(201,168,76,0.5);}
      `}</style>

      <div className="nf-root">
        <div className="nf-glow" />

        <div className="nf-vline" style={{ left: 30 }}>
          <div className="nf-vline-bar" />
          <div className="nf-vline-text">BIBLIOTHECA</div>
          <div className="nf-vline-bar" />
        </div>
        <div className="nf-vline" style={{ right: 30 }}>
          <div className="nf-vline-bar" />
          <div className="nf-vline-text">NOCTIS</div>
          <div className="nf-vline-bar" />
        </div>

        <div className="nf-content">
          <div className="nf-folio">Folio 404</div>

          <div className="nf-divider">
            <div className="nf-divider-line" />
            <span className="nf-divider-gem">✦</span>
            <div className="nf-divider-line" />
          </div>

          <h1 className="nf-title">This Page Has <em>Slipped Between Shelves</em></h1>
          <p className="nf-text">
            The page you're looking for doesn't exist — perhaps it was never written,
            or has quietly vanished into the stacks.
          </p>

          <div className="nf-actions">
            <Link to="/" className="nf-btn-primary">⊷ &nbsp;Return Home&nbsp; ⊶</Link>
            <Link to="/books" className="nf-btn-ghost">Browse the Catalogue</Link>
          </div>
        </div>
      </div>
    </>
  );
}