import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
}

const CART_KEY = "edustore-cart";
const WISHLIST_KEY = "edustore-wishlist";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadFromStorage(WISHLIST_KEY, []));

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((product: { id: string; name: string; price: number; image: string; variantId?: string }) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const clearCart = useCallback(() => setItems([]), []);

  return { items, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart, wishlist, toggleWishlist };
}
