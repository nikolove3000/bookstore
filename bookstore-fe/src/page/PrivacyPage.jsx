import { Link } from "react-router-dom";

const SECTIONS = [
  { title: "What We Collect", text: "Account details (username, email), order history, shipping addresses, and reviews you choose to post. Nothing more than what's needed to run the shelf." },
  { title: "How We Use It", text: "To process orders, manage your account, and personalise recommendations. We never sell your information to third parties." },
  { title: "Cookies", text: "We use essential cookies only — to keep you logged in and your cart intact. No tracking pixels, no third-party ad networks." },
  { title: "Your Rights", text: "You may request a copy of your data, ask us to correct it, or request deletion of your account at any time by contacting us." },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .pp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .pp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:780px;margin-left:auto;margin-right:auto;}
        .pp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .pp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .pp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .pp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .pp-hero{max-width:780px;margin:0 auto 3.5rem;text-align:center;}
        .pp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .pp-title{font-size:38px;font-weight:normal;letter-spacing:0.5px;}
        .pp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .pp-updated{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);margin-top:10px;}
        .pp-block{max-width:780px;margin:0 auto 2.2rem;}
        .pp-block-title{font-size:18px;color:rgba(255,245,230,0.88);letter-spacing:0.3px;margin-bottom:0.8rem;}
        .pp-block-text{font-size:15px;line-height:1.85;color:rgba(255,245,230,0.65);font-style:italic;}
      `}</style>
      <div className="pp-root">
        <div className="pp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">Privacy Policy</span></div>
        <div className="pp-hero">
          <div className="pp-kicker">✦ Legal</div>
          <h1 className="pp-title">Privacy <em>Policy</em></h1>
          <div className="pp-updated">Last updated June 2026</div>
        </div>
        {SECTIONS.map((s, i) => (
          <div key={i} className="pp-block">
            <div className="pp-block-title">{s.title}</div>
            <p className="pp-block-text">{s.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}