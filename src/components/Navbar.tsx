import { motion } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', href: '/', isInternal: true },
  { name: 'About', href: '/#about', isInternal: true },
  { name: 'Skills', href: '/skills', isInternal: true },
  { name: 'Projects', href: '/projects', isInternal: true },
  { name: 'Internships', href: '/internships', isInternal: true },
  { name: 'Certifications', href: '/certifications', isInternal: true },
  { name: 'Achievements', href: '/achievements', isInternal: true },
  { name: 'Contact', href: '/#contact', isInternal: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center p-6"
    >
      <div className="glass rounded-full px-8 py-3 flex items-center justify-between w-full max-w-5xl">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl font-display font-bold text-gradient cursor-pointer"
        >
          MUKESH.RAM
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-white/70 hover:text-neon-blue transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="https://github.com/ymukeshram" target="_blank" className="text-white/70 hover:text-neon-blue transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/mukesh-yenduri" target="_blank" className="text-white/70 hover:text-neon-blue transition-colors">
            <Linkedin size={20} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-24 left-6 right-6 glass rounded-2xl p-6 md:hidden flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-lg font-medium text-white/70 hover:text-neon-blue"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
