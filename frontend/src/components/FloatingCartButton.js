import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';

export const FloatingCartButton = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  // Hide the cart button on the checkout page and admin pages
  const isCheckout = location.pathname === '/checkout';
  const isAdmin = location.pathname.startsWith('/admin');

  if (isCheckout || isAdmin) return null;

  return (
    <motion.button
      onClick={() => setIsCartOpen(true)}
      className="fixed top-6 right-6 z-[99] p-4 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 text-white shadow-2xl flex items-center justify-center cursor-pointer hover:border-[#FF2E8B]/50 transition-all pointer-events-auto"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 46, 139, 0.15)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Abrir carrinho de compras"
    >
      <ShoppingBag size={20} />
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF2E8B] text-white text-[10px] font-bold flex items-center justify-center"
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
