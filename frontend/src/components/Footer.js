import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export const Footer = () => {
  const currentYear = new Date().getFullYear();

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
        console.error('Erro ao carregar redes sociais no rodapé:', error);
      }
    };
    fetchSocialLinks();
  }, []);

  const socialItems = [
    { icon: InstagramIcon, href: socialLinks.instagram_url, label: 'Instagram' },
    { icon: YoutubeIcon, href: socialLinks.youtube_url, label: 'YouTube' },
    { icon: SpotifyIcon, href: socialLinks.spotify_url, label: 'Spotify' },
    { icon: TiktokIcon, href: socialLinks.tiktok_url, label: 'TikTok' },
  ];

  const footerLinks = [
    { to: '/releases', label: 'Músicas' },
    { to: '/shows', label: 'Shows' },
    { to: '/products', label: 'Loja' },
    { to: '/about', label: 'Sobre' },
    { to: '/contact', label: 'Contato' },
  ];

  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-heading text-2xl font-bold text-gradient mb-4">
              MARIA PITA
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Levando mensagens de fé, esperança e alegria através da música gospel.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {socialItems.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-text-secondary hover:text-primary transition-all p-2 hover:scale-110 flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-text-secondary text-sm">
            © {currentYear} Maria Pita. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
