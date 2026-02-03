import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { api } from '@/lib/api';
import { Clock, ExternalLink, ArrowRight, Newspaper, Music, Radio } from 'lucide-react';

export const FiquePorDentroSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      // Fallback com dados mockados caso a API falhe
      setNews([
        {
          id: 1,
          title: 'Novo Single em Breve',
          excerpt: 'Prepare-se para o novo single que está chegando! Uma explosão de energia e emoção.',
          category: 'Lançamento',
          date: new Date().toISOString(),
          image: '/images/news-1.jpg',
          icon: 'music'
        },
        {
          id: 2,
          title: 'Entrevista Exclusiva',
          excerpt: 'Confira a entrevista completa onde Maria Pita fala sobre o processo criativo do novo álbum.',
          category: 'Mídia',
          date: new Date(Date.now() - 86400000).toISOString(),
          image: '/images/news-2.jpg',
          icon: 'radio'
        },
        {
          id: 3,
          title: 'Bastidores da Turnê',
          excerpt: 'Veja fotos e vídeos exclusivos dos bastidores da última apresentação.',
          category: 'Bastidores',
          date: new Date(Date.now() - 172800000).toISOString(),
          image: '/images/news-3.jpg',
          icon: 'newspaper'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'music':
        return <Music className="w-5 h-5" />;
      case 'radio':
        return <Radio className="w-5 h-5" />;
      case 'newspaper':
        return <Newspaper className="w-5 h-5" />;
      default:
        return <Newspaper className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Lançamento':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Mídia':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Bastidores':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-surface/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <div className="inline-block bg-primary/20 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
            <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Fique por <span className="text-gradient">Dentro</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-2">
            Novidades, bastidores e tudo que está rolando no mundo da Maria Pita
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse p-4 sm:p-5 lg:p-6">
                <div className="aspect-video bg-white/5 rounded-lg mb-3 sm:mb-4 min-h-[140px] sm:min-h-[160px]" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-0"
              >
                <Card className="group overflow-hidden hover:border-primary/40 transition-all duration-300 h-full flex flex-col p-4 sm:p-5 lg:p-6">
                  {/* Imagem de destaque */}
                  <div className="relative aspect-video min-h-[160px] sm:min-h-[180px] bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary/30 backdrop-blur-sm p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                        {getIcon(item.icon)}
                      </div>
                    </div>
                    {/* Badge de categoria */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <Badge className={`${getCategoryColor(item.category)} border text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1`}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2 break-words">
                      {item.title}
                    </h3>

                    <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-1 min-h-0 break-words">
                      {item.excerpt}
                    </p>

                    {/* Data */}
                    <div className="flex items-center gap-2 text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{formatDate(item.date)}</span>
                    </div>

                    {/* Link */}
                    <button type="button" className="flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-medium text-sm sm:text-base w-fit flex-shrink-0">
                      <span>Ler mais</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ver todas */}
        {!loading && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 sm:mt-12 px-2"
          >
            <button type="button" className="group inline-flex items-center justify-center gap-2 text-primary hover:text-white transition-colors border border-primary/30 hover:border-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base">
              Ver todas as notícias
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Redes sociais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-20 text-center px-2"
        >
          <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">Acompanhe também nas redes sociais</p>
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            {[
              { name: 'Instagram', url: '#', icon: '📸' },
              { name: 'YouTube', url: '#', icon: '📹' },
              { name: 'Spotify', url: '#', icon: '🎵' },
              { name: 'TikTok', url: '#', icon: '🎬' }
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="flex items-center gap-1.5 sm:gap-2 bg-surface hover:bg-primary/20 border border-white/10 hover:border-primary/40 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 group text-sm sm:text-base"
              >
                <span className="text-lg sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">{social.icon}</span>
                <span className="text-white font-medium">{social.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
