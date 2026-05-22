import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Youtube } from 'lucide-react';

export default function Releases() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageError = (e) => {
    const src = e.target.src;
    if (src.includes('maxresdefault.jpg')) {
      e.target.src = src.replace('maxresdefault.jpg', 'hqdefault.jpg');
    } else if (src.includes('hqdefault.jpg')) {
      e.target.src = src.replace('hqdefault.jpg', 'mqdefault.jpg');
    } else if (src.includes('mqdefault.jpg')) {
      e.target.src = src.replace('mqdefault.jpg', '0.jpg');
    }
  };

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
                <Card 
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-surface border border-white/5 shadow-2xl transition-all duration-500 hover:border-primary/30 aspect-video flex flex-col justify-end"
                  onClick={() => {
                    if (release.youtube_url) {
                      window.open(release.youtube_url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  {/* Widescreen Video Thumbnail */}
                  <div className="absolute inset-0 z-0 w-full h-full">
                    <img
                      src={release.cover_url}
                      alt={release.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 z-10" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15" />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="relative bg-primary/95 text-white p-5 rounded-full scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-primary/45 hover:bg-primary">
                      <Youtube className="w-8 h-8 text-white fill-white" />
                      <div className="absolute inset-0 rounded-full bg-primary/35 animate-ping z-[-1] opacity-75" />
                    </div>
                  </div>

                  {/* Text Content Overlay */}
                  <div className="relative z-30 p-6 sm:p-8 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary/95 text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Clipe Oficial
                      </span>
                      <span className="text-white/60 text-xs">
                        {new Date(release.release_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight mb-2">
                      {release.title}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm line-clamp-2 max-w-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {release.description}
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
