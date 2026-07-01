import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <>
            <style>{`
  .ab-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
  .ab-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:900px;margin-left:auto;margin-right:auto;}
  .ab-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
  .ab-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
  .ab-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
  .ab-breadcrumb span.current{color:rgba(201,168,76,0.9);}

  .ab-hero{max-width:780px;margin:0 auto 5rem;text-align:center;}
  .ab-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
  .ab-title{font-size:46px;font-weight:normal;line-height:1.15;letter-spacing:0.5px;margin-bottom:20px;}
  .ab-title em{font-style:italic;color:rgba(201,168,76,0.7);}
  .ab-lede{font-size:18px;line-height:1.85;color:rgba(255,245,230,0.78);font-style:italic;max-width:620px;margin:0 auto;}

  .ab-divider{display:flex;align-items:center;gap:12px;max-width:900px;margin:0 auto 4rem;}
  .ab-divider-line{flex:1;height:0.5px;background:rgba(201,168,76,0.15);}
  .ab-divider-gem{font-size:11px;color:rgba(201,168,76,0.4);}

  .ab-philosophy{max-width:900px;margin:0 auto 5rem;background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:3rem;position:relative;}
  .ab-philosophy-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:1.5rem;text-align:center;}
  .ab-philosophy-text{font-size:17px;line-height:1.9;color:rgba(255,245,230,0.78);font-style:italic;text-align:center;max-width:680px;margin:0 auto;}

  .ab-values{max-width:1100px;margin:0 auto 5rem;display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:0.5px solid rgba(201,168,76,0.12);}
  .ab-value{padding:2.5rem 2rem;border-right:0.5px solid rgba(201,168,76,0.1);text-align:center;}
  .ab-value:last-child{border-right:none;}
  .ab-value-roman{font-size:12px;color:rgba(201,168,76,0.5);letter-spacing:3px;margin-bottom:14px;}
  .ab-value-title{font-size:20px;color:rgba(255,245,230,0.9);letter-spacing:0.5px;margin-bottom:14px;}
  .ab-value-text{font-size:15px;line-height:1.8;color:rgba(255,245,230,0.65);font-style:italic;}

  .ab-timeline{max-width:700px;margin:0 auto 5rem;}
  .ab-timeline-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;text-align:center;}
  .ab-timeline-item{display:grid;grid-template-columns:90px 1fr;gap:1.5rem;padding:1.5rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);}
  .ab-timeline-item:last-child{border-bottom:none;}
  .ab-timeline-year{font-size:20px;color:#c9a84c;letter-spacing:1px;text-align:right;}
  .ab-timeline-text{font-size:16px;line-height:1.8;color:rgba(255,245,230,0.7);font-style:italic;}

  .ab-cta{max-width:600px;margin:0 auto;text-align:center;}
  .ab-cta-text{font-size:16px;font-style:italic;color:rgba(255,245,230,0.65);margin-bottom:24px;line-height:1.8;}
  .ab-cta-btn{background:#1a0808;border:0.5px solid #8b2020;padding:14px 34px;font-family:Georgia,serif;font-size:13px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;}
  .ab-cta-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
`}</style>

            <div className="ab-root">
                <div className="ab-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="sep">·</span>
                    <span className="current">About</span>
                </div>

                {/* HERO */}
                <div className="ab-hero">
                    <div className="ab-kicker">✦ Our Story</div>
                    <h1 className="ab-title">Where Every Shelf<br />Holds a <em>Secret Passage</em></h1>
                    <p className="ab-lede">
                        The Liminal Shelf is not merely a bookstore. It is a threshold — a place where language
                        becomes architecture, and stories become rooms you can inhabit.
                    </p>
                </div>

                <div className="ab-divider">
                    <div className="ab-divider-line" />
                    <span className="ab-divider-gem">✦</span>
                    <div className="ab-divider-line" />
                </div>

                {/* PHILOSOPHY */}
                <div className="ab-philosophy">
                    {[{ top: 14, left: 16 }, { top: 14, right: 16 }, { bottom: 14, left: 16 }, { bottom: 14, right: 16 }].map((s, i) => (
                        <span key={i} style={{ position: "absolute", ...s, fontSize: 14, color: "#c9a84c", opacity: 0.35 }}>✦</span>
                    ))}
                    <div className="ab-philosophy-title">— Curation Philosophy —</div>
                    <p className="ab-philosophy-text">
                        We hand-select each title for the reader who notices the margins, the footnotes,
                        the space between words. Every book on our shelf has been read, considered,
                        and chosen — never merely stocked. We believe a bookstore should feel like a single
                        curated mind, not an algorithm.
                    </p>
                </div>

                {/* VALUES */}
                <div className="ab-values">
                    <div className="ab-value">
                        <div className="ab-value-roman">I</div>
                        <div className="ab-value-title">Curation</div>
                        <p className="ab-value-text">Every title earns its place. No bestseller list, no algorithm — only careful, deliberate reading.</p>
                    </div>
                    <div className="ab-value">
                        <div className="ab-value-roman">II</div>
                        <div className="ab-value-title">Craft</div>
                        <p className="ab-value-text">From first editions to quiet reprints, we honour the physical object as much as the words within.</p>
                    </div>
                    <div className="ab-value">
                        <div className="ab-value-roman">III</div>
                        <div className="ab-value-title">Belonging</div>
                        <p className="ab-value-text">A shelf is a room for the reader who lingers. We built this place to be stayed in, not browsed through.</p>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="ab-timeline">
                    <div className="ab-timeline-title">✦ A Brief History ✦</div>
                    <div className="ab-timeline-item">
                        <div className="ab-timeline-year">I.</div>
                        <p className="ab-timeline-text">The Liminal Shelf began as a single locked cabinet of borrowed and traded books, open only by appointment.</p>
                    </div>
                    <div className="ab-timeline-item">
                        <div className="ab-timeline-year">II.</div>
                        <p className="ab-timeline-text">We opened our doors properly, with a single rule: every book had to be read by someone here before it could be sold.</p>
                    </div>
                    <div className="ab-timeline-item">
                        <div className="ab-timeline-year">III.</div>
                        <p className="ab-timeline-text">Today, the shelf has grown — but the rule has not changed. We still read everything we sell.</p>
                    </div>
                </div>

                <div className="ab-divider">
                    <div className="ab-divider-line" />
                    <span className="ab-divider-gem">✦</span>
                    <div className="ab-divider-line" />
                </div>

                {/* CTA */}
                <div className="ab-cta">
                    <p className="ab-cta-text">Step through the threshold — your next book is waiting to be found.</p>
                    <Link to="/books" className="ab-cta-btn">⊷ &nbsp;Browse the Catalogue&nbsp; ⊶</Link>
                </div>

            </div>
        </>
    );
}