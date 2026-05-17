import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const displayProjects = projects.length > 0 ? projects : [
    {
      id: 'd1',
      title: 'Voice-Based Medical Assistant',
      description: 'Developed a voice-enabled medical assistant chatbot that provides basic healthcare information and symptom-based responses. Implemented speech recognition and text-to-speech modules for seamless hands-free interaction.',
      tech: ['Python', 'NLP', 'Speech Recognition', 'Google Colab'],
      image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1200&auto=format&fit=crop',
      github: '#',
      live: '#'
    },
    {
      id: 'd2',
      title: 'AI Workflow Automation',
      description: 'Automated complex business workflows using n8n and integrated various AI-driven solutions for efficiency.',
      tech: ['n8n', 'AI Integration', 'Cloud Tech'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      github: '#',
      live: '#'
    },
    {
      id: 'd3',
      title: 'GITAM AI Chatbot',
      description: 'Created a specialized AI chatbot for GITAM College to assist students and faculty with college-related queries.',
      tech: ['Python', 'LLMs', 'NLP', 'Gitam API'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
      github: '#',
      live: '#'
    },
    {
      id: 'd4',
      title: 'Automated Insurance Quote',
      description: 'Multi-agent system that generates quotes, gives predictions, and provides suggestions using LLMs.',
      tech: ['Python', 'Flask', 'LLMs', 'Multi-Agent'],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
      github: '#',
      live: '#'
    }
  ];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {displayProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id || project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass rounded-2xl overflow-hidden group border border-white/5 hover:border-neon-blue/30 transition-all duration-500"
            >
              <div className="block h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent opacity-60" />
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-display font-bold group-hover:text-neon-blue transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-4">
                      {project.github && project.github !== '#' && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-neon-blue transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {project.live && project.live !== '#' && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-neon-blue transition-colors">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t: string) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-neon-blue/70 px-2 py-1 bg-neon-blue/5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
