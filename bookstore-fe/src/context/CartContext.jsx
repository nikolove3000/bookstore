import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import cartApi from "../api/cartApi";

const CartContext = createContext(null);

const EMPTY_CART = { id: null, items: [], totalItems: 0, totalPrice: 0 };

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(() => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }
    setLoading(true);
    cartApi.getCart()
      .then(res => setCart(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  /**
   * Adds a book to cart. Bumps the visible count immediately (optimistic) so
   * the Navbar badge reacts on every click, then reconciles with the real
   * server response. Rolls back the optimistic bump if the request fails
   * (e.g. insufficient stock) — caller still receives the thrown error.
   */
  const addItem = async (bookId, quantity = 1) => {
    const snapshot = cart;
    setCart(prev => ({ ...prev, totalItems: prev.totalItems + quantity }));
    try {
      const res = await cartApi.addItem(bookId, quantity);
      setCart(res.data);
      return res.data;
    } catch (err) {
      setCart(snapshot);
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartApi.updateQuantity(itemId, quantity);
    setCart(res.data);
    return res.data;
  };

  const removeItem = async (itemId) => {
    const res = await cartApi.removeItem(itemId);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setCart(EMPTY_CART);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateQuantity, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);