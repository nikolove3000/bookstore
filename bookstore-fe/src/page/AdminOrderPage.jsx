import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import adminApi from "../api/adminApi";

const STATUS_LIST = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_LABEL = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const NEXT_STATUS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const PAGE_SIZE = 20;

function StatusBadge({ status }) {
  const colorMap = {
    PENDING: { color: "#c9a84c", border: "rgba(201,168,76,0.4)" },
    CONFIRMED: { color: "#4A6B8A", border: "rgba(74,107,138,0.4)" },
    SHIPPED: { color: "#4A6B8A", border: "rgba(74,107,138,0.4)" },
    DELIVERED: { color: "#5a8a5a", border: "rgba(90,138,90,0.4)" },
    CANCELLED: { color: "#c0392b", border: "rgba(192,57,43,0.4)" },
  };
  const c = colorMap[status] ?? { color: "rgba(201,168,76,0.6)", border: "rgba(201,168,76,0.3)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase",
      padding: "4px 11px", border: `0.5px solid ${c.border}`,
      color: c.color, fontStyle: "italic", fontFamily: "Georgia,serif",
      whiteSpace: "nowrap",
    }}>✦ {STATUS_LABEL[status] ?? status}</span>
  );
}

export default function AdminOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMenuId, setStatusMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
    if (!user.role?.includes("ADMIN")) { navigate("/"); return; }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    setLoading(true);
    adminApi.getOrders({
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page, size: PAGE_SIZE,
    })
      .then(res => {
        setOrders(res.data.content);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => { setPage(0); }, [statusFilter]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setStatusMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setStatusMenuId(null);
    try {
      await adminApi.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const pages = [];
  if (totalPages > 0) {
    pages.push(0);
    for (let p = Math.max(1, page - 1); p <= Math.min(totalPages - 2, page + 1); p++) {
      if (!pages.includes(p)) pages.push(p);
    }
    if (totalPages > 1) pages.push(totalPages - 1);
  }

  return (
    <>
      <style>{`
        .ao-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .ao-inner{max-width:1200px;margin:0 auto;}
        .ao-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2rem;}
        .ao-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .ao-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .ao-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .ao-breadcrumb span.current{color:rgba(201,168,76,0.9);}

        .ao-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;}
        .ao-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:7px;font-style:italic;}
        .ao-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .ao-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .ao-count{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);}

        .ao-filters{display:flex;gap:8px;margin-bottom:2rem;flex-wrap:wrap;}
        .ao-filter-btn{background:none;border:0.5px solid rgba(201,168,76,0.2);padding:6px 16px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);cursor:pointer;transition:all 0.2s;}
        .ao-filter-btn:hover{border-color:rgba(201,168,76,0.45);color:rgba(201,168,76,0.85);}
        .ao-filter-btn.active{border-color:#c9a84c;color:#c9a84c;background:rgba(201,168,76,0.06);}

        .ao-table{width:100%;border-collapse:collapse;margin-bottom:2.5rem;}
        .ao-th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);padding:0 1rem 1rem;text-align:left;border-bottom:0.5px solid rgba(201,168,76,0.15);font-style:italic;}
        .ao-th:last-child{text-align:right;}
        .ao-tr{border-bottom:0.5px solid rgba(201,168,76,0.07);cursor:pointer;transition:background 0.15s;}
        .ao-tr:hover{background:rgba(201,168,76,0.03);}
        .ao-td{padding:1.1rem 1rem;font-size:14px;color:rgba(255,245,230,0.78);vertical-align:middle;}
        .ao-td.right{text-align:right;}
        .ao-td-id{font-size:13px;color:rgba(201,168,76,0.65);letter-spacing:1px;}
        .ao-td-user{font-size:14px;color:rgba(255,245,230,0.85);}
        .ao-td-email{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);margin-top:2px;}
        .ao-td-total{font-size:15px;color:#c9a84c;letter-spacing:0.5px;}
        .ao-td-date{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);}

        .ao-status-wrap{position:relative;display:inline-block;}
        .ao-status-menu{position:absolute;right:0;top:calc(100% + 6px);background:#0F1720;border:0.5px solid rgba(201,168,76,0.22);min-width:150px;z-index:20;}
        .ao-status-opt{padding:9px 14px;font-size:12px;color:rgba(255,245,230,0.68);cursor:pointer;transition:color 0.15s,background 0.15s;font-family:Georgia,serif;display:block;width:100%;text-align:left;background:none;border:none;}
        .ao-status-opt:hover{color:#c9a84c;background:rgba(201,168,76,0.06);}

        .ao-expand{background:#0F1720;border-bottom:0.5px solid rgba(201,168,76,0.12);}
        .ao-expand-inner{padding:1.4rem 1rem 1.4rem 3rem;}
        .ao-expand-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:1rem;font-style:italic;}
        .ao-expand-item{display:flex;align-items:center;gap:1rem;padding:0.6rem 0;border-bottom:0.5px solid rgba(201,168,76,0.06);}
        .ao-expand-item:last-child{border-bottom:none;}
        .ao-expand-cover{width:40px;height:58px;object-fit:cover;border:0.5px solid rgba(201,168,76,0.18);}
        .ao-expand-fallback{width:40px;height:58px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#14171c,#0c0a0a);border:0.5px solid rgba(201,168,76,0.18);font-size:12px;color:rgba(201,168,76,0.35);}
        .ao-expand-item-title{font-size:14px;color:rgba(255,245,230,0.82);}
        .ao-expand-item-meta{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);}
        .ao-expand-item-sub{font-size:14px;color:#c9a84c;margin-left:auto;flex-shrink:0;}
        .ao-expand-addr{font-size:13px;font-style:italic;color:rgba(255,245,230,0.55);margin-top:1rem;line-height:1.6;}

        .ao-pagination{display:flex;align-items:center;justify-content:center;gap:14px;}
        .ao-page-link{font-size:13px;color:rgba(201,168,76,0.5);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .ao-page-link:hover{color:#c9a84c;}
        .ao-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .ao-page-link:disabled{opacity:0.25;cursor:default;}
        .ao-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}

        .ao-loading{text-align:center;padding:4rem 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);font-style:italic;}
        .ao-empty{text-align:center;padding:4rem 0;font-size:15px;font-style:italic;color:rgba(255,245,230,0.42);}
      `}</style>

      <div className="ao-root">
        <div className="ao-inner">
          <div className="ao-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">·</span>
            <span className="current">Admin — Orders</span>
          </div>

          <div className="ao-head">
            <div>
              <div className="ao-kicker">✦ Admin Panel</div>
              <h1 className="ao-title">Order <em>Management</em></h1>
            </div>
            <div className="ao-count">{totalElements.toLocaleString()} {totalElements === 1 ? "order" : "orders"}</div>
          </div>

          {/* STATUS FILTERS */}
          <div className="ao-filters">
            {STATUS_LIST.map(s => (
              <button
                key={s}
                className={`ao-filter-btn ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === "ALL" ? "All" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="ao-loading">✦ &nbsp;Loading&nbsp; ✦</div>
          ) : orders.length === 0 ? (
            <div className="ao-empty">No orders found.</div>
          ) : (
            <table className="ao-table">
              <thead>
                <tr>
                  <th className="ao-th">Order</th>
                  <th className="ao-th">Customer</th>
                  <th className="ao-th">Items</th>
                  <th className="ao-th">Total</th>
                  <th className="ao-th">Date</th>
                  <th className="ao-th">Status</th>
                  <th className="ao-th" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <>
                    <tr
                      key={order.id}
                      className="ao-tr"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="ao-td"><span className="ao-td-id">#{order.id}</span></td>
                      <td className="ao-td">
                        <div className="ao-td-user">{order.username}</div>
                        <div className="ao-td-email">{order.email}</div>
                      </td>
                      <td className="ao-td">{order.itemCount}</td>
                      <td className="ao-td"><span className="ao-td-total">${Number(order.totalAmount).toFixed(2)}</span></td>
                      <td className="ao-td"><span className="ao-td-date">{new Date(order.createdAt).toLocaleDateString()}</span></td>
                      <td className="ao-td"><StatusBadge status={order.status} /></td>
                      <td className="ao-td right" onClick={e => e.stopPropagation()}>
                        {NEXT_STATUS[order.status]?.length > 0 && (
                          <div className="ao-status-wrap" ref={statusMenuId === order.id ? menuRef : null}>
                            <button
                              className="ao-filter-btn"
                              style={{ fontSize: 10 }}
                              disabled={updatingId === order.id}
                              onClick={() => setStatusMenuId(statusMenuId === order.id ? null : order.id)}
                            >
                              {updatingId === order.id ? "Updating…" : "Update ▾"}
                            </button>
                            {statusMenuId === order.id && (
                              <div className="ao-status-menu">
                                {NEXT_STATUS[order.status].map(s => (
                                  <button key={s} className="ao-status-opt" onClick={() => handleUpdateStatus(order.id, s)}>
                                    → {STATUS_LABEL[s]}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>

                    {expandedId === order.id && (
                      <tr key={`${order.id}-expand`}>
                        <td colSpan={7} className="ao-expand">
                          <div className="ao-expand-inner">
                            <div className="ao-expand-title">✦ Order Items</div>
                            {order.items?.map((item, i) => (
                              <div key={i} className="ao-expand-item">
                                {item.coverUrl ? (
                                  <img className="ao-expand-cover" src={item.coverUrl} alt={item.title} />
                                ) : (
                                  <div className="ao-expand-fallback">✦</div>
                                )}
                                <div>
                                  <div className="ao-expand-item-title">{item.title}</div>
                                  <div className="ao-expand-item-meta">Qty {item.quantity} · ${Number(item.unitPrice).toFixed(2)} each</div>
                                </div>
                                <span className="ao-expand-item-sub">${Number(item.subtotal).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="ao-expand-addr">✦ &nbsp;{order.shippingAddress}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="ao-pagination">
              <button className="ao-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
              {pages.map((p, i) => (
                <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && p - pages[i - 1] > 1 && <span className="ao-page-gem">◆</span>}
                  <button className={`ao-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                </span>
              ))}
              <button className="ao-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}