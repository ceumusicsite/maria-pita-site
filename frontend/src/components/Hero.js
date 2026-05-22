import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/Button';
import { useRef } from 'react';
import artistImage from '../assets/maria-editada.png';
import bgVideo from '../assets/maria-bg-video.webm';
import CurvedLoop from './CurvedLoop';
import SplitText from './SplitText';

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex text-black items-end justify-center overflow-hidden premium-noise bg-gradient-to-br from-white via-[#FCF9FA] to-[#F5ECEE]">

      {/* Vídeo de Fundo Mesclado */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.30] mix-blend-multiply z-0 pointer-events-none"
      >
        <source src={bgVideo} type="video/webm" />
      </video>

      {/* Tipografia Gigante no Fundo com Animação SplitText */}
      <motion.div
        className="absolute top-[13%] md:top-[5%] lg:top-[6%] w-full text-right md:text-center pr-4 md:pr-0 z-0 pointer-events-none select-none"
        style={{ y: yText }}
      >
        <div className="hidden md:block">
          <SplitText
            text="Maria Pita"
            className="font-heading font-black text-[6.5vw] lg:text-[7.5vw] leading-none tracking-tighter uppercase text-primary"
            style={{ whiteSpace: 'nowrap' }}
            delay={40}
            duration={1.0}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 70 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="center"
            tag="div"
          />
        </div>
        <div className="block md:hidden flex flex-col items-end pr-4 text-right leading-[0.8]">
          <SplitText
            text="Maria"
            className="font-heading font-black text-[13vw] leading-[0.85] tracking-tighter uppercase text-primary"
            style={{ whiteSpace: 'nowrap' }}
            delay={40}
            duration={1.0}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="right"
            tag="div"
          />
          <SplitText
            text="Pita"
            className="font-heading font-black text-[13vw] leading-[0.85] tracking-tighter uppercase text-primary mt-[-1.5vw]"
            style={{ whiteSpace: 'nowrap' }}
            delay={60}
            duration={1.0}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="center"
            tag="div"
          />
        </div>
      </motion.div>

      <div className="relative z-20 container mx-auto px-6 max-w-7xl h-full min-h-screen flex flex-col md:flex-row-reverse items-center pt-32 max-md:pt-44 md:pt-0 pb-16 md:pb-0">

        {/* Lado Esquerdo - Textos e Botão (posicionados na direita no PC via flex-row-reverse) */}
        <motion.div
          initial={{ opacity: 0, y: 30, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="w-full md:w-[45%] z-30 mb-8 md:mb-0 relative text-right max-md:w-[62%] max-md:ml-auto max-md:mt-16 max-md:z-30"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-[1.05] text-black text-right">
            Seja <br /><span className="text-primary relative inline-block mt-1 md:mt-2">Bem-vindo<span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10"></span></span><br /> ao meu site!
          </h1>
          <p className="text-sm md:text-lg text-black/70 mb-6 md:mb-10 leading-relaxed font-body max-w-lg text-right ml-auto">
            Neste espaço você encontrará um pouco da minha caminhada com Deus, minhas músicas e tudo aquilo que Ele me permite compartilhar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-md:mt-6 md:justify-end">
            <Button className="bg-primary text-white hover:bg-primary/90 text-sm md:text-base px-5 py-3 md:px-30 md:py-4 rounded-full button-premium-glow shadow-xl shadow-primary/20 transition-all w-full sm:w-auto">
              Conheça minha Loja
            </Button>
            <Button variant="outline" className="hidden md:flex text-black border-black/20 hover:bg-black/5 hover:border-black/40 text-sm md:text-base px-5 py-3 md:px-6 md:py-4 rounded-full transition-all w-full sm:w-auto">
              Ouvir minhas músicas
            </Button>
          </div>
        </motion.div>

        {/* Lado Direito - Imagem da Artista (posicionada na esquerda no PC via flex-row-reverse) */}
        <motion.div
          className="absolute md:relative z-10 left-[-12vw] md:left-0 bottom-0 w-[75vw] md:w-[50%] h-[75vh] md:h-screen flex items-end justify-start pointer-events-none"
          style={{ y: yImage }}
        >
          {/* Fade & Slide up na entrada */}
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative flex justify-start items-end pb-0"
          >
            {/* Flutuação contínua */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full h-full flex justify-start items-end"
            >
              {/* Glow atrás da imagem para focar na face e roupa */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-white/70 blur-[80px] -z-10"></div>

              {/* Imagem escalada para ficar maior e equiparar ao texto */}
              <img
                src={artistImage}
                alt="Maria Pita"
                className="w-full max-h-[120%] scale-[1.5] md:scale-[1.25] lg:scale-[1.3] -translate-y-2 md:-translate-y-10 origin-bottom object-contain drop-shadow-2xl z-20 object-bottom"
                style={{
                  filter: "drop-shadow(0px 30px 40px rgba(0,0,0,0.25))",
                  WebkitMaskImage: 'linear-gradient(to top, transparent 2%, rgba(0, 0, 0, 1) 18%)',
                  maskImage: 'linear-gradient(to top, transparent 2%, rgba(0, 0, 0, 1) 18%)'
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Curved loop text marquee at the bottom of the hero section */}
      <div className="absolute bottom-[-15px] left-0 w-full z-30 pointer-events-none overflow-hidden h-[100px]">
        <CurvedLoop
          marqueeText="Maria Pita ✦ Maria Pita ✦ "
          speed={0.8}
          curveAmount={120}
          direction="right"
          interactive={true}
          className="text-primary font-heading uppercase text-7xl md:text-7xl lg:text-8xl font-black select-none"
        />
      </div>

      {/* Gradiente sutil em baixo para misturar na próxima seção se necessário */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-white to-transparent pointer-events-none z-30"></div>
    </section>
  );
};
