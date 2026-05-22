import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ReleasesSection = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

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

  useGSAP(() => {
    if (loading) return;

    // Header Animation
    gsap.fromTo(".releases-header", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".releases-header",
          start: "top 85%",
          once: true
        }
      }
    );

    // Empty state Animation
    if (releases.length === 0) {
      gsap.fromTo(".releases-empty",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".releases-empty",
            start: "top 85%",
            once: true
          }
        }
      );
      return;
    }

    // Cards Animation
    gsap.fromTo(".releases-card-wrapper", 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".releases-carousel",
          start: "top 80%",
          once: true
        }
      }
    );

    // Button Animation
    gsap.fromTo(".releases-button",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".releases-button",
          start: "top 90%",
          once: true
        }
      }
    );
  }, { scope: containerRef, dependencies: [loading, releases] });

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
        setReleases(sortedReleases.slice(0, 6)); // Aumentado para 6 itens para scrollar melhor
        console.log('Releases to display:', sortedReleases.slice(0, 6));
      } catch (error) {
        console.error('Error fetching releases:', error);
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector('.releases-card-wrapper');
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = parseInt(window.getComputedStyle(carouselRef.current).gap) || 24;
    const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1);
    
    gsap.to(carouselRef.current, {
      scrollLeft: carouselRef.current.scrollLeft + scrollAmount,
      duration: 0.8,
      ease: 'power3.out'
    });
  };

  if (loading) {
    return (
      <section className="py-32 container mx-auto px-6 max-w-7xl">
        <div className="text-center text-text-secondary">Carregando...</div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="py-32 w-full overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="releases-header flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
              Últimos <span className="text-gradient">Lançamentos</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl">
              Assista aos clipes oficiais de adoração e louvor de Maria Pita
            </p>
          </div>
          
          {releases.length > 0 && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => scroll('left')}
                className="group p-4 rounded-full border border-white/10 bg-surface/50 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/25"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="group p-4 rounded-full border border-white/10 bg-surface/50 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/25"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {releases.length === 0 && !loading ? (
        <div className="releases-empty text-center text-text-secondary py-8 max-w-7xl mx-auto px-6">
          Nenhum lançamento encontrado.
        </div>
      ) : (
        <>
          {/* Scrollable Gallery */}
          <div 
            ref={carouselRef}
            className="releases-carousel flex overflow-x-auto gap-8 md:gap-12 py-16 px-6 xl:px-[calc((100vw-1280px)/2+24px)] pb-12 snap-x snap-mandatory custom-scrollbar"
          >
            {releases.map((release, index) => {
              const isHovered = hoveredIndex === index;
              const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;
              const isOther = hoveredIndex !== null && !isHovered && !isNeighbor;
              
              // Dock animations
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;
              
              if (hoveredIndex !== null) {
                if (isHovered) {
                  scale = 1.15;
                  opacity = 1;
                  zIndex = 40;
                } else if (isNeighbor) {
                  scale = 1.05;
                  opacity = 0.85;
                  zIndex = 30;
                } else if (isOther) {
                  scale = 0.90;
                  opacity = 0.45;
                  zIndex = 10;
                }
              }
              
              return (
                <div
                  key={release.id}
                  className="releases-card-wrapper flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[620px] lg:w-[740px] xl:w-[820px] snap-start"
                >
                  <div
                    className="releases-card w-full"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform: `scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      position: 'relative',
                      transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease, z-index 0.45s ease',
                    }}
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
                        <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight mb-2">
                          {release.title}
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm md:text-base line-clamp-2 max-w-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {release.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="releases-button mt-12 text-center max-w-7xl mx-auto px-6">
            <Button variant="secondary" to="/releases">
              Ver Todos os Lançamentos
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
