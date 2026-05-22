import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ArrowRight, QrCode, ClipboardCheck } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  // Retrieve state or use localStorage as a fallback if refreshed
  useEffect(() => {
    if (location.state) {
      setOrderInfo(location.state);
      localStorage.setItem('maria_pita_last_order', JSON.stringify(location.state));
    } else {
      const saved = localStorage.getItem('maria_pita_last_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.orderId === id) {
            setOrderInfo(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [location.state, id]);

  const mockPixKey = "00020101021226830014br.gov.bcb.pix2561api.pix.tnt.com/v2/cobv/9c8e8ad82bbd483489814407c0ea1cb45204000053039865802BR5910Maria Pita6009Sao Paulo62070503***6304E85C";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!orderInfo) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <CheckCircle2 size={64} className="text-[#FF2E8B] mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold uppercase tracking-wider">Pedido Confirmado!</h2>
          <p className="text-white/60 text-sm">
            Seu pedido foi recebido com sucesso. Caso queira ver os detalhes, verifique o e-mail cadastrado ou entre em contato com nosso suporte.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-4 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Voltar para Loja</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Success Header */}
        <div className="text-center space-y-4 mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-[#FF2E8B]/10 border border-[#FF2E8B]/30 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 size={40} className="text-[#FF2E8B]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent"
          >
            Obrigado pelo seu pedido!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto"
          >
            Seu pedido <span className="font-mono text-white font-bold">#{orderInfo.orderId.substring(0, 8).toUpperCase()}</span> foi criado e está aguardando o pagamento do PIX para liberação.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* PIX Payment Card */}
          <div className="md:col-span-7 bg-[#0E0B12] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <QrCode size={20} className="text-[#FF2E8B]" /> Pagamento via PIX
            </h3>
            
            <p className="text-xs text-white/60 leading-relaxed">
              Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie a chave Pix Copia e Cola para realizar o pagamento. O pedido será processado após a confirmação.
            </p>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl max-w-[200px] mx-auto border border-white/10 shadow-lg">
              {/* Using a styled QR Code placeholder representation */}
              <div className="w-40 h-40 bg-[#0F0A18] rounded-lg flex flex-col items-center justify-center p-2">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-80">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[2px] ${
                        i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                          ? 'bg-[#FF2E8B]'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-black font-extrabold tracking-widest uppercase mt-2">PIX OFICIAL</span>
            </div>

            {/* Copy-Paste Chave PIX */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 block">Código Pix Copia e Cola</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={mockPixKey}
                  className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopyPix}
                  className="px-4 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase cursor-pointer"
                >
                  {copied ? (
                    <>
                      <ClipboardCheck size={16} />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#FF2E8B]/5 border border-[#FF2E8B]/10 rounded-xl text-xs text-white/70 space-y-1.5 leading-relaxed">
              <p className="font-bold text-[#FF2E8B] uppercase">⚠️ Importante:</p>
              <p>• O código expira em 24 horas.</p>
              <p>• Após o pagamento, o status do pedido é alterado automaticamente após a conciliação (cerca de 5 minutos).</p>
              <p>• Um comprovante foi enviado para o e-mail cadastrado.</p>
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="md:col-span-5 bg-[#0E0B12] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl self-start">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              Resumo do Pedido
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-white/40 block">Destinatário</span>
                <p className="font-semibold text-white">{orderInfo.customerName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-white/40 block">Endereço de Entrega</span>
                <p className="text-white/80 leading-relaxed">{orderInfo.address}</p>
                <p className="text-white/60">{orderInfo.cityState}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-white/40 block">Método de Envio</span>
                <p className="font-semibold text-white uppercase">{orderInfo.shippingMethod}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider">Total a Pagar</span>
                <span className="text-xl font-black text-[#FF2E8B]">{formatPrice(orderInfo.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/products')}
              className="w-full py-4 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Voltar para Loja</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
