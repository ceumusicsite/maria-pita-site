import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

const DEFAULT_ABOUT = {
  name: 'Maria Pita',
  photo_url: '/images/maria-pita-sobre.png',
  description: `Maria Pita é cantora e compositora gospel, nascida e criada no Brasil. Desde cedo encontrou na música e na fé a força para seguir seu chamado. Sua voz e suas canções carregam uma mensagem de esperança, amor e adoração que atravessa gerações.

Com influências que vão do pop ao worship contemporâneo, Maria Pita une letras que falam direto ao coração a melodias que ficam na memória. Já se apresentou em igrejas, congressos e eventos por todo o país, levando adoração e testemunho onde vai.

Para ela, a música é mais que profissão: é ministério. Cada show e cada música são uma oportunidade de conectar pessoas a Deus e de celebrar a vida com gratidão.`,
  mission: 'Usar o dom da música para glorificar a Deus e levar pessoas a uma experiência transformadora com Cristo, através de canções que falam ao coração e elevam a alma.'
};

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.get('/about');
        setAbout(data);
      } catch (error) {
        console.error('Erro ao carregar sobre:', error);
        setAbout(DEFAULT_ABOUT);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const display = about || DEFAULT_ABOUT;
  const rawDescription = display.description?.trim() || DEFAULT_ABOUT.description;
  const paragraphs = rawDescription.split(/\n\n+/).filter(Boolean);

  return (
    <main className="pt-32 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
            Sobre <span className="text-gradient">{display.name}</span>
          </h1>

          {loading ? (
            <div className="aspect-[4/5] sm:aspect-[3/4] max-h-[560px] mb-10 sm:mb-12 rounded-xl overflow-hidden bg-white/5 animate-pulse" />
          ) : (
            <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[560px] mb-10 sm:mb-12 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={display.photo_url}
                alt={display.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
            {loading ? (
              <>
                <div className="h-5 bg-white/10 rounded w-full animate-pulse" />
                <div className="h-5 bg-white/10 rounded w-4/5 animate-pulse" />
                <div className="h-5 bg-white/10 rounded w-full animate-pulse" />
              </>
            ) : (
              <>
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'text-lg' : ''}>
                    {paragraph}
                  </p>
                ))}

                {display.mission && (
                  <>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-12 mb-6">
                      Missão
                    </h2>
                    <p>{display.mission}</p>
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
