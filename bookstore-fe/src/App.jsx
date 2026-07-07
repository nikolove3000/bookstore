import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/navbar/Navbar";
import Footer from "./component/Footer";
import HomePage from "./page/HomePage";
import AuthPage from "./page/AuthPage";
import BookListPage from "./page/BookListPage";
import BookDetailPage from "./page/BookDetailPage";
import CartPage from "./page/CartPage";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./page/CheckoutPage";
import OrderDetailPage from "./page/OrderDetailPage";
import OrderHistoryPage from "./page/OrderHistoryPage";
import AboutPage from "./page/AboutPage";
import BlogPage from "./page/BlogPage";
import ShippingPage from "./page/ShippingPage";
import FaqPage from "./page/FaqPage";
import ContactPage from "./page/ContactPage";
import PrivacyPage from "./page/PrivacyPage";
import TermsPage from "./page/TermsPage";
import NotFoundPage from "./page/NotFoundPage";
import WishlistPage from "./page/WishlistPage";
import ProfilePage from "./page/ProfilePage";
import AdminOrderPage from "./page/AdminOrderPage";
import AdminBookPage from "./page/AdminBookPage";
import AdminUserPage from "./page/AdminUserPage";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
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
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />
            <Route path="/orders" element={<Layout><OrderHistoryPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/shipping" element={<Layout><ShippingPage /></Layout>} />
            <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
            <Route path="/search" element={<Layout><BookListPage /></Layout>} />
            <Route path="/admin/orders" element={<Layout><AdminOrderPage /></Layout>} />
            <Route path="/admin/books" element={<Layout><AdminBookPage /></Layout>} />
            <Route path="/admin/users" element={<Layout><AdminUserPage /></Layout>} />

            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
      <ScrollToTop />
    </BrowserRouter>
  );
}