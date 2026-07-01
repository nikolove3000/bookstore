import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  { q: "How do I track my order?", a: "Visit Order History from your profile menu — each order shows its current status, from Pending through Delivered." },
  { q: "Can I review a book I haven't bought here?", a: "No — reviews are reserved for readers who've received the title through us, to keep every reflection genuine." },
  { q: "Do you ship internationally?", a: "Yes, to most countries. International delivery typically takes 10–18 business days." },
  { q: "How do I cancel an order?", a: "Open the order from your Order History while it's still Pending, and select Cancel Order. Stock is restored automatically." },
  { q: "What if my book arrives damaged?", a: "Contact us with your order number and a photo — we'll send a replacement at no charge." },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <style>{`
        .fp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .fp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:780px;margin-left:auto;margin-right:auto;}
        .fp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .fp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .fp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .fp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .fp-hero{max-width:780px;margin:0 auto 3.5rem;text-align:center;}
        .fp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .fp-title{font-size:38px;font-weight:normal;letter-spacing:0.5px;}
        .fp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .fp-list{max-width:780px;margin:0 auto;border:0.5px solid rgba(201,168,76,0.14);}
        .fp-item{border-bottom:0.5px solid rgba(201,168,76,0.1);}
        .fp-item:last-child{border-bottom:none;}
        .fp-q{display:flex;align-items:center;justify-content:space-between;padding:1.3rem 1.5rem;cursor:pointer;font-size:16px;color:rgba(255,245,230,0.85);transition:background 0.2s;}
        .fp-q:hover{background:rgba(201,168,76,0.03);}
        .fp-q-icon{font-size:14px;color:rgba(201,168,76,0.5);transition:transform 0.25s;flex-shrink:0;margin-left:1rem;}
        .fp-q-icon.open{transform:rotate(45deg);}
        .fp-a{padding:0 1.5rem;max-height:0;overflow:hidden;transition:max-height 0.3s ease,padding 0.3s ease;}
        .fp-a.open{padding:0 1.5rem 1.4rem;max-height:200px;}
        .fp-a-text{font-size:14px;line-height:1.8;color:rgba(255,245,230,0.62);font-style:italic;}
      `}</style>
      <div className="fp-root">
        <div className="fp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">FAQ</span></div>
        <div className="fp-hero">
          <div className="fp-kicker">✦ Common Questions</div>
          <h1 className="fp-title">Frequently <em>Asked</em></h1>
        </div>
        <div className="fp-list">
          {FAQS.map((f, i) => (
            <div key={i} className="fp-item">
              <div className="fp-q" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {f.q}
                <span className={`fp-q-icon ${openIdx === i ? "open" : ""}`}>✦</span>
              </div>
              <div className={`fp-a ${openIdx === i ? "open" : ""}`}>
                <p className="fp-a-text">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}