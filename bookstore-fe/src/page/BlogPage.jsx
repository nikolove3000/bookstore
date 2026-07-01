import { Link } from "react-router-dom";

const POSTS = [
  { title: "On Reading Slowly in a Fast World", excerpt: "Why we believe the unhurried reader sees more than the speed-reader ever will.", date: "March 2026" },
  { title: "The Marginalia We Keep", excerpt: "A meditation on the notes left behind in secondhand books, and what they tell us about the reader before us.", date: "February 2026" },
  { title: "Why We Still Read Everything We Sell", excerpt: "The one rule that has never changed since the cabinet days.", date: "January 2026" },
];

export default function BlogPage() {
  return (
    <>
      <style>{`
        .bp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .bp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:780px;margin-left:auto;margin-right:auto;}
        .bp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .bp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .bp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .bp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .bp-hero{max-width:780px;margin:0 auto 4rem;text-align:center;}
        .bp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .bp-title{font-size:42px;font-weight:normal;letter-spacing:0.5px;margin-bottom:16px;}
        .bp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .bp-lede{font-size:16px;line-height:1.8;color:rgba(255,245,230,0.7);font-style:italic;max-width:560px;margin:0 auto;}
        .bp-list{max-width:780px;margin:0 auto;}
        .bp-post{padding:2.2rem 0;border-bottom:0.5px solid rgba(201,168,76,0.1);cursor:default;}
        .bp-post:last-child{border-bottom:none;}
        .bp-post-date{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:10px;font-style:italic;}
        .bp-post-title{font-size:24px;color:rgba(255,245,230,0.9);letter-spacing:0.3px;margin-bottom:12px;line-height:1.3;}
        .bp-post-excerpt{font-size:15px;line-height:1.8;color:rgba(255,245,230,0.6);font-style:italic;}
      `}</style>
      <div className="bp-root">
        <div className="bp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">Reading Notes</span></div>
        <div className="bp-hero">
          <div className="bp-kicker">✦ Reading Notes</div>
          <h1 className="bp-title">Thoughts From <em>The Shelf</em></h1>
          <p className="bp-lede">Occasional writing on books, reading, and the quiet life of a bookstore.</p>
        </div>
        <div className="bp-list">
          {POSTS.map((p, i) => (
            <div key={i} className="bp-post">
              <div className="bp-post-date">{p.date}</div>
              <div className="bp-post-title">{p.title}</div>
              <p className="bp-post-excerpt">{p.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}