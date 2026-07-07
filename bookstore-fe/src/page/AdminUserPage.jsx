import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import adminApi from "../api/adminApi";

const PAGE_SIZE = 20;

export default function AdminUserPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
    if (!user.role?.includes("ADMIN")) { navigate("/"); return; }
  }, [user, navigate, location.pathname]);

  const fetchUsers = () => {
    setLoading(true);
    adminApi.getUsers({ page, size: PAGE_SIZE })
      .then(res => {
        setUsers(res.data.content);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, [page]);

  const handleConfirmRoleChange = async () => {
    const { id, newRole } = confirmTarget;
    setUpdatingId(id);
    setConfirmTarget(null);
    try {
      const res = await adminApi.updateUserRole(id, newRole);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: res.data.role } : u));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update role");
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
        .aur-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .aur-inner{max-width:1100px;margin:0 auto;}
        .aur-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2rem;}
        .aur-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .aur-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .aur-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .aur-breadcrumb span.current{color:rgba(201,168,76,0.9);}

        .aur-head{margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;}
        .aur-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:7px;font-style:italic;}
        .aur-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .aur-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .aur-count{font-size:13px;font-style:italic;color:rgba(201,168,76,0.6);margin-top:6px;}

        .aur-table{width:100%;border-collapse:collapse;margin-bottom:2.5rem;}
        .aur-th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);padding:0 1rem 1rem;text-align:left;border-bottom:0.5px solid rgba(201,168,76,0.15);font-style:italic;}
        .aur-th:last-child{text-align:right;}
        .aur-tr{border-bottom:0.5px solid rgba(201,168,76,0.07);transition:background 0.15s;}
        .aur-tr:hover{background:rgba(201,168,76,0.03);}
        .aur-td{padding:1rem;font-size:14px;color:rgba(255,245,230,0.78);vertical-align:middle;}
        .aur-td.right{text-align:right;}
        .aur-td-user{font-size:15px;color:rgba(255,245,230,0.85);}
        .aur-td-email{font-size:12px;font-style:italic;color:rgba(201,168,76,0.55);margin-top:2px;}
        .aur-td-fullname{font-size:13px;font-style:italic;color:rgba(255,245,230,0.5);}
        .aur-td-date{font-size:12px;font-style:italic;color:rgba(201,168,76,0.5);}
        .aur-td-orders{font-size:14px;color:#c9a84c;}

        .aur-role-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 12px;border:0.5px solid;font-style:italic;}
        .aur-role-badge.admin{color:#c9a84c;border-color:rgba(201,168,76,0.4);}
        .aur-role-badge.user{color:rgba(255,245,230,0.5);border-color:rgba(255,245,230,0.15);}

        .aur-toggle-btn{background:none;border:0.5px solid rgba(201,168,76,0.25);padding:7px 16px;font-family:Georgia,serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.6);cursor:pointer;transition:all 0.2s;}
        .aur-toggle-btn:hover{border-color:#c9a84c;color:#c9a84c;}
        .aur-toggle-btn:disabled{opacity:0.4;cursor:default;}

        .aur-pagination{display:flex;align-items:center;justify-content:center;gap:14px;}
        .aur-page-link{font-size:13px;color:rgba(201,168,76,0.5);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:0.5px solid transparent;transition:all 0.2s;background:none;font-family:Georgia,serif;}
        .aur-page-link:hover{color:#c9a84c;}
        .aur-page-link.active{color:#c9a84c;border-color:rgba(201,168,76,0.35);}
        .aur-page-link:disabled{opacity:0.25;cursor:default;}
        .aur-page-gem{font-size:8px;color:rgba(201,168,76,0.3);}

        .aur-loading{text-align:center;padding:4rem 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.45);font-style:italic;}

        .aur-modal-overlay{position:fixed;inset:0;background:rgba(4,2,2,0.85);display:flex;align-items:center;justify-content:center;z-index:2000;animation:aurFade 0.2s ease;}
        @keyframes aurFade{from{opacity:0;}to{opacity:1;}}
        .aur-modal{position:relative;background:#0F1720;border:0.5px solid rgba(201,168,76,0.25);padding:2.5rem;max-width:380px;text-align:center;animation:aurIn 0.25s ease;}
        @keyframes aurIn{from{opacity:0;transform:translateY(10px) scale(0.98);}to{opacity:1;transform:translateY(0) scale(1);}}
        .aur-modal-icon{font-size:22px;color:#c9a84c;opacity:0.6;margin-bottom:14px;}
        .aur-modal-title{font-size:18px;font-weight:normal;color:rgba(255,245,230,0.92);letter-spacing:0.5px;margin-bottom:14px;}
        .aur-modal-text{font-size:14px;line-height:1.75;color:rgba(255,245,230,0.62);font-style:italic;margin-bottom:24px;}
        .aur-modal-actions{display:flex;align-items:center;gap:12px;}
        .aur-modal-keep{flex:1;background:none;border:0.5px solid rgba(201,168,76,0.25);padding:11px;font-family:Georgia,serif;font-size:12px;letter-spacing:1.5px;color:rgba(201,168,76,0.6);text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .aur-modal-keep:hover{border-color:rgba(201,168,76,0.5);color:#c9a84c;}
        .aur-modal-confirm{flex:1;background:#1a0808;border:0.5px solid #8b2020;padding:11px;font-family:Georgia,serif;font-size:12px;letter-spacing:1.5px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .aur-modal-confirm:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
      `}</style>

      <div className="aur-root">
        <div className="aur-inner">
          <div className="aur-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">·</span>
            <span className="current">Admin — Users</span>
          </div>

          <div className="aur-head">
            <div className="aur-kicker">✦ Admin Panel</div>
            <h1 className="aur-title">User <em>Management</em></h1>
            <div className="aur-count">{totalElements.toLocaleString()} {totalElements === 1 ? "user" : "users"}</div>
          </div>

          {loading ? (
            <div className="aur-loading">✦ &nbsp;Loading&nbsp; ✦</div>
          ) : (
            <table className="aur-table">
              <thead>
                <tr>
                  <th className="aur-th">User</th>
                  <th className="aur-th">Full Name</th>
                  <th className="aur-th">Joined</th>
                  <th className="aur-th">Orders</th>
                  <th className="aur-th">Role</th>
                  <th className="aur-th" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isAdmin = u.role?.includes("ADMIN");
                  const newRole = isAdmin ? "USER" : "ADMIN";
                  return (
                    <tr key={u.id} className="aur-tr">
                      <td className="aur-td">
                        <div className="aur-td-user">{u.username}</div>
                        <div className="aur-td-email">{u.email}</div>
                      </td>
                      <td className="aur-td"><span className="aur-td-fullname">{u.fullName || "—"}</span></td>
                      <td className="aur-td"><span className="aur-td-date">{new Date(u.createdAt).toLocaleDateString()}</span></td>
                      <td className="aur-td"><span className="aur-td-orders">{u.orderCount ?? 0}</span></td>
                      <td className="aur-td">
                        <span className={`aur-role-badge ${isAdmin ? "admin" : "user"}`}>✦ {isAdmin ? "Admin" : "Reader"}</span>
                      </td>
                      <td className="aur-td right">
                        <button
                          className="aur-toggle-btn"
                          disabled={updatingId === u.id}
                          onClick={() => setConfirmTarget({ id: u.id, username: u.username, newRole, isAdmin })}
                        >
                          {updatingId === u.id ? "Updating…" : isAdmin ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="aur-pagination">
              <button className="aur-page-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
              {pages.map((p, i) => (
                <span key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && p - pages[i - 1] > 1 && <span className="aur-page-gem">◆</span>}
                  <button className={`aur-page-link ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p + 1}</button>
                </span>
              ))}
              <button className="aur-page-link" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </div>
      </div>

      {confirmTarget && (
        <div className="aur-modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="aur-modal" onClick={e => e.stopPropagation()}>
            <div className="aur-modal-icon">✦</div>
            <h3 className="aur-modal-title">
              {confirmTarget.isAdmin ? "Revoke Admin Access?" : "Grant Admin Access?"}
            </h3>
            <p className="aur-modal-text">
              {confirmTarget.isAdmin
                ? `${confirmTarget.username} will lose access to the admin panel.`
                : `${confirmTarget.username} will gain full access to manage books, orders, and users.`}
            </p>
            <div className="aur-modal-actions">
              <button className="aur-modal-keep" onClick={() => setConfirmTarget(null)}>Cancel</button>
              <button className="aur-modal-confirm" onClick={handleConfirmRoleChange}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}