import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music2, Facebook } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/mariapitacantora_/', label: 'Instagram', target: '_blank', rel: 'noopener noreferrer' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Music2, href: '#', label: 'Spotify' },
    { icon: Facebook, href: '#', label: 'Facebook' },
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
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.target || '_self'}
                    rel={social.rel || ''}
                    aria-label={social.label}
                    className="text-text-secondary hover:text-primary transition-colors p-2 hover:scale-110 transition-transform"
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
