import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        setShows([]);
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

      {shows.length === 0 && !loading ? (
        <div className="text-center text-text-secondary py-8">
          Nenhum show agendado no momento.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:scale-[1.02] hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
              <h3 className="font-heading text-xl font-bold text-white mb-5">
                {show.event_name}
              </h3>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2.5 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary/90 uppercase tracking-wider">Data</p>
                    <p className="font-accent text-white font-medium">
                      {new Date(show.date).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {show.time && (
                      <div className="flex items-center gap-1.5 mt-1 text-text-secondary text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{show.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2.5 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary/90 uppercase tracking-wider">Localização</p>
                    <p className="text-text-secondary text-sm">
                      {show.venue && <span>{show.venue}</span>}
                      {show.venue && show.city && ' · '}
                      {show.city && <span>{show.city}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 px-2.5 py-1.5 rounded-lg shrink-0">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Estado</span>
                  </div>
                  <p className="text-white font-medium">{show.state || '—'}</p>
                </div>
              </div>

              <Button variant="secondary" className="w-full mt-6">
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
            <Link to="/shows">
              <Button variant="secondary" type="button">
                Ver Todos os Shows
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </section>
  );
};
