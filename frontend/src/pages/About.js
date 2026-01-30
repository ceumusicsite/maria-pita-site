import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="pt-32 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-8">
            Sobre <span className="text-gradient">Maria Pita</span>
          </h1>

          <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535732850099-99177944f4c5?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Maria Pita"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg">
              Maria Pita é uma artista gospel dedicada a levar mensagens de fé, esperança e alegria 
              através da música. Com um estilo único que combina pop moderno com adoração profunda, 
              suas canções tocam corações e transformam vidas.
            </p>
            
            <p>
              Com uma paixão genuína por adorar a Deus e compartilhar o evangelho, Maria Pita tem 
              se destacado no cenário gospel brasileiro, levando sua música para igrejas, eventos 
              e shows em todo o país.
            </p>

            <p>
              Suas letras inspiradoras e melodias cativantes têm sido uma fonte de encorajamento 
              para muitos, especialmente jovens que buscam uma conexão mais profunda com Deus 
              através da música.
            </p>

            <h2 className="font-heading text-3xl font-bold text-white mt-12 mb-6">
              Missão
            </h2>
            <p>
              Usar o dom da música para glorificar a Deus e levar pessoas a uma experiência 
              transformadora com Cristo, através de canções que falam ao coração e elevam a alma.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
