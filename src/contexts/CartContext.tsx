import React, { createContext, useContext } from "react";
import { useCart } from "@/hooks/useCart";

type CartContextType = ReturnType<typeof useCart>;
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be inside CartProvider");
  return ctx;
};
