import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';
import StaggeredMenu from './StaggeredMenu';
import logo from '../assets/logo.svg';

export const Navigation = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Detect scroll state
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active menu style (pill or staggered)
  const [menuStyle, setMenuStyle] = useState(() => {
    return localStorage.getItem('menuStyle') || 'staggered';
  });

  useEffect(() => {
    // Force reset legacy local storage values to 'staggered' to clear cache
    if (localStorage.getItem('menuStyle') !== 'staggered') {
      localStorage.setItem('menuStyle', 'staggered');
      setMenuStyle('staggered');
    }
  }, []);

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Músicas', href: '/releases' },
    { label: 'Shows', href: '/shows' },
    { label: 'Loja', href: '/products' },
    { label: 'Sobre', href: '/about' },
    { label: 'Contato', href: '/contact' }
  ];

  // Map items for StaggeredMenu (requires link instead of href)
  const staggeredItems = navItems.map(item => ({
    label: item.label,
    link: item.href,
    ariaLabel: `Ir para ${item.label}`
  }));

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/mariapitacantora_/' },
    { label: 'YouTube', link: 'https://www.youtube.com/@mariapitacantora' },
    { label: 'Spotify', link: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n' }
  ];

  const toggleStyle = () => {
    setMenuStyle(prev => (prev === 'pill' ? 'staggered' : 'pill'));
  };

  return (
    <>
      {menuStyle === 'pill' ? (
        <PillNav
          logo={logo}
          logoAlt="Maria Pita Logo"
          items={navItems}
          activeHref={location.pathname}
          ease="power3.easeOut"
          baseColor={isHome ? "#120F17" : "#ffffff"}
          pillColor={isHome ? "#ffffff" : "#120F17"}
          pillTextColor={isHome ? "#120F17" : "#ffffff"}
          hoveredPillTextColor={isHome ? "#ffffff" : "#120F17"}
          initialLoadAnimation={true}
        />
      ) : (
        <StaggeredMenu
          position="right"
          items={staggeredItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor={isHome ? (scrolled ? "#ffffff" : "#120F17") : "#ffffff"}
          openMenuButtonColor="#ffffff"
          changeMenuColorOnOpen={true}
          colors={['#FF2E8B', '#120F17']}
          logoUrl={logo}
          accentColor="#FF2E8B"
          isFixed={true}
        />
      )}

      {/* Floating Menu Switcher - Hidden in production */}
      <button
        onClick={toggleStyle}
        className="hidden fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 cursor-pointer hover:border-[#FF2E8B]/50 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 46, 139, 0.15)'
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#FF2E8B] animate-pulse"></span>
        <span>Alternar Menu ({menuStyle === 'pill' ? 'PillNav' : 'Staggered'})</span>
      </button>
    </>
  );
};
