import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Briefcase, ExternalLink, Code2 } from 'lucide-react';

interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
  certificateUrl?: string;
  createdAt: any;
}

export default function InternshipsSection() {
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'internships'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setInternships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Internship)));
    });
  }, []);

  return (
    <section id="internships" className="py-24 px-6 relative overflow-hidden min-h-[60vh]">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            My <span className="text-gradient">Internships</span>
          </motion.h2>
          <div className="w-24 h-1.5 bg-neon-blue rounded-full" />
        </div>

        {internships.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <Briefcase className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-xl font-display">No internships added yet.</p>
            <p className="text-white/20 mt-2">Log in to the admin panel to add your experiences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {internships.map((internship, idx) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 md:p-12 group hover:border-neon-blue/40 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-neon-blue mb-4">
                      <Briefcase size={20} />
                      <span className="font-mono text-sm tracking-widest uppercase opacity-70">
                        {internship.duration}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-neon-blue transition-colors">
                      {internship.role}
                    </h3>
                    <div className="text-xl text-white/80 font-medium mb-6">
                      at <span className="text-white">{internship.company}</span>
                    </div>

                    <p className="text-white/60 leading-relaxed mb-8 text-lg max-w-3xl">
                      {internship.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-8">
                      {internship.technologies.map(tech => (
                        <span key={tech} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all">
                          <Code2 size={14} className="text-neon-blue" />
                          {tech}
                        </span>
                      ))}
                    </div>

                    {internship.certificateUrl && (
                      <a 
                        href={internship.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neon-blue hover:text-white transition-colors font-medium border-b border-neon-blue/30 hover:border-white pb-1"
                      >
                        View Experience Certificate <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
