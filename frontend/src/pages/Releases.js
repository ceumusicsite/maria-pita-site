import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Play, ExternalLink } from 'lucide-react';

export default function Releases() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const data = await api.get('/releases');
        setReleases(data);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  return (
    <main className="pt-32 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
            Todos os <span className="text-gradient">Lançamentos</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Explore toda a discografia de Maria Pita
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-text-secondary py-20">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <p className="text-text-secondary text-sm mb-3">
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
        )}
      </div>
    </main>
  );
}
