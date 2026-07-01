import { Link } from "react-router-dom";

export default function ShippingPage() {
  return (
    <>
      <style>{`
        .sp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .sp-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2.5rem;max-width:780px;margin-left:auto;margin-right:auto;}
        .sp-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .sp-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .sp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .sp-breadcrumb span.current{color:rgba(201,168,76,0.9);}
        .sp-hero{max-width:780px;margin:0 auto 3.5rem;text-align:center;}
        .sp-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:14px;font-style:italic;}
        .sp-title{font-size:38px;font-weight:normal;letter-spacing:0.5px;}
        .sp-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .sp-block{max-width:780px;margin:0 auto 2.5rem;}
        .sp-block-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:1rem;display:flex;align-items:center;gap:8px;}
        .sp-block-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}
        .sp-block-text{font-size:15px;line-height:1.85;color:rgba(255,245,230,0.7);font-style:italic;}
        .sp-table{border:0.5px solid rgba(201,168,76,0.14);}
        .sp-row{display:grid;grid-template-columns:1fr 1fr;padding:1rem 1.4rem;border-bottom:0.5px solid rgba(201,168,76,0.1);}
        .sp-row:last-child{border-bottom:none;}
        .sp-row-label{font-size:14px;color:rgba(255,245,230,0.8);}
        .sp-row-value{font-size:14px;color:rgba(201,168,76,0.7);font-style:italic;text-align:right;}
      `}</style>
      <div className="sp-root">
        <div className="sp-breadcrumb"><Link to="/">Home</Link><span className="sep">·</span><span className="current">Shipping & Returns</span></div>
        <div className="sp-hero">
          <div className="sp-kicker">✦ Practical Matters</div>
          <h1 className="sp-title">Shipping & <em>Returns</em></h1>
        </div>

        <div className="sp-block">
          <div className="sp-block-title">Delivery Times<div className="sp-block-title-line" /></div>
          <div className="sp-table">
            <div className="sp-row"><span className="sp-row-label">Standard Shipping</span><span className="sp-row-value">5–7 business days · Free</span></div>
            <div className="sp-row"><span className="sp-row-label">Express Shipping</span><span className="sp-row-value">2–3 business days</span></div>
            <div className="sp-row"><span className="sp-row-label">International</span><span className="sp-row-value">10–18 business days</span></div>
          </div>
        </div>

        <div className="sp-block">
          <div className="sp-block-title">Returns<div className="sp-block-title-line" /></div>
          <p className="sp-block-text">
            Books may be returned within 14 days of delivery, provided they remain in original condition.
            Damaged or misprinted copies are replaced at no cost. To begin a return, contact us with your order number.
          </p>
        </div>

        <div className="sp-block">
          <div className="sp-block-title">Order Cancellation<div className="sp-block-title-line" /></div>
          <p className="sp-block-text">
            Orders can be cancelled from your Order History page while still marked Pending.
            Once an order has shipped, please use the returns process instead.
          </p>
        </div>
      </div>
    </>
  );
}