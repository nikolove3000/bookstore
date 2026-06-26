import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";

const STATUS_LABEL = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const PAGE_SIZE = 10;

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setLoading(true);
    orderApi.getHistory({ page, size: PAGE_SIZE })
      .then(res => {
        setOrders(res.data.content);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate, location.pathname, page]);

  const pages = [];
  if (totalPages > 0) {
    pages.push(0);
    for (let p = Math.max(1, page - 1); p <= Math.min(totalPages - 2, page + 1); p++) {
      if (!pages.includes(p)) pages.push(p);
    }
    if (totalPages > 1) pages.push(totalPages - 1);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.45)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
      </div>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <>
      <style>{`
        .oh-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .oh-breadcrumb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:2rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .oh-kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .oh-breadcrumb a{color:rgba(201,168,76,0.6);text-decoration:none;}
        .oh-breadcrumb a:hover{color:rgba(201,168,76,0.85);}
        .oh-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .oh-breadcrumb span.current{color:rgba(201,168,76,0.85);}
        .oh-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .oh-kicker{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;}
        .oh-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .oh-title em{font-style:italic;color:rgba(201,168,76,0.65);}
        .oh-count{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);}

        .oh-list{max-width:900px;margin:0 auto 2.5rem;}
        .oh-row{display:grid;grid-template-columns:64px 1fr auto auto auto;gap:1.4rem;align-items:center;padding:1.3rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);text-decoration:none;transition:background 0.2s;}
        .oh-row:hover{background:rgba(201,168,76,0.03);}
        .oh-cover{width:64px;height:94px;object-fit:cover;display:block;border:0.5px solid rgba(201,168,76,0.18);}
        .oh-fallback{width:64px;height:94px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.18);font-size:14px;color:rgba(201,168,76,0.35);}
        .oh-id{font-size:16px;color:rgba(255,245,230,0.85);margin-bottom:4px;}
        .oh-meta{font-size:13px;font-style:italic;color:rgba(201,168,76,0.55);}
        .oh-total{font-size:17px;color:#c9a84c;letter-spacing:0.5px;text-align:right;}
        .oh-date{font-size:12px;color:rgba(201,168,76,0.5);font-style:italic;text-align:right;white-space:nowrap;}

        .oh-status-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 11px;border:0.5px solid;font-style:italic;white-space:nowrap;}
        .oh-status-badge.pending{color:#c9a84c;border-color:rgba(201,168,76,0.4);}
        .oh-status-badge.confirmed,.oh-status-badge.shipped{color:#4A6B8A;border-color:rgba(74,107,138,0.4);}
        .oh-status-badge.delivered{color:#5a8a5a;border-color:rgba(90,138,90,0.4);}
        .oh-status-badge.cancelled{color:#c0392b;border-color:rgba(192,57,43,0.4);}

        .oh-pagination{display:flex;align-items:center;justify-content:center;gap:14px;}
        .oh-page-link{font-size:13px;color:rgba(201,168,76,0.5);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .oh-page-link:hover{color:#c9a84c;}
        .oh-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .oh-page-link:disabled{opacity:0.25;cursor:default;}
        .oh-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}

        .oh-empty{max-width:900px;margin:0 auto;text-align:center;padding:5rem 0;}
        .oh-empty-icon{font-size:32px;color:rgba(201,168,76,0.3);margin-bottom:1.5rem;}
        .oh-empty-text{font-size:16px;font-style:italic;color:rgba(255,245,230,0.5);margin-bottom:2rem;}
        .oh-empty-btn{background:#1a0808;border:0.5px solid #8b2020;padding:12px 30px;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block;}
        .oh-empty-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
      `}</style>

      <div className="oh-root">
        <div className="oh-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">·</span>
          <span className="current">Order History</span>
        </div>

        <div className="oh-head">
          <div>
            <div className="oh-kicker">✦ Your Reading Journey</div>
            <h1 className="oh-title">Order <em>History</em></h1>
          </div>
          {!isEmpty && <div className="oh-count">{totalElements} {totalElements === 1 ? "order" : "orders"}</div>}
        </div>

        {isEmpty ? (
          <div className="oh-empty">
            <div className="oh-empty-icon">✦</div>
            <p className="oh-empty-text">No orders yet — your story hasn't begun.</p>
            <Link to="/books" className="oh-empty-btn">⊷ &nbsp;Browse the Catalogue&nbsp; ⊶</Link>
          </div>
        ) : (
          <>
            <div className="oh-list">
              {orders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="oh-row">
                  {order.previewCoverUrl ? (
                    <img className="oh-cover" src={order.previewCoverUrl} alt="" />
                  ) : (
                    <div className="oh-fallback">✦</div>
                  )}
                  <div>
                    <div className="oh-id">Order #{order.id}</div>
                    <div className="oh-meta">{order.itemCount} {order.itemCount === 1 ? "item" : "items"} &nbsp;·&nbsp; {order.paid ? "Paid" : "Unpaid"}</div>
                  </div>
                  <span className={`oh-status-badge ${order.status.toLowerCase()}`}>
                    ✦ {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <span className="oh-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="oh-total">${Number(order.totalAmount).toFixed(2)}</span>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="oh-pagination">
                <button className="oh-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                {pages.map((p, i) => (
                  <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {i > 0 && p - pages[i - 1] > 1 && <span className="oh-page-gem">◆</span>}
                    <button className={`oh-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                  </span>
                ))}
                <button className="oh-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}