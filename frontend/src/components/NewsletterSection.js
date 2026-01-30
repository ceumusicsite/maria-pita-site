import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { Mail, Check } from 'lucide-react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/newsletter', { email });
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Erro ao se inscrever. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 container mx-auto px-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-block bg-primary/20 p-4 rounded-full mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
          Fique por <span className="text-gradient">Dentro</span>
        </h2>
        <p className="text-text-secondary text-lg mb-8">
          Receba novidades, lançamentos e informações sobre shows exclusivos
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            className="flex-1 bg-surface border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || success}
            className="px-8"
          >
            {success ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Inscrito!
              </>
            ) : (
              'Inscrever-se'
            )}
          </Button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-primary text-sm"
          >
            Inscrição realizada com sucesso!
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};
