import { motion } from 'framer-motion';
import { Button } from './ui/Button';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-end justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1687458656645-e4f6e5a79d4c?crop=entropy&cs=srgb&fm=jpg&q=85)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            MARIA <span className="text-gradient">PITA</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
            Artista gospel levando mensagens de fé, esperança e alegria através da música.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" className="text-lg px-10 py-4">
              Ouvir Agora
            </Button>
            <Button variant="secondary" className="text-lg px-10 py-4">
              Ver Shows
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
