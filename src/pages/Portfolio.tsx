import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import Contact from '../components/Contact';
import BackgroundParticles from '../components/BackgroundParticles';
import LoadingScreen from '../components/LoadingScreen';
import { Link, useLocation } from 'react-router-dom';

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, location.hash]);

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <BackgroundParticles />
          <Navbar />
          
          <main>
            <Hero />
            <div id="about" className="content-auto"><About /></div>
            <div id="skills" className="content-auto"><Skills /></div>
            <div id="timeline" className="content-auto"><Timeline /></div>
            <div id="contact" className="content-auto"><Contact /></div>
          </main>

          <footer className="py-12 px-6 border-t border-white/5 flex flex-col items-center gap-6 bg-dark-bg/50 backdrop-blur-md">
            <div className="text-2xl font-display font-bold text-gradient">MUKESH.RAM</div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Yenduri Mukesh Ram. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs uppercase tracking-widest text-white/30 hover:text-neon-blue transition-colors">Home</Link>
              <Link to="/#about" className="text-xs uppercase tracking-widest text-white/30 hover:text-neon-blue transition-colors">About</Link>
              <Link to="/#projects" className="text-xs uppercase tracking-widest text-white/30 hover:text-neon-blue transition-colors">Projects</Link>
              <Link to="/#contact" className="text-xs uppercase tracking-widest text-white/30 hover:text-neon-blue transition-colors">Contact</Link>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
