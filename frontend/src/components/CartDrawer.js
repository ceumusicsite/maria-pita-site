import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Truck, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount
  } = useCart();

  const navigate = useNavigate();

  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCalculateShipping = async (e) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length !== 8) {
      setShippingError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setLoadingShipping(true);
    setShippingError('');
    setShippingOptions([]);

    try {
      const itemsPayload = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const response = await api.post('/shipping/calculate', {
        cep_destino: cep,
        items: itemsPayload
      });

      if (response && response.options) {
        setShippingOptions(response.options);
        // Default select PAC
        setSelectedShipping(response.options[0]);
      } else {
        setShippingError('Não foi possível calcular o frete.');
      }
    } catch (err) {
      setShippingError(err.message || 'Erro ao calcular o frete.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout', {
      state: {
        selectedShipping,
        cep
      }
    });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[101] w-full max-w-md h-full bg-[#0E0B12]/95 border-l border-white/10 backdrop-blur-xl flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#FF2E8B]" size={22} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">Seu Carrinho</h2>
                <span className="bg-[#FF2E8B] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Carrinho Vazio</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Adicione produtos da loja para vê-los aqui.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/products');
                    }}
                    className="px-6 py-2 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-full font-bold text-sm tracking-wider uppercase transition-colors duration-300"
                  >
                    Ver Loja
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-black"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-white/40 mt-0.5">{item.category}</p>
                          <p className="font-bold text-[#FF2E8B] text-sm mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-white/10 rounded-full overflow-hidden bg-black/40">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 px-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-white px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 px-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-white/40 hover:text-red-500 rounded-full hover:bg-white/5 transition-all"
                            title="Remover item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping Estimator */}
              {cartItems.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <Truck size={16} className="text-[#FF2E8B]" /> Calcular Frete
                  </h3>
                  <form onSubmit={handleCalculateShipping} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                    />
                    <button
                      type="submit"
                      disabled={loadingShipping}
                      className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {loadingShipping ? 'Calculando...' : 'Calcular'}
                    </button>
                  </form>
                  {shippingError && (
                    <p className="text-xs text-red-500 mt-2">{shippingError}</p>
                  )}
                  {shippingOptions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {shippingOptions.map((opt) => (
                        <div
                          key={opt.method}
                          onClick={() => setSelectedShipping(opt)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedShipping?.method === opt.method
                              ? 'border-[#FF2E8B] bg-[#FF2E8B]/10'
                              : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping_opt"
                              checked={selectedShipping?.method === opt.method}
                              onChange={() => setSelectedShipping(opt)}
                              className="accent-[#FF2E8B]"
                            />
                            <div>
                              <p className="text-sm font-bold text-white">{opt.method}</p>
                              <p className="text-xs text-white/60">Prazo: {opt.delivery_time}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#FF2E8B]">{formatPrice(opt.cost)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white font-semibold">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {selectedShipping && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Frete ({selectedShipping.method})</span>
                      <span className="text-white font-semibold">{formatPrice(selectedShipping.cost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-2 border-t border-white/5">
                    <span className="text-white font-bold uppercase tracking-wider">Total</span>
                    <span className="text-lg font-bold text-[#FF2E8B]">
                      {formatPrice(cartSubtotal + (selectedShipping ? selectedShipping.cost : 0))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-full font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#FF2E8B]/20 flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Finalizar Compra</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
                  <Lock size={10} />
                  <span>Ambiente 100% Seguro</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
