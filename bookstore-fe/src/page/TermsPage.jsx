import { Link } from "react-router-dom";

const SECTIONS = [
  { title: "Orders & Payment", text: "All orders are confirmed at checkout. Prices are listed in USD and may change without prior notice, though confirmed orders honour the price at time of purchase." },
  { title: "Shipping", text: "Estimated delivery windows are not guaranteed. We are not liable for delays caused by carriers or customs." },
  { title: "Returns & Cancellations", text: "Pending orders may be cancelled from your Order History. Once shipped, please follow our standard returns process." },
  { title: "Reviews", text: "Reviews may only be posted for books you have purchased and received. We reserve the right to remove reviews that violate community standards." },
  { title: "Account Responsibility", text: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account." },
];

export default function TermsPage() {
  return (
    <>
      <style>{`
        .tp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .tp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:780px;margin-left:auto;margin-right:auto;}
        .tp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .tp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .tp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .tp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .tp-hero{max-width:780px;margin:0 auto 3.5rem;text-align:center;}
        .tp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .tp-title{font-size:38px;font-weight:normal;letter-spacing:0.5px;}
        .tp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .tp-updated{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);margin-top:10px;}
        .tp-block{max-width:780px;margin:0 auto 2.2rem;}
        .tp-block-title{font-size:18px;color:rgba(255,245,230,0.88);letter-spacing:0.3px;margin-bottom:0.8rem;}
        .tp-block-text{font-size:15px;line-height:1.85;color:rgba(255,245,230,0.65);font-style:italic;}
      `}</style>
      <div className="tp-root">
        <div className="tp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">Terms of Service</span></div>
        <div className="tp-hero">
          <div className="tp-kicker">✦ Legal</div>
          <h1 className="tp-title">Terms of <em>Service</em></h1>
          <div className="tp-updated">Last updated June 2026</div>
        </div>
        {SECTIONS.map((s, i) => (
          <div key={i} className="tp-block">
            <div className="tp-block-title">{s.title}</div>
            <p className="tp-block-text">{s.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}