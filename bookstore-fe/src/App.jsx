import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/navbar/Navbar";
import Footer from "./component/Footer";
import HomePage from "./page/HomePage";
import AuthPage from "./page/AuthPage";
import BookListPage from "./page/BookListPage";
import BookDetailPage from "./page/BookDetailPage";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth pages — no navbar/footer */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* All other routes share Navbar + Footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/books" element={<Layout><BookListPage /></Layout>} />
          <Route path="/books/:id" element={<Layout><BookDetailPage /></Layout>} />

          {/* Placeholders — expand as features land */}
          <Route path="/category/:slug" element={<Layout><BookListPage /></Layout>} />
          <Route path="/category/:slug/:sub" element={<Layout><BookListPage /></Layout>} />
          <Route path="/cart" element={<Layout><div style={{padding:"120px 4rem",color:"#c9a84c",fontFamily:"Georgia,serif"}}>Cart — coming soon</div></Layout>} />
          <Route path="/orders" element={<Layout><div style={{padding:"120px 4rem",color:"#c9a84c",fontFamily:"Georgia,serif"}}>Orders — coming soon</div></Layout>} />
          <Route path="/profile" element={<Layout><div style={{padding:"120px 4rem",color:"#c9a84c",fontFamily:"Georgia,serif"}}>Profile — coming soon</div></Layout>} />
          <Route path="/wishlist" element={<Layout><div style={{padding:"120px 4rem",color:"#c9a84c",fontFamily:"Georgia,serif"}}>Wishlist — coming soon</div></Layout>} />
          <Route path="/about" element={<Layout><div style={{padding:"120px 4rem",color:"#c9a84c",fontFamily:"Georgia,serif"}}>About — coming soon</div></Layout>} />
          <Route path="/search" element={<Layout><BookListPage /></Layout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}