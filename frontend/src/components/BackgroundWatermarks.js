import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BackgroundWatermarks = () => {
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!leftTextRef.current || !rightTextRef.current || !containerRef.current) return;

    // Left watermark: moves downwards as you scroll (parallax)
    const animLeft = gsap.fromTo(leftTextRef.current,
      { y: -150 },
      {
        y: 250,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );

    // Right watermark: moves upwards in opposite direction (parallax)
    const animRight = gsap.fromTo(rightTextRef.current,
      { y: 250 },
      {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );

    return () => {
      animLeft.kill();
      animRight.kill();
    };
  }, []);

  const watermarkText = Array(12)
    .fill("MARIA PITA ✦ ADORAÇÃO ✦ SOU TEU PAI ✦ SE LEVANTE ✦ EU CUIDO ✦ VEM DE DEUS ✦ FÉ ✦ LOUVOR")
    .join(" ✦ ");

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {/* Subtle radial ambient glows to break up flat black */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-primary/[0.03] rounded-full blur-[180px]" />
      <div className="absolute top-[70%] left-[-15%] w-[55vw] h-[55vw] bg-primary/[0.04] rounded-full blur-[150px]" />
      
      {/* Left Vertical Text */}
      <div 
        ref={leftTextRef}
        className="absolute left-3 md:left-10 top-10 text-white/[0.15] font-heading font-black text-6xl md:text-8xl tracking-[0.25em] whitespace-nowrap [writing-mode:vertical-rl] uppercase"
      >
        {watermarkText}
      </div>

      {/* Right Vertical Text */}
      <div 
        ref={rightTextRef}
        className="absolute right-3 md:right-10 top-20 text-white/[0.15] font-heading font-black text-6xl md:text-8xl tracking-[0.25em] whitespace-nowrap [writing-mode:vertical-rl] uppercase"
      >
        {watermarkText}
      </div>
    </div>
  );
};
