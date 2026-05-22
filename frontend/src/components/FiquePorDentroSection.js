import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { api } from '@/lib/api';
import { Clock, ExternalLink, ArrowRight, Newspaper, Music, Radio } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Custom SVG components to ensure high quality official icons
const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3v6z"/></svg>
);

const SpotifyIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.67-.136-.746-.472-.075-.336.136-.67.472-.746 3.854-.88 7.15-.506 9.822 1.13.295.18.387.563.207.863zm1.224-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.66-1.11 8.224-.57 11.35 1.353.367.226.487.707.26 1.074zm.106-2.833C14.384 8.71 8.563 8.52 5.2 9.54c-.5.15-.82-.24-.97-.54-.15-.5.13-.93.54-1.05 3.85-1.17 10.27-.95 14.34 1.47.45.27.6.85.33 1.3-.27.45-.85.6-1.3.33z"/></svg>
);

const TiktokIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.5-4.09-1.29-.71-.47-1.32-1.08-1.8-1.79v6.52c.07 1.84-.52 3.73-1.75 5.09-1.33 1.53-3.41 2.41-5.46 2.48-2.38.07-4.85-.94-6.22-2.88-1.48-2.03-1.68-4.9-1.02-7.24.71-2.58 2.87-4.66 5.51-5.14 1.25-.23 2.55-.1 3.75.33v4.16c-1.17-.61-2.65-.65-3.8-.02-1.12.6-1.85 1.83-1.92 3.1-.09 1.63.95 3.23 2.5 3.72 1.57.53 3.42.06 4.46-1.17.67-.81.93-1.9.89-2.92V.02z"/></svg>
);

export const FiquePorDentroSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [socialLinks, setSocialLinks] = useState({
    instagram_url: 'https://www.instagram.com/mariapitacantora_/',
    youtube_url: 'https://www.youtube.com/@mariapitacantora',
    spotify_url: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
    tiktok_url: 'https://www.tiktok.com/@mariapitacantora'
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await api.get('/settings/social');
        if (data) {
          setSocialLinks(data);
        }
      } catch (error) {
        console.error('Erro ao carregar redes sociais na seção Fique por Dentro:', error);
      }
    };
    fetchSocialLinks();
  }, []);

  useGSAP(() => {
    if (loading) return;

    // Header Animation
    gsap.fromTo(".fique-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".fique-header",
          start: "top 85%",
          once: true
        }
      }
    );

    // Cards Animation
    if (news.length > 0) {
      gsap.fromTo(".fique-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".fique-grid",
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // Button Animation
    gsap.fromTo(".fique-button",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".fique-button",
          start: "top 90%",
          once: true
        }
      }
    );

    // Social Animation
    gsap.fromTo(".fique-social",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".fique-social",
          start: "top 85%",
          once: true
        }
      }
    );
  }, { scope: containerRef, dependencies: [loading, news] });

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
    <section ref={containerRef} className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-surface/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div
          className="fique-header text-center mb-10 sm:mb-14 lg:mb-16"
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
        </div>

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
          <div className="fique-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {news.map((item, index) => (
              <div
                key={item.id}
                className="fique-card min-w-0"
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
              </div>
            ))}
          </div>
        )}

        {/* Ver todas */}
        {!loading && news.length > 0 && (
          <div
            className="fique-button text-center mt-8 sm:mt-12 px-2"
          >
            <button type="button" className="group inline-flex items-center justify-center gap-2 text-primary hover:text-white transition-colors border border-primary/30 hover:border-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base">
              Ver todas as notícias
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Redes sociais */}
        <div
          className="fique-social mt-14 sm:mt-20 text-center px-2"
        >
          <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">Acompanhe também nas redes sociais</p>
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            {[
              { name: 'Instagram', url: socialLinks.instagram_url, icon: InstagramIcon },
              { name: 'YouTube', url: socialLinks.youtube_url, icon: YoutubeIcon },
              { name: 'Spotify', url: socialLinks.spotify_url, icon: SpotifyIcon },
              { name: 'TikTok', url: socialLinks.tiktok_url, icon: TiktokIcon }
            ].map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 bg-surface hover:bg-primary/20 border border-white/10 hover:border-primary/40 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 group text-sm sm:text-base"
                >
                  <span className="text-primary group-hover:scale-110 transition-transform flex-shrink-0 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className="text-white font-medium">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
