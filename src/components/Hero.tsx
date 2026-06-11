import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const roles = ["AI Enthusiast", "Developer", "Problem Solver"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 50 : 150;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setDisplayText(currentRole.substring(0, isDeleting ? displayText.length - 1 : displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Hi, I'm <br />
            <span className="text-gradient">Yenduri Mukesh Ram</span>
          </h1>
          <div className="h-8 mb-8">
            <p className="text-xl md:text-2xl text-white/60 font-medium">
              {displayText}
              <span className="animate-pulse text-neon-blue ml-1">|</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <motion.a
              href= "Y.MUKESH-RESUME.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neon-blue text-dark-bg font-bold rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all cursor-pointer"
            >
              Download Resume <Download size={18} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="relative w-64 h-80 md:w-80 md:h-[450px]">
            {/* Animated Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-neon-blue/30 rounded-3xl"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-neon-blue/20 rounded-3xl"
            />
            
            {/* Profile Image Container */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 rounded-2xl overflow-hidden neon-border bg-dark-bg/50 backdrop-blur-sm"
            >
              <img 
                src="/mukesh.jpeg"
                alt="Mukesh Ram"
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-10 bg-gradient-to-b from-neon-blue to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
