import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { MapPin, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await api.get('/shows');
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setShows(sorted);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const filteredShows = useMemo(() => {
    if (!filterState) return shows;
    return shows.filter((s) => s.state && s.state.toLowerCase() === filterState.toLowerCase());
  }, [shows, filterState]);

  const states = useMemo(() => {
    const set = new Set(shows.map((s) => s.state).filter(Boolean));
    return Array.from(set).sort();
  }, [shows]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
            Datas de <span className="text-gradient">Todos os Shows</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Confira a agenda completa com datas, horários e locais das apresentações
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-text-secondary py-20">Carregando...</div>
        ) : shows.length === 0 ? (
          <div className="text-center text-text-secondary py-20">
            Nenhum show agendado no momento. Em breve!
          </div>
        ) : (
          <>
            {states.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  onClick={() => setFilterState('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !filterState
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-white/10 text-text-secondary hover:border-primary/40'
                  }`}
                >
                  Todos
                </button>
                {states.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => setFilterState(state)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterState === state
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-white/10 text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </motion.div>
            )}

            <div className="space-y-4">
              {filteredShows.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:border-primary/40 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Data em destaque */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="bg-primary/20 p-4 rounded-xl text-center min-w-[100px]">
                          <div className="text-3xl font-heading font-bold text-primary leading-none">
                            {new Date(show.date).getDate()}
                          </div>
                          <div className="text-xs font-medium text-primary/90 uppercase mt-1">
                            {new Date(show.date).toLocaleDateString('pt-BR', { month: 'short' })}
                          </div>
                          <div className="text-xs text-text-secondary mt-0.5">
                            {new Date(show.date).getFullYear()}
                          </div>
                        </div>
                        <div className="md:hidden">
                          {show.time && (
                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{show.time}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info do show */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">
                          {show.event_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-text-secondary text-sm">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {[show.venue, show.city, show.state].filter(Boolean).join(' · ')}
                          </span>
                          {show.time && (
                            <span className="hidden md:flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-primary" />
                              {show.time}
                            </span>
                          )}
                        </div>
                        <p className="text-text-secondary/80 text-sm mt-1">
                          {formatDate(show.date)}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <Button variant="secondary" type="button" className="w-full md:w-auto">
                          Mais Informações
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredShows.length === 0 && filterState && (
              <p className="text-center text-text-secondary py-12">
                Nenhum show encontrado para o estado selecionado.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
