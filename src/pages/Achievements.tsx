import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import BackgroundParticles from '../components/BackgroundParticles';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Award, Edit3, Calendar, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAIL = 'ymukeshram@gmail.com';

interface Achievement {
  id: string;
  title: string;
  organization: string;
  date?: string;
  description?: string;
  proofUrl?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });

    const q = query(collection(db, 'achievements'), orderBy('createdAt', 'desc'));
    const unsubData = onSnapshot(q, (snapshot) => {
      setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement)));
    });

    return () => {
      unsubAuth();
      unsubData();
    };
  }, []);

  const displayAchievements = achievements;

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
              My <span className="text-gradient">Achievements</span>
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
                  Edit Achievements
                </Link>
              </motion.div>
            )}

            <p className="text-white/40 mt-6 max-w-2xl text-lg">
              Recognitions, awards, and milestones reached throughout my academic and professional journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayAchievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-neon-blue/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Award size={120} />
                </div>
                
                <div className="flex items-start gap-6 relative z-10">
                  <div className="p-4 bg-neon-blue/10 rounded-2xl text-neon-blue group-hover:bg-neon-blue group-hover:text-dark-bg transition-all">
                    <Award size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl font-display font-bold">{achievement.title}</h3>
                      {achievement.date && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-white/40 flex items-center gap-1">
                          <Calendar size={12} />
                          {achievement.date}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue font-medium mb-4">
                      <Building2 size={16} />
                      {achievement.organization}
                    </div>
                    {achievement.description && (
                      <p className="text-white/60 leading-relaxed italic mb-4">
                        "{achievement.description}"
                      </p>
                    )}
                    {achievement.proofUrl && (
                      <a 
                        href={achievement.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neon-blue hover:text-white transition-colors text-sm font-medium border-b border-neon-blue/30 hover:border-white pb-1"
                      >
                        View Proof / Certificate <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {displayAchievements.length === 0 && (
            <div className="text-center py-24 glass rounded-3xl">
              <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-xl font-display">No achievements added yet.</p>
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
