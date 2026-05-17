import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Skill {
  id: string;
  name: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const qS = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubS = onSnapshot(qS, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name } as Skill)));
    });

    return () => { unsubS(); };
  }, []);

  // Fallback dummy skills if none in DB
  const displaySkills = skills.length > 0 ? skills : [
    { id: 'd1', name: 'React' },
    { id: 'd2', name: 'TypeScript' },
    { id: 'd3', name: 'Node.js' },
    { id: 'd4', name: 'Python' }
  ];

  // Duplicate for smooth scrolling
  const midPoint = Math.ceil(displaySkills.length / 2);
  const row1Skills = displaySkills.slice(0, midPoint);
  const row2Skills = displaySkills.slice(midPoint);

  const scrollRow1 = [...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills];
  const scrollRow2 = [...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills];

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4 text-center"
          >
            Technical <span className="text-gradient">Arsenal</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1: Leftwards (Skills) */}
        <div className="relative flex overflow-hidden">
          <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-8 sm:gap-12">
            {scrollRow1.map((item, idx) => (
              <div 
                key={`${item.id}-r1-${idx}`}
                className="px-8 py-4 glass rounded-2xl border border-neon-blue/30 bg-neon-blue/5 text-xl md:text-2xl font-display font-bold text-white shadow-[0_0_20px_rgba(0,243,255,0.15)] flex items-center justify-center min-w-[180px]"
              >
                <span className="text-gradient">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Rightwards (Skills) */}
        <div className="relative flex overflow-hidden">
          <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-8 sm:gap-12" style={{ animationDirection: 'reverse' }}>
            {scrollRow2.map((item, idx) => (
              <div 
                key={`${item.id}-r2-${idx}`}
                className="px-8 py-4 glass rounded-2xl border border-neon-blue/30 bg-neon-blue/5 text-xl md:text-2xl font-display font-bold text-white shadow-[0_0_20px_rgba(0,243,255,0.15)] flex items-center justify-center min-w-[180px]"
              >
                <span className="text-gradient">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
      `}} />
    </section>
  );
}
