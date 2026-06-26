import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";

const STATUS_LABEL = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setLoading(true);
    orderApi.getById(id)
      .then(res => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user, navigate, location.pathname]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    setCancelling(true);
    try {
      const res = await orderApi.cancel(id);
      setOrder(res.data);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message || "This order can no longer be cancelled");
      } else {
        alert(err.response?.data?.message || "Could not cancel order");
      }
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.45)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = order.status === "PENDING";

  return (
    <>
      <style>{`
        .od-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .od-breadcrumb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:2rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .od-breadcrumb a{color:rgba(201,168,76,0.6);text-decoration:none;}
        .od-breadcrumb a:hover{color:rgba(201,168,76,0.85);}
        .od-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .od-breadcrumb span.current{color:rgba(201,168,76,0.85);}

        .od-confirm-banner{max-width:900px;margin:0 auto 2rem;text-align:center;border:0.5px solid rgba(201,168,76,0.3);background:rgba(201,168,76,0.05);padding:1.2rem;}
        .od-confirm-banner-text{font-size:15px;color:#c9a84c;letter-spacing:0.5px;font-style:italic;}

        .od-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .od-kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .od-title{font-size:28px;font-weight:normal;letter-spacing:0.5px;}
        .od-date{font-size:12px;font-style:italic;color:rgba(201,168,76,0.55);}

        .od-status-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border:0.5px solid;font-style:italic;}
        .od-status-badge.pending{color:#c9a84c;border-color:rgba(201,168,76,0.4);}
        .od-status-badge.confirmed,.od-status-badge.shipped{color:#4A6B8A;border-color:rgba(74,107,138,0.4);}
        .od-status-badge.delivered{color:#5a8a5a;border-color:rgba(90,138,90,0.4);}
        .od-status-badge.cancelled{color:#c0392b;border-color:rgba(192,57,43,0.4);}

        .od-layout{display:grid;grid-template-columns:1fr 300px;gap:2.5rem;max-width:900px;margin:0 auto;align-items:start;}

        .od-block-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:1.2rem;display:flex;align-items:center;gap:8px;}
        .od-block-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}

        .od-item{display:grid;grid-template-columns:64px 1fr auto;gap:1.2rem;align-items:center;padding:1rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);}
        .od-item:last-child{border-bottom:none;}
        .od-item-cover{width:64px;height:94px;object-fit:cover;display:block;border:0.5px solid rgba(201,168,76,0.18);}
        .od-item-fallback{width:64px;height:94px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.18);font-size:12px;color:rgba(201,168,76,0.35);}
        .od-item-title{font-size:16px;color:rgba(255,245,230,0.85);line-height:1.3;margin-bottom:4px;}
        .od-item-meta{font-size:13px;font-style:italic;color:rgba(201,168,76,0.55);}
        .od-item-subtotal{font-size:16px;color:#c9a84c;letter-spacing:0.5px;}

        .od-summary{background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:1.8rem;position:relative;}
        .od-summary-row{display:flex;align-items:center;justify-content:space-between;font-size:14px;color:rgba(255,245,230,0.65);padding:7px 0;}
        .od-summary-row.total{border-top:0.5px solid rgba(201,168,76,0.18);margin-top:6px;padding-top:14px;font-size:17px;color:rgba(255,245,230,0.92);}
        .od-summary-row.total span:last-child{color:#c9a84c;letter-spacing:0.5px;}
        .od-address{font-size:14px;font-style:italic;color:rgba(255,245,230,0.65);line-height:1.7;margin-top:8px;}

        .od-cancel-btn{width:100%;background:#1a0808;border:0.5px solid #8b2020;padding:11px;font-family:Georgia,serif;font-size:11px;letter-spacing:2.5px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:1.5rem;}
        .od-cancel-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .od-cancel-btn:disabled{opacity:0.4;cursor:default;}

        .od-back-link{display:block;text-align:center;margin-top:1.2rem;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);text-decoration:none;border-bottom:0.5px solid rgba(201,168,76,0.15);padding-bottom:2px;}
        .od-back-link:hover{color:rgba(201,168,76,0.8);}
      `}</style>

      <div className="od-root">
        <div className="od-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">·</span>
          <Link to="/orders">Orders</Link>
          <span className="sep">·</span>
          <span className="current">#{order.id}</span>
        </div>

        {justPlaced && (
          <div className="od-confirm-banner">
            <div className="od-confirm-banner-text">✦ Your order has been placed successfully ✦</div>
          </div>
        )}

        <div className="od-head">
          <div>
            <div className="od-kicker">✦ Order Detail</div>
            <h1 className="od-title">Order #{order.id}</h1>
            <div className="od-date" style={{ marginTop: 6 }}>
              {order.createdAt && new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <span className={`od-status-badge ${order.status.toLowerCase()}`}>
            ✦ {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>

        <div className="od-layout">

          <div>
            <div className="od-block-title">Items ({order.items.length})<div className="od-block-title-line" /></div>
            {order.items.map((item, i) => (
              <div key={i} className="od-item">
                {item.coverUrl ? (
                  <img className="od-item-cover" src={item.coverUrl} alt={item.title} />
                ) : (
                  <div className="od-item-fallback">✦</div>
                )}
                <div>
                  <Link to={`/books/${item.bookId}`} style={{ textDecoration: "none" }}>
                    <div className="od-item-title">{item.title}</div>
                  </Link>
                  <div className="od-item-meta">Qty {item.quantity} &nbsp;·&nbsp; ${Number(item.unitPrice).toFixed(2)} each</div>
                </div>
                <span className="od-item-subtotal">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="od-summary">
            {[{ top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }].map((s, i) => (
              <span key={i} style={{ position: "absolute", ...s, fontSize: 11, color: "#c9a84c", opacity: 0.35 }}>✦</span>
            ))}
            <div className="od-summary-row total">
              <span>Total</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="od-summary-row">
              <span>Payment</span>
              <span style={{ fontStyle: "italic", color: "rgba(201,168,76,0.5)" }}>{order.paid ? "Paid" : "Unpaid"}</span>
            </div>

            <div className="od-block-title" style={{ marginTop: 18 }}>Shipping Address<div className="od-block-title-line" /></div>
            <div className="od-address">{order.shippingAddress}</div>

            {canCancel && (
              <button className="od-cancel-btn" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Cancelling…" : "✕ Cancel Order"}
              </button>
            )}

            <Link to="/orders" className="od-back-link">Back to Order History</Link>
          </div>

        </div>
      </div>
    </>
  );
}