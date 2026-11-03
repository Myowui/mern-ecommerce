import { createContext, useContext, useEffect, useState } from "react";

// The cart lives here so the Navbar, product pages, cart page and checkout all share it.
// Each item looks like: { product: {...}, qty: 2 }
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Start from whatever was saved in the browser, so the cart survives a page refresh.
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Every time the cart changes, save it.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product, qty = 1) {
    setItems((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        // already in the cart: just increase the quantity
        return current.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...current, { product, qty }];
    });
  }

  function changeQty(productId, qty) {
    const safeQty = Math.max(1, qty);
    setItems((current) =>
      current.map((i) => (i.product.id === productId ? { ...i, qty: safeQty } : i))
    );
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((i) => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, changeQty, removeFromCart, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
