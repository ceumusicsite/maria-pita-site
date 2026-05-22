import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  style: customStyle = {},
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      if (animationCompletedRef.current) return;
      const el = ref.current;

      const targets = el.querySelectorAll('.split-char, .split-word');
      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin
      ],
      scope: ref
    }
  );

  const words = text.split(' ');

  const renderContent = () => {
    if (splitType === 'words') {
      return words.map((word, wIdx) => (
        <span
          key={wIdx}
          className="split-word"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            willChange: 'transform, opacity'
          }}
        >
          {word}
          {wIdx < words.length - 1 && '\u00A0'}
        </span>
      ));
    }

    // Default to 'chars'
    return words.map((word, wIdx) => (
      <span
        key={wIdx}
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {word.split('').map((char, cIdx) => (
          <span
            key={cIdx}
            className="split-char"
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity'
            }}
          >
            {char}
          </span>
        ))}
        {wIdx < words.length - 1 && (
          <span className="split-char" style={{ display: 'inline-block' }}>
            {'\u00A0'}
          </span>
        )}
      </span>
    ));
  };

  const style = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity',
    ...customStyle
  };
  const classes = `split-parent ${className}`;
  const Tag = tag || 'p';

  return (
    <Tag ref={ref} style={style} className={classes}>
      {renderContent()}
    </Tag>
  );
};

export default SplitText;
