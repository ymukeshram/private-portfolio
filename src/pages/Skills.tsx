import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import BackgroundParticles from '../components/BackgroundParticles';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Code2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAIL = 'ymukeshram@gmail.com';

interface Skill {
  id: string;
  name: string;
  category?: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });

    const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubData = onSnapshot(q, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill)));
    });

    return () => {
      unsubAuth();
      unsubData();
    };
  }, []);

  const displaySkills = skills.length > 0 ? skills : [
    { id: 'd1', name: 'React', category: 'Frontend' },
    { id: 'd2', name: 'TypeScript', category: 'Frontend' },
    { id: 'd3', name: 'Node.js', category: 'Backend' },
    { id: 'd4', name: 'Python', category: 'Backend' },
    { id: 'd5', name: 'Firebase', category: 'Tools' },
    { id: 'd6', name: 'Tailwind', category: 'Frontend' },
    { id: 'd7', name: 'Java', category: 'Backend' },
    { id: 'd8', name: 'SQL', category: 'Tools' }
  ];


  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <BackgroundParticles />
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-display font-bold mb-4"
            >
              My <span className="text-gradient">Skills</span>
            </motion.h1>
            <div className="w-24 h-1.5 bg-neon-blue rounded-full" />
            
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <Link 
                  to="/admin" 
                  className="inline-flex items-center gap-2 px-6 py-2 bg-neon-blue text-dark-bg font-bold rounded-full hover:scale-105 transition-transform"
                >
                  <Edit3 size={18} />
                  Edit Skills
                </Link>
              </motion.div>
            )}

            <p className="text-white/40 mt-6 max-w-2xl text-lg">
              A comprehensive list of my technical proficiencies and technologies I've mastered over the years.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displaySkills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-6 rounded-2xl flex items-center gap-4 group hover:border-neon-blue/30 transition-all border border-white/5"
              >
                <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue group-hover:bg-neon-blue group-hover:text-dark-bg transition-all">
                  <Code2 size={20} />
                </div>
                <span className="font-bold text-lg">{skill.name}</span>
              </motion.div>
            ))}
          </div>

          {displaySkills.length === 0 && (
            <div className="text-center py-24 glass rounded-3xl">
              <Code2 className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-xl font-display">No skills added yet.</p>
            </div>
          )}
        </div>
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
