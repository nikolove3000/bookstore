import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function CartPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { cart, loading: cartLoading, updateQuantity, removeItem, refreshCart } = useCart();
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname }, replace: true });
        }
    }, [user, navigate, location.pathname]);

    const handleQuantityChange = async (item, newQty) => {
        if (newQty < 1) {
            handleRemove(item.id);
            return;
        }
        setBusyId(item.id);
        try {
            await updateQuantity(item.id, newQty);
        } catch (err) {
            alert(err.response?.data?.message || "Could not update quantity");
        } finally {
            setBusyId(null);
        }
    };

    const handleRemove = async (itemId) => {
        setBusyId(itemId);
        try {
            await removeItem(itemId);
        } catch (err) {
            alert(err.response?.data?.message || "Could not remove item");
        } finally {
            setBusyId(null);
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
        .cp-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .cp-breadcrumb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:2rem;max-width:1200px;margin-left:auto;margin-right:auto;}
        .cp-breadcrumb a{color:rgba(201,168,76,0.6);text-decoration:none;}
        .cp-breadcrumb a:hover{color:rgba(201,168,76,0.85);}
        .cp-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .cp-breadcrumb span.current{color:rgba(201,168,76,0.85);}

        .cp-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;max-width:1200px;margin-left:auto;margin-right:auto;}
        .cp-kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .cp-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .cp-title em{font-style:italic;color:rgba(201,168,76,0.65);}
        .cp-count{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);}

        .cp-layout{display:grid;grid-template-columns:1fr 320px;gap:2.5rem;max-width:1200px;margin:0 auto;align-items:start;}

        .cp-item{display:grid;grid-template-columns:80px 1fr auto auto;gap:1.5rem;align-items:center;padding:1.4rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);}
        .cp-item-cover{width:80px;height:118px;object-fit:cover;display:block;border:0.5px solid rgba(201,168,76,0.18);}
        .cp-item-fallback{width:80px;height:118px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.18);font-size:14px;color:rgba(201,168,76,0.35);}
        .cp-item-title{font-size:16px;color:rgba(255,245,230,0.85);line-height:1.3;margin-bottom:5px;}
        .cp-item-author{font-size:14px;font-style:italic;color:rgba(201,168,76,0.6);margin-bottom:6px;}
        .cp-item-price{font-size:14px;color:rgba(201,168,76,0.6);}
        .cp-item-warn{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#c0392b;font-style:italic;margin-top:4px;}

        .cp-qty{display:flex;align-items:center;border:0.5px solid rgba(201,168,76,0.25);}
        .cp-qty button{width:30px;height:34px;background:none;border:none;color:rgba(201,168,76,0.65);cursor:pointer;font-size:15px;font-family:Georgia,serif;transition:color 0.2s;}
        .cp-qty button:hover{color:#c9a84c;}
        .cp-qty button:disabled{opacity:0.3;cursor:default;}
        .cp-qty span{width:34px;text-align:center;font-size:15px;color:rgba(255,245,230,0.82);}

        .cp-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
        .cp-subtotal{font-size:17px;color:#c9a84c;letter-spacing:0.5px;}
        .cp-remove{background:none;border:none;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.4);cursor:pointer;font-family:Georgia,serif;transition:color 0.2s;border-bottom:0.5px solid rgba(201,168,76,0.15);padding-bottom:2px;}
        .cp-remove:hover{color:#c0392b;border-color:rgba(192,57,43,0.4);}

        .cp-summary{background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:2rem;position:relative;}
        .cp-summary-title{font-size:15px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:1.5rem;text-align:center;}
        .cp-summary-row{display:flex;align-items:center;justify-content:space-between;font-size:15px;color:rgba(255,245,230,0.65);padding:8px 0;}
        .cp-summary-row.total{border-top:0.5px solid rgba(201,168,76,0.18);margin-top:8px;padding-top:16px;font-size:18px;color:rgba(255,245,230,0.92);}
        .cp-summary-row.total span:last-child{color:#c9a84c;letter-spacing:0.5px;}
        .cp-checkout-btn{width:100%;background:#1a0808;border:0.5px solid #8b2020;padding:15px 6px;font-family:Georgia,serif;font-size:12px;letter-spacing:1px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:1.5rem;white-space:nowrap;display:flex;align-items:center;justify-content:center;}.cp-checkout-btn{width:100%;background:#1a0808;border:0.5px solid #8b2020;padding:15px 6px;font-family:Georgia,serif;font-size:12px;letter-spacing:1px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:1.5rem;white-space:nowrap;display:flex;align-items:center;justify-content:center;}        .cp-continue-link{display:block;text-align:center;margin-top:1rem;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);text-decoration:none;border-bottom:0.5px solid rgba(201,168,76,0.15);padding-bottom:2px;}
        .cp-continue-link:hover{color:rgba(201,168,76,0.8);}

        .cp-empty{max-width:1200px;margin:0 auto;text-align:center;padding:5rem 0;}
        .cp-empty-icon{font-size:34px;color:rgba(201,168,76,0.3);margin-bottom:1.5rem;}
        .cp-empty-text{font-size:16px;font-style:italic;color:rgba(255,245,230,0.5);margin-bottom:2rem;}
        .cp-empty-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 28px;font-family:Georgia,serif;font-size:13px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block;}
        .cp-empty-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
      `}</style>

            <div className="cp-root">
                <div className="cp-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="sep">·</span>
                    <span className="current">Cart</span>
                </div>

                <div className="cp-head">
                    <div>
                        <div className="cp-kicker">✦ Your Reading List</div>
                        <h1 className="cp-title">Shopping <em>Cart</em></h1>
                    </div>
                    {!isEmpty && <div className="cp-count">{cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}</div>}
                </div>

                {isEmpty ? (
                    <div className="cp-empty">
                        <div className="cp-empty-icon">✦</div>
                        <p className="cp-empty-text">Your cart is empty — the shelf awaits.</p>
                        <Link to="/books" className="cp-empty-btn">⊷ &nbsp;Browse the Catalogue&nbsp; ⊶</Link>
                    </div>
                ) : (
                    <div className="cp-layout">

                        {/* ── ITEMS ── */}
                        <div>
                            {cart.items.map(item => (
                                <div key={item.id} className="cp-item" style={{ opacity: busyId === item.id ? 0.5 : 1 }}>
                                    {item.coverUrl ? (
                                        <img className="cp-item-cover" src={item.coverUrl} alt={item.title} />
                                    ) : (
                                        <div className="cp-item-fallback">✦</div>
                                    )}

                                    <div>
                                        <Link to={`/books/${item.bookId}`} style={{ textDecoration: "none" }}>
                                            <div className="cp-item-title">{item.title}</div>
                                        </Link>
                                        <div className="cp-item-author">{item.authorName}</div>
                                        <div className="cp-item-price">${Number(item.price).toFixed(2)} each</div>
                                        {!item.inStock && <div className="cp-item-warn">✦ Limited stock — adjust quantity</div>}
                                    </div>

                                    <div className="cp-qty">
                                        <button onClick={() => handleQuantityChange(item, item.quantity - 1)} disabled={busyId === item.id}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item, item.quantity + 1)} disabled={busyId === item.id}>+</button>
                                    </div>

                                    <div className="cp-item-right">
                                        <span className="cp-subtotal">${Number(item.subtotal).toFixed(2)}</span>
                                        <button className="cp-remove" onClick={() => handleRemove(item.id)} disabled={busyId === item.id}>✕ Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── SUMMARY ── */}
                        <div className="cp-summary">
                            {[{ top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }].map((s, i) => (
                                <span key={i} style={{ position: "absolute", ...s, fontSize: 12, color: "#c9a84c", opacity: 0.35 }}>✦</span>
                            ))}
                            <div className="cp-summary-title">Order Summary</div>
                            <div className="cp-summary-row">
                                <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})</span>
                                <span>${Number(cart.totalPrice).toFixed(2)}</span>
                            </div>
                            <div className="cp-summary-row">
                                <span>Shipping</span>
                                <span style={{ fontStyle: "italic", color: "rgba(201,168,76,0.5)" }}>Calculated at checkout</span>
                            </div>
                            <div className="cp-summary-row total">
                                <span>Total</span>
                                <span>${Number(cart.totalPrice).toFixed(2)}</span>
                            </div>
                            <button className="cp-checkout-btn" onClick={() => navigate("/checkout")}>
                                ⊷ &nbsp;Proceed to Checkout&nbsp; ⊶
                            </button>
                            <Link to="/books" className="cp-continue-link">Continue Browsing</Link>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}