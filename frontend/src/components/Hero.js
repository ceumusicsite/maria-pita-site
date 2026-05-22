import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/Button';
import artistImage from '../assets/maria-editada.png';
import bgVideo from '../assets/maria-bg-video.webm';
import CurvedLoop from './CurvedLoop';
import SplitText from './SplitText';
import { api } from '@/lib/api';

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

export const Hero = () => {
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
        console.error('Erro ao carregar redes sociais no Hero:', error);
      }
    };
    fetchSocialLinks();
  }, []);

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
          <p className="text-sm md:text-lg text-black/70 mb-6 md:mb-8 leading-relaxed font-body max-w-lg text-right ml-auto">
            Neste espaço você encontrará um pouco da minha caminhada com Deus, minhas músicas e tudo aquilo que Ele me permite compartilhar.
          </p>

          {/* Redes Sociais */}
          <div className="flex gap-4 justify-end mb-6 md:mb-8 pointer-events-auto">
            <a
              href={socialLinks.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:scale-115 transition-all duration-300 p-2 bg-primary/5 rounded-full hover:bg-primary/10 border border-primary/10 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:scale-115 transition-all duration-300 p-2 bg-primary/5 rounded-full hover:bg-primary/10 border border-primary/10 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:scale-115 transition-all duration-300 p-2 bg-primary/5 rounded-full hover:bg-primary/10 border border-primary/10 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
              aria-label="Spotify"
            >
              <SpotifyIcon className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:scale-115 transition-all duration-300 p-2 bg-primary/5 rounded-full hover:bg-primary/10 border border-primary/10 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
              aria-label="TikTok"
            >
              <TiktokIcon className="w-5 h-5" />
            </a>
          </div>

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
          className="absolute md:relative z-10 left-[-18vw] md:left-0 bottom-0 w-[85vw] md:w-[50%] h-[72vh] md:h-screen flex items-end justify-start pointer-events-none"
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
                className="w-full max-h-[120%] scale-[1.6] md:scale-[1.25] lg:scale-[1.3] -translate-y-2 md:-translate-y-10 origin-bottom object-contain drop-shadow-2xl z-20 object-bottom"
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
