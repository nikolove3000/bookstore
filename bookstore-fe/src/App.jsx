import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/navbar/Navbar";
import HomePage from "./page/HomePage";
import AuthPage from "./page/AuthPage";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth page — no navbar */}
          <Route path="/auth" element={<AuthPage />} />

          {/* All other routes share Navbar */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Placeholders — expand as features land */}
          <Route path="/books" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Books — coming soon</div></Layout>} />
          <Route path="/books/:id" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Book Detail — coming soon</div></Layout>} />
          <Route path="/category/:slug" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Category — coming soon</div></Layout>} />
          <Route path="/category/:slug/:sub" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Sub-category — coming soon</div></Layout>} />
          <Route path="/cart" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Cart — coming soon</div></Layout>} />
          <Route path="/orders" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Orders — coming soon</div></Layout>} />
          <Route path="/profile" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Profile — coming soon</div></Layout>} />
          <Route path="/wishlist" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>Wishlist — coming soon</div></Layout>} />
          <Route path="/about" element={<Layout><div style={{ padding: "120px 4rem", color: "#c9a84c", fontFamily: "Georgia,serif" }}>About — coming soon</div></Layout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}