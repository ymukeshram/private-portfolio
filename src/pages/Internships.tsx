import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import InternshipsSection from '../components/InternshipsSection';
import BackgroundParticles from '../components/BackgroundParticles';

export default function InternshipsPage() {
  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <BackgroundParticles />
      <Navbar />
      <main className="pt-32">
        <InternshipsSection />
      </main>
      <footer className="py-12 px-6 border-t border-white/5 flex flex-col items-center gap-6 bg-dark-bg/50 backdrop-blur-md">
        <div className="text-2xl font-display font-bold text-gradient">MUKESH.RAM</div>
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} Yenduri Mukesh Ram. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
