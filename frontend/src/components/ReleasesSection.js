import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { Play, ExternalLink } from 'lucide-react';

export const ReleasesSection = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const data = await api.get('/releases?featured=true');
        console.log('Releases fetched:', data);
        const sortedReleases = data.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB - dateA; // Mais recente primeiro
        });
        setReleases(sortedReleases.slice(0, 4));
        console.log('Releases to display:', sortedReleases.slice(0, 4));
      } catch (error) {
        console.error('Error fetching releases:', error);
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
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
          Últimos <span className="text-gradient">Lançamentos</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl">
          Descubra as mais recentes músicas e álbuns de Maria Pita
        </p>
      </motion.div>

      {releases.length === 0 && !loading ? (
        <div className="text-center text-text-secondary py-8">
          Nenhum lançamento encontrado.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {releases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={release.cover_url}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        {release.spotify_url && (
                          <a
                            href={release.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <Play className="w-5 h-5" />
                          </a>
                        )}
                        {release.youtube_url && (
                          <a
                            href={release.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-white mb-2">
                      {release.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                      {release.description}
                    </p>
                    <p className="text-text-secondary text-xs font-accent">
                      {new Date(release.release_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
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
            <Button variant="secondary" to="/releases">
              Ver Todos os Lançamentos
            </Button>
          </motion.div>
        </>
      )}
    </section>
  );
};
