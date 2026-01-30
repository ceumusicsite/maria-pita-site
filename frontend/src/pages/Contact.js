import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    city: '',
    state: '',
    event_date: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/booking', formData);
      setSuccess(true);
      setFormData({
        name: '',
        organization: '',
        city: '',
        state: '',
        event_date: '',
        email: '',
        phone: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
            Entre em <span className="text-gradient">Contato</span>
          </h1>
          <p className="text-text-secondary text-lg mb-12">
            Solicite a presença de Maria Pita no seu evento ou entre em contato para outras informações
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-6">
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">E-mail</p>
                    <p className="text-text-secondary">contato@mariapita.com.br</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Telefone</p>
                    <p className="text-text-secondary">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Localização</p>
                    <p className="text-text-secondary">São Paulo, Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Organização/Igreja"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Cidade"
                  required
                  className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Estado"
                  required
                  className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  placeholder="Data do evento"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefone"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mensagem"
                  rows="4"
                  required
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || success}
                className="w-full"
              >
                {success ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Enviado!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Solicitação
                  </>
                )}
              </Button>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
