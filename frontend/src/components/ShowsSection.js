import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const ShowsSection = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await api.get('/shows');
        // Ordenar por data e pegar os próximos 3
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setShows(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  if (loading) {
    return (
      <section className="py-32 container mx-auto px-6 max-w-7xl">
        <div className="text-center text-text-secondary">Carregando...</div>
      </section>
    );
  }

  return (
    <section className="py-32 container mx-auto px-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
          Próximos <span className="text-gradient">Shows</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl">
          Venha adorar conosco em uma experiência única de fé e música
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-accent text-primary text-sm font-medium">
                    {new Date(show.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {show.time && (
                    <div className="flex items-center gap-1 mt-1 text-text-secondary text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{show.time}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {show.event_name}
              </h3>
              
              <div className="flex items-center gap-2 text-text-secondary mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{show.venue}, {show.city} - {show.state}</span>
              </div>

              <Button variant="secondary" className="w-full">
                Mais Informações
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <Button variant="secondary" as="a" href="/shows">
          Ver Todos os Shows
        </Button>
      </motion.div>
    </section>
  );
};
