import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import orderApi from "../api/orderApi";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a shipping address");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      const res = await orderApi.checkout(address.trim());
      refreshCart();
      navigate(`/orders/${res.data.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!user || cartLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.45)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
      </div>
    );
  }

  const isEmpty = cart.items.length === 0;

  return (
    <>
      <style>{`
        .ck-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .ck-breadcrumb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:2rem;max-width:1200px;margin-left:auto;margin-right:auto;}
        .ck-breadcrumb a{color:rgba(201,168,76,0.6);text-decoration:none;}
        .ck-breadcrumb a:hover{color:rgba(201,168,76,0.85);}
        .ck-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .ck-breadcrumb span.current{color:rgba(201,168,76,0.85);}

        .ck-head{margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;max-width:1200px;margin-left:auto;margin-right:auto;}
        .ck-kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .ck-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .ck-title em{font-style:italic;color:rgba(201,168,76,0.65);}

        .ck-layout{display:grid;grid-template-columns:1fr 320px;gap:2.5rem;max-width:1200px;margin:0 auto;align-items:start;}

        .ck-block{margin-bottom:2.5rem;}
        .ck-block-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:1.2rem;display:flex;align-items:center;gap:8px;}
        .ck-block-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}

        .ck-textarea{width:100%;min-height:110px;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:12px 14px;font-family:Georgia,serif;font-size:14px;color:rgba(255,245,230,0.85);outline:none;resize:vertical;line-height:1.6;}
        .ck-textarea::placeholder{color:rgba(201,168,76,0.32);font-style:italic;}
        .ck-textarea:focus{border-color:rgba(201,168,76,0.45);}
        .ck-error{font-size:12px;color:#c0392b;font-style:italic;margin-top:8px;}

        .ck-review-item{display:grid;grid-template-columns:56px 1fr auto;gap:1rem;align-items:center;padding:0.9rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);}
        .ck-review-item:last-child{border-bottom:none;}
        .ck-review-cover{width:56px;height:82px;object-fit:cover;display:block;border:0.5px solid rgba(201,168,76,0.18);}
        .ck-review-fallback{width:56px;height:82px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.18);font-size:12px;color:rgba(201,168,76,0.35);}
        .ck-review-title{font-size:15px;color:rgba(255,245,230,0.85);line-height:1.3;margin-bottom:3px;}
        .ck-review-meta{font-size:12px;font-style:italic;color:rgba(201,168,76,0.55);}
        .ck-review-subtotal{font-size:16px;color:#c9a84c;letter-spacing:0.5px;}

        .ck-summary{background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:2rem;position:relative;}
        .ck-summary-title{font-size:14px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:1.5rem;text-align:center;}
        .ck-summary-row{display:flex;align-items:center;justify-content:space-between;font-size:14px;color:rgba(255,245,230,0.65);padding:8px 0;}
        .ck-summary-row.total{border-top:0.5px solid rgba(201,168,76,0.18);margin-top:8px;padding-top:16px;font-size:18px;color:rgba(255,245,230,0.92);}
        .ck-summary-row.total span:last-child{color:#c9a84c;letter-spacing:0.5px;}
        .ck-place-btn{width:100%;background:#1a0808;border:0.5px solid #8b2020;padding:15px 6px;font-family:Georgia,serif;font-size:12px;letter-spacing:1px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:1.5rem;white-space:nowrap;display:flex;align-items:center;justify-content:center;}        .ck-place-btn:disabled{opacity:0.4;cursor:default;}
        .ck-back-link{display:block;text-align:center;margin-top:1rem;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);text-decoration:none;border-bottom:0.5px solid rgba(201,168,76,0.15);padding-bottom:2px;}
        .ck-back-link:hover{color:rgba(201,168,76,0.8);}

        .ck-empty{max-width:1200px;margin:0 auto;text-align:center;padding:5rem 0;}
        .ck-empty-icon{font-size:32px;color:rgba(201,168,76,0.3);margin-bottom:1.5rem;}
        .ck-empty-text{font-size:16px;font-style:italic;color:rgba(255,245,230,0.5);margin-bottom:2rem;}
        .ck-empty-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 28px;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block;}
        .ck-empty-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
      `}</style>

      <div className="ck-root">
        <div className="ck-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">·</span>
          <Link to="/cart">Cart</Link>
          <span className="sep">·</span>
          <span className="current">Checkout</span>
        </div>

        <div className="ck-head">
          <div className="ck-kicker">✦ Final Steps</div>
          <h1 className="ck-title">Complete Your <em>Order</em></h1>
        </div>

        {isEmpty ? (
          <div className="ck-empty">
            <div className="ck-empty-icon">✦</div>
            <p className="ck-empty-text">Your cart is empty — nothing to check out yet.</p>
            <Link to="/books" className="ck-empty-btn">⊷ &nbsp;Browse the Catalogue&nbsp; ⊶</Link>
          </div>
        ) : (
          <form className="ck-layout" onSubmit={handlePlaceOrder}>

            {/* LEFT — address + review */}
            <div>
              <div className="ck-block">
                <div className="ck-block-title">Shipping Address<div className="ck-block-title-line" /></div>
                <textarea
                  className="ck-textarea"
                  placeholder="Full address — street, ward, district, city…"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                {error && <div className="ck-error">{error}</div>}
              </div>

              <div className="ck-block">
                <div className="ck-block-title">Order Review ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})<div className="ck-block-title-line" /></div>
                {cart.items.map(item => (
                  <div key={item.id} className="ck-review-item">
                    {item.coverUrl ? (
                      <img className="ck-review-cover" src={item.coverUrl} alt={item.title} />
                    ) : (
                      <div className="ck-review-fallback">✦</div>
                    )}
                    <div>
                      <div className="ck-review-title">{item.title}</div>
                      <div className="ck-review-meta">Qty {item.quantity} &nbsp;·&nbsp; ${Number(item.price).toFixed(2)} each</div>
                    </div>
                    <span className="ck-review-subtotal">${Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — summary */}
            <div className="ck-summary">
              {[{ top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }].map((s, i) => (
                <span key={i} style={{ position: "absolute", ...s, fontSize: 12, color: "#c9a84c", opacity: 0.35 }}>✦</span>
              ))}
              <div className="ck-summary-title">Order Summary</div>
              <div className="ck-summary-row">
                <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})</span>
                <span>${Number(cart.totalPrice).toFixed(2)}</span>
              </div>
              <div className="ck-summary-row">
                <span>Shipping</span>
                <span style={{ fontStyle: "italic", color: "rgba(201,168,76,0.5)" }}>Free</span>
              </div>
              <div className="ck-summary-row total">
                <span>Total</span>
                <span>${Number(cart.totalPrice).toFixed(2)}</span>
              </div>
              <button type="submit" className="ck-place-btn" disabled={placing}>
                {placing ? "Placing Order…" : "⊷ Place Order ⊶"}
              </button>
              <Link to="/cart" className="ck-back-link">Back to Cart</Link>
            </div>

          </form>
        )}
      </div>
    </>
  );
}