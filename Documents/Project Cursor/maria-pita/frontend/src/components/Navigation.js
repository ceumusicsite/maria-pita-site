import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'INÍCIO' },
    { to: '/releases', label: 'MÚSICAS' },
    { to: '/shows', label: 'SHOWS' },
    { to: '/products', label: 'LOJA' },
    { to: '/about', label: 'SOBRE' },
    { to: '/contact', label: 'CONTATO' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glassmorphism py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-heading font-bold text-gradient">
            MARIA PITA
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-xs uppercase tracking-widest transition-colors",
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-text-secondary hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button variant="primary" className="hidden md:block">
            Contratar
          </Button>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
