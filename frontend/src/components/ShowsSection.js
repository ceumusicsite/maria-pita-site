import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ShowsSection = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (loading) return;

    // Header Animation
    gsap.fromTo(".shows-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".shows-header",
          start: "top 85%",
          once: true
        }
      }
    );

    // Empty state Animation
    if (shows.length === 0) {
      gsap.fromTo(".shows-empty",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".shows-empty",
            start: "top 85%",
            once: true
          }
        }
      );
      return;
    }

    // Cards Animation
    gsap.fromTo(".shows-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".shows-grid",
          start: "top 80%",
          once: true
        }
      }
    );

    // Button Animation
    gsap.fromTo(".shows-button",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ".shows-button",
          start: "top 90%",
          once: true
        }
      }
    );
  }, { scope: containerRef, dependencies: [loading, shows] });

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
    <section ref={containerRef} className="py-32 container mx-auto px-6 max-w-7xl">
      <div
        className="shows-header mb-16"
      >
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
          Próximos <span className="text-gradient">Shows</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl">
          Venha adorar conosco em uma experiência única de fé e música
        </p>
      </div>

      {shows.length === 0 && !loading ? (
        <div className="shows-empty text-center text-text-secondary py-8">
          Nenhum show agendado no momento.
        </div>
      ) : (
        <>
          <div className="shows-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {shows.map((show, index) => (
          <div
            key={show.id}
            className="shows-card"
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
          </div>
        ))}
          </div>

          <div
            className="shows-button mt-12 text-center"
          >
            <Link to="/shows">
              <Button variant="secondary" type="button">
                Ver Todos os Shows
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};
