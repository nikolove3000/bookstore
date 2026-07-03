import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../api/userApi";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", address: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    profileApi.getMe()
      .then(res => {
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName ?? "",
          email: res.data.email ?? "",
          address: res.data.address ?? "",
          phone: res.data.phone ?? "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate, location.pathname]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileApi.updateMe(form);
      setProfile(res.data);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(null);
    setChangingPw(true);
    try {
      await profileApi.changePassword(pwForm);
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Could not change password");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.45)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <style>{`
        .pr-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 5rem;}
        .pr-inner{max-width:820px;margin:0 auto;}
        .pr-breadcrumb{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:2rem;}
        .pr-breadcrumb a{color:rgba(201,168,76,0.65);text-decoration:none;}
        .pr-breadcrumb a:hover{color:rgba(201,168,76,0.9);}
        .pr-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .pr-breadcrumb span.current{color:rgba(201,168,76,0.9);}

        .pr-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;border-bottom:0.5px solid rgba(201,168,76,0.12);padding-bottom:1.2rem;}
        .pr-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);margin-bottom:7px;font-style:italic;}
        .pr-title{font-size:32px;font-weight:normal;letter-spacing:0.5px;}
        .pr-title em{font-style:italic;color:rgba(201,168,76,0.7);}
        .pr-role{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);font-style:italic;}

        .pr-block{background:#0F1720;border:0.5px solid rgba(201,168,76,0.16);padding:2rem;margin-bottom:2rem;position:relative;}
        .pr-block-title{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.65);margin-bottom:1.5rem;display:flex;align-items:center;gap:8px;}
        .pr-block-title-line{flex:1;height:0.5px;background:rgba(201,168,76,0.12);}

        .pr-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem 2rem;}
        .pr-info-item{display:flex;flex-direction:column;gap:4px;}
        .pr-info-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);font-style:italic;}
        .pr-info-value{font-size:15px;color:rgba(255,245,230,0.82);}
        .pr-info-value.muted{color:rgba(255,245,230,0.45);font-style:italic;}
        .pr-since{font-size:12px;font-style:italic;color:rgba(201,168,76,0.45);margin-top:1rem;}

        .pr-edit-btn{background:none;border:0.5px solid rgba(201,168,76,0.3);padding:7px 18px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.65);cursor:pointer;transition:all 0.25s;}
        .pr-edit-btn:hover{border-color:#c9a84c;color:#c9a84c;}

        .pr-field{margin-bottom:1.2rem;}
        .pr-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:7px;font-style:italic;display:block;}
        .pr-input{width:100%;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:11px 14px;font-family:Georgia,serif;font-size:14px;color:rgba(255,245,230,0.85);outline:none;}
        .pr-input:focus{border-color:rgba(201,168,76,0.45);}
        .pr-input-note{font-size:11px;font-style:italic;color:rgba(201,168,76,0.38);margin-top:5px;}

        .pr-form-actions{display:flex;gap:12px;margin-top:1.5rem;}
        .pr-save-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 26px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .pr-save-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .pr-save-btn:disabled{opacity:0.4;cursor:default;}
        .pr-cancel-btn{background:none;border:0.5px solid rgba(201,168,76,0.22);padding:11px 22px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;color:rgba(201,168,76,0.55);text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .pr-cancel-btn:hover{border-color:rgba(201,168,76,0.45);color:#c9a84c;}

        .pr-success{font-size:13px;color:rgba(201,168,76,0.8);font-style:italic;margin-top:10px;}
        .pr-error{font-size:13px;color:#c0392b;font-style:italic;margin-top:10px;}

        .pr-pw-input{width:100%;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:11px 14px;font-family:Georgia,serif;font-size:14px;color:rgba(255,245,230,0.85);outline:none;margin-bottom:1.2rem;}
        .pr-pw-input:focus{border-color:rgba(201,168,76,0.45);}
      `}</style>

      <div className="pr-root">
        <div className="pr-inner">
          <div className="pr-breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">·</span>
            <span className="current">Profile</span>
          </div>

          <div className="pr-head">
            <div>
              <div className="pr-kicker">✦ Your Account</div>
              <h1 className="pr-title">My <em>Profile</em></h1>
            </div>
            <div className="pr-role">{profile.role?.replace("ROLE_", "") ?? "Reader"}</div>
          </div>

          {/* ── PROFILE INFO ── */}
          <div className="pr-block">
            {[{ top: 14, left: 16 }, { top: 14, right: 16 }, { bottom: 14, left: 16 }, { bottom: 14, right: 16 }].map((s, i) => (
              <span key={i} style={{ position: "absolute", ...s, fontSize: 12, color: "#c9a84c", opacity: 0.32 }}>✦</span>
            ))}
            <div className="pr-block-title" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Profile Details
                <div className="pr-block-title-line" />
              </div>
              {!editMode && (
                <button className="pr-edit-btn" onClick={() => setEditMode(true)}>Edit</button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSaveProfile}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
                  <div className="pr-field">
                    <label className="pr-label">Full Name</label>
                    <input className="pr-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Email</label>
                    <input className="pr-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Phone</label>
                    <input className="pr-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="pr-field" style={{ gridColumn: "1 / -1" }}>
                    <label className="pr-label">Address</label>
                    <input className="pr-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                </div>
                <p className="pr-input-note">Username cannot be changed.</p>
                <div className="pr-form-actions">
                  <button type="submit" className="pr-save-btn" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
                  <button type="button" className="pr-cancel-btn" onClick={() => { setEditMode(false); setForm({ fullName: profile.fullName ?? "", email: profile.email ?? "", address: profile.address ?? "", phone: profile.phone ?? "" }); }}>Cancel</button>
                </div>
                {saveSuccess && <p className="pr-success">✦ Profile updated successfully</p>}
              </form>
            ) : (
              <>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <span className="pr-info-label">Username</span>
                    <span className="pr-info-value">{profile.username}</span>
                  </div>
                  <div className="pr-info-item">
                    <span className="pr-info-label">Email</span>
                    <span className="pr-info-value">{profile.email}</span>
                  </div>
                  <div className="pr-info-item">
                    <span className="pr-info-label">Full Name</span>
                    <span className={`pr-info-value ${!profile.fullName ? "muted" : ""}`}>{profile.fullName || "Not set"}</span>
                  </div>
                  <div className="pr-info-item">
                    <span className="pr-info-label">Phone</span>
                    <span className={`pr-info-value ${!profile.phone ? "muted" : ""}`}>{profile.phone || "Not set"}</span>
                  </div>
                  <div className="pr-info-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="pr-info-label">Address</span>
                    <span className={`pr-info-value ${!profile.address ? "muted" : ""}`}>{profile.address || "Not set"}</span>
                  </div>
                </div>
                <p className="pr-since">Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}</p>
              </>
            )}
          </div>

          {/* ── CHANGE PASSWORD ── */}
          <div className="pr-block">
            <div className="pr-block-title">Change Password<div className="pr-block-title-line" /></div>
            <form onSubmit={handleChangePassword}>
              <label className="pr-label">Current Password</label>
              <input className="pr-pw-input" type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
              <label className="pr-label">New Password</label>
              <input className="pr-pw-input" type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={8} />
              <p className="pr-input-note">Minimum 8 characters.</p>
              <div className="pr-form-actions" style={{ marginTop: "1rem" }}>
                <button type="submit" className="pr-save-btn" disabled={changingPw}>{changingPw ? "Updating…" : "Update Password"}</button>
              </div>
              {pwSuccess && <p className="pr-success">✦ Password changed successfully</p>}
              {pwError && <p className="pr-error">{pwError}</p>}
            </form>
          </div>

          {/* ── QUICK LINKS ── */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "My Orders", to: "/orders" },
              { label: "My Wishlist", to: "/wishlist" },
            ].map(({ label, to }) => (
              <Link key={label} to={to} style={{
                background: "none", border: "0.5px solid rgba(201,168,76,0.22)", padding: "9px 20px",
                fontFamily: "Georgia,serif", fontSize: 12, letterSpacing: "2px", color: "rgba(201,168,76,0.6)",
                textTransform: "uppercase", textDecoration: "none", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.color = "#c9a84c"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.22)"; e.currentTarget.style.color = "rgba(201,168,76,0.6)"; }}
              >
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}