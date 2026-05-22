import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Truck, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // If cart is empty, redirect back to store
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  // Steps: 1 = Personal, 2 = Address, 3 = Shipping Method, 4 = Payment/PIX
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    cep: location.state?.cep || '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [shippingOptions, setShippingOptions] = useState(location.state?.selectedShipping ? [location.state.selectedShipping] : []);
  const [selectedShipping, setSelectedShipping] = useState(location.state?.selectedShipping || null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // ViaCEP address prefill when CEP completes
  useEffect(() => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              address: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || ''
            }));
            
            // Calculate shipping cost for this new CEP
            calculateShipping(cleanCep);
          }
        } catch (err) {
          console.error('Erro ao buscar CEP:', err);
        }
      };
      fetchAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.cep]);

  const calculateShipping = async (targetCep) => {
    setLoadingShipping(true);
    setShippingError('');
    try {
      const itemsPayload = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      const response = await api.post('/shipping/calculate', {
        cep_destino: targetCep,
        items: itemsPayload
      });
      if (response && response.options) {
        setShippingOptions(response.options);
        // Preserve selected option if available in new list, else choose first
        const match = response.options.find(o => o.method === selectedShipping?.method);
        setSelectedShipping(match || response.options[0]);
      }
    } catch (err) {
      setShippingError('Não foi possível calcular o frete para este CEP.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) return;
      setStep(2);
    } else if (step === 2) {
      if (!formData.cep || !formData.address || !formData.number || !formData.neighborhood || !formData.city || !formData.state) return;
      setStep(3);
    } else if (step === 3) {
      if (!selectedShipping) return;
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setOrderError('');
    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        cep: formData.cep,
        address: formData.address,
        number: formData.number,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        shipping_method: selectedShipping.method,
        shipping_cost: selectedShipping.cost,
        payment_method: 'pix',
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/orders', orderPayload);
      if (response && response.id) {
        // Clear local storage and cart context
        clearCart();
        // Redirect to success page
        navigate(`/order-success/${response.id}`, {
          state: {
            orderId: response.id,
            totalAmount: response.total_amount,
            customerName: formData.customer_name,
            address: `${formData.address}, ${formData.number}`,
            cityState: `${formData.city} - ${formData.state}`,
            shippingMethod: selectedShipping.method
          }
        });
      }
    } catch (err) {
      setOrderError(err.message || 'Erro ao processar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const cartTotal = cartSubtotal + (selectedShipping ? selectedShipping.cost : 0);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Back Button */}
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else navigate('/products');
          }}
          className="mb-8 flex items-center gap-2 text-sm text-white/60 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar {step > 1 ? `para etapa ${step - 1}` : 'para Loja'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Area */}
          <div className="lg:col-span-7 bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            
            {/* Steps indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              {[
                { number: 1, label: 'Identificação', icon: User },
                { number: 2, label: 'Entrega', icon: MapPin },
                { number: 3, label: 'Frete', icon: Truck },
              ].map((s) => {
                const isCompleted = step > s.number;
                const isActive = step === s.number;
                return (
                  <div key={s.number} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted
                          ? 'bg-[#FF2E8B] text-white'
                          : isActive
                          ? 'border border-[#FF2E8B] text-[#FF2E8B]'
                          : 'border border-white/20 text-white/40'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : s.number}
                    </div>
                    <span className={`text-xs uppercase tracking-wider font-semibold hidden md:inline ${isActive ? 'text-white' : 'text-white/40'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {orderError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <AlertCircle size={18} />
                <span>{orderError}</span>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">Dados de Identificação</h3>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-white/50">Nome Completo</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">E-mail</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Celular / WhatsApp</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 mt-4 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300"
                >
                  Continuar para Entrega
                </button>
              </form>
            )}

            {/* Step 2: Address Info */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">Endereço de Entrega</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Rua / Avenida</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="Nome do logradouro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Número</label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="123"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Complemento (Opcional)</label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="Apto, Bloco..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Bairro</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="Bairro"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors"
                      placeholder="Cidade"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-white/50">Estado (UF)</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      maxLength={2}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors uppercase"
                      placeholder="SP"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-4 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300"
                >
                  Continuar para Escolha de Frete
                </button>
              </form>
            )}

            {/* Step 3: Shipping & Payment Method */}
            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white">Opção de Entrega</h3>
                  {loadingShipping && (
                    <p className="text-sm text-white/60">Buscando tarifas e prazos...</p>
                  )}
                  {shippingError && (
                    <p className="text-sm text-red-400">{shippingError}</p>
                  )}
                  {!loadingShipping && shippingOptions.length > 0 && (
                    <div className="space-y-3">
                      {shippingOptions.map((opt) => (
                        <div
                          key={opt.method}
                          onClick={() => setSelectedShipping(opt)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedShipping?.method === opt.method
                              ? 'border-[#FF2E8B] bg-[#FF2E8B]/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping_method"
                              checked={selectedShipping?.method === opt.method}
                              onChange={() => setSelectedShipping(opt)}
                              className="accent-[#FF2E8B]"
                            />
                            <div>
                              <p className="font-bold text-white text-sm uppercase">{opt.method}</p>
                              <p className="text-xs text-white/60">Entrega estimada: {opt.delivery_time}</p>
                            </div>
                          </div>
                          <span className="font-bold text-[#FF2E8B]">{formatPrice(opt.cost)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-[#FF2E8B]" /> Forma de Pagamento
                  </h3>
                  <div className="p-4 rounded-xl border border-[#FF2E8B] bg-[#FF2E8B]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#FF2E8B] text-lg">PIX</span>
                      <p className="text-xs text-white/60">Liberação imediata do pedido</p>
                    </div>
                    <CheckCircle2 className="text-[#FF2E8B]" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedShipping}
                  className="w-full py-4 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      <span>Finalizar Pedido por {formatPrice(cartTotal)}</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-5 bg-[#0E0B12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white pb-3 border-b border-white/10">
              Resumo do Pedido
            </h3>
            
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-black flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-white/40">Quantidade: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>
              {selectedShipping && (
                <div className="flex justify-between">
                  <span className="text-white/60">Frete ({selectedShipping.method})</span>
                  <span className="font-semibold">{formatPrice(selectedShipping.cost)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-white/5 text-base font-bold uppercase tracking-wider">
                <span>Total</span>
                <span className="text-lg text-[#FF2E8B]">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
