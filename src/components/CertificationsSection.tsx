import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Award, ExternalLink, Search, Filter } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  link: string;
  isStatic?: boolean;
}

const staticCertificates = [
  {
    name: "Software Engineer Intern Certificate",
    issuer: "HackerRank",
    link: "https://drive.google.com/file/d/15cX5VHjYIrTm16ed0yVgftxr5i3ENM9j/view?usp=drive_link"
  },
  {
    name: "ServiceNow Internship Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1K2pGKvCYtiibvQ1B51Tz3C8-w8x_-F9_/view?usp=drive_link"
  },
  {
    name: "Relai.World Internship Certificate",
    issuer: "Relai",
    link: "https://drive.google.com/file/d/1Edyr6b-sQQ1tHz2sfXAK34nBBU4tCOZu/view?usp=drive_link"
  },
  {
    name: "Cisco Python 2 Certificate",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1Ra_XaxAEFq04jaSMZy8dEmYM01C8aKw7/view?usp=drive_link"
  },
  {
    name: "Cisco Python 1 Certificate",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1ovq01tK6gb7FVLdrUq-W9v_IoRPRZ26n/view?usp=drive_link"
  },
  {
    name: "iAspire Certificate",
    issuer: "Accenture",
    link: "https://drive.google.com/file/d/1VZWF4ejGs4_JVaAezWRWI4J5DExbknKw/view?usp=drive_link"
  },
  {
    name: "Introduction to DevOps",
    issuer: "Microsoft",
    link: "https://drive.google.com/file/d/1JhkxW6q7lwDT629Do6KPBDULCgQk73zj/view?usp=drive_link"
  },
  {
    name: "Design Workflow Certificate",
    issuer: "Microsoft",
    link: "https://drive.google.com/file/d/1fxLehW90Pw65Td62c_FWlU7r31sMay4C/view?usp=drive_link"
  },
  {
    name: "AZ-400 Certificate",
    issuer: "Microsoft",
    link: "https://drive.google.com/file/d/1rwBEbDzsq_uw0TXCixTG0IvtLOKYPlQV/view?usp=drive_link"
  },
  {
    name: "AI Azure Certificate",
    issuer: "Microsoft",
    link: "https://drive.google.com/file/d/1jnboc_BPAtQyIxOX6jZKAj3sWDWHQYYM/view?usp=drive_link"
  },
  {
    name: "UI Builder Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1w-O-M3xiYm2Kvj350h_DbYdq6je6qbQN/view?usp=drive_link"
  },
  {
    name: "Predictive Intelligence Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1feu_QkiNTejrNngLT9CnO8GBEuzMwCZx/view?usp=drive_link"
  },
  {
    name: "Platform Analytics Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1CRpOx5J84HT41oLHX2H2AhG69mAFL1sx/view?usp=drive_link"
  },
  {
    name: "Agentic AI Executive Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1K5kngdzZaNt75sM55ZmO7bZoQNZThIt7/view?usp=drive_link"
  },
  {
    name: "Welcome to ServiceNow Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1bbnwRr8j6F3-krGvciuDoaR_EzauIsf4/view?usp=drive_link"
  },
  {
    name: "Flows Certificate",
    issuer: "ServiceNow",
    link: "https://drive.google.com/file/d/1dZ3u4ckrBj0HYsil_aA3GDLQZcsYOZdY/view?usp=drive_link"
  },
  {
    name: "Cisco Introduction to Modern AI",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1mCDTb05dbXNSVjh-v316jbb2yBQEhuyZ/view?usp=drive_link"
  },
  {
    name: "Cisco Introduction to Cybersecurity",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/15gtQe0qFD2LvxZmaR3uh2MzP82eWdlz5/view?usp=drive_link"
  },
  {
    name: "Ideathon Certificate",
    issuer: "GITAM",
    link: "https://drive.google.com/file/d/1_5rvo9xU_axPmemFKFxNtFDnczaGPJxN/view?usp=drive_link"
  },
  {
    name: "Hackathon Certificate",
    issuer: "Kodryx AI",
    link: "https://drive.google.com/file/d/182Gml8kwnGrcv4y6_3eFgU2EVYZmKizA/view?usp=drive_link"
  },
  {
    name: "JavaScript Certificate",
    issuer: "HackerRank",
    link: "https://drive.google.com/file/d/1Nh4NQcdCIfcyZ3FmlCBNmbhOSqDHcf-E/view?usp=drive_link"
  },
  {
    name: "DSA with Java Certificate",
    issuer: "Apna College",
    link: "https://drive.google.com/file/d/1EpdqyRat2LodCusEoVlDm5zw7-KpRe5Z/view?usp=drive_link"
  },
  {
    name: "Cisco Data Science Certificate",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1BJwKNfkqXQp3diz5lbaWF7Sq0ifNiP5j/view?usp=drive_link"
  },
  {
    name: "Cisco CCNA Switching Routing and Wireless Essentials",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1S86jHz-U9kiEXM4dXDh7QsknHe4qzzuf/view?usp=drive_link"
  },
  {
    name: "Cisco CCNA: Introduction to Networks",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1TfiHGiw16K_vlKhUkj4A0d08xk2-Qzet/view?usp=drive_link"
  },
  {
    name: "Cisco CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1agYdIoY6S9lPYYXyuACMB9IU9BOj6er-/view?usp=drive_link"
  },
  {
    name: "Apply AI: Analyze Customer Reviews",
    issuer: "Cisco",
    link: "https://drive.google.com/file/d/1XGgkX33MWjnkoJkmo6aVX5yPNssU5LzP/view?usp=drive_link"
  }
];

export default function CertificationsSection() {
  const [dbCertifications, setDbCertifications] = useState<Certification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbCertifications(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.description || data.name || 'Certification', // description was used earlier as the title field in some contexts
          issuer: data.organization || data.issuer || 'Unknown',
          link: data.imageUrl || data.link || '#', // imageUrl was used for the link/image earlier
          isStatic: false
        } as Certification;
      }));
    }, (error) => console.error("Firestore read error:", error));
    return unsubscribe;
  }, []);

  const allCertifications = useMemo(() => {
    const staticCertsFormatted = staticCertificates.map((cert, index) => ({
      ...cert,
      id: `static-${index}`,
      isStatic: true
    }));
    
    // Combine and remove duplicates based on link
    const combined = [...dbCertifications, ...staticCertsFormatted];
    const unique = combined.filter((cert, index, self) => 
      index === self.findIndex((t) => t.link === cert.link)
    );
    
    return unique;
  }, [dbCertifications]);

  const issuers = useMemo(() => {
    const uniqueIssuers = Array.from(new Set(allCertifications.map(cert => cert.issuer)));
    return ['All', ...uniqueIssuers.sort()];
  }, [allCertifications]);

  const filteredCertifications = useMemo(() => {
    return allCertifications.filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIssuer = selectedIssuer === 'All' || cert.issuer === selectedIssuer;
      return matchesSearch && matchesIssuer;
    });
  }, [allCertifications, searchQuery, selectedIssuer]);

  return (
    <section id="certifications" className="py-24 px-6 relative overflow-hidden min-h-screen">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            Professional <span className="text-gradient">Certifications</span>
          </motion.h2>
          <div className="w-24 h-1.5 bg-neon-blue rounded-full mb-8" />
          
          <p className="text-white/60 max-w-2xl text-lg mb-12">
            A collection of my academic achievements, professional trainings, and technical certifications 
            from industry leaders.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-neon-blue transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search by name or issuer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all backdrop-blur-md"
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <select 
                value={selectedIssuer}
                onChange={(e) => setSelectedIssuer(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white focus:outline-none focus:border-neon-blue/50 transition-all appearance-none cursor-pointer backdrop-blur-md"
              >
                {issuers.map(issuer => (
                  <option key={issuer} value={issuer} className="bg-dark-bg text-white">{issuer}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                ▼
              </div>
            </div>
          </div>
        </div>

        {filteredCertifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-3xl"
          >
            <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-xl font-display">No certifications found matching your criteria.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCertifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="glass group rounded-3xl p-6 hover:border-neon-blue/40 transition-all duration-500 flex flex-col h-full"
                >
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:bg-neon-blue group-hover:text-dark-bg transition-all duration-500">
                      <Award size={28} />
                    </div>
                    <div className="absolute top-0 right-0 p-1">
                       <span className="text-[10px] font-mono tracking-widest uppercase opacity-20 group-hover:opacity-100 transition-opacity">
                         {cert.issuer}
                       </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold mb-2 group-hover:text-neon-blue transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-white/40 text-sm font-medium mb-6">
                      Issued by <span className="text-white/80">{cert.issuer}</span>
                    </p>
                  </div>

                  <a 
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-neon-blue hover:text-dark-bg hover:border-neon-blue transition-all duration-300 group/btn"
                  >
                    View Certificate
                    <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        <div className="mt-16 text-center">
          <p className="text-white/20 text-sm">
            Total of {filteredCertifications.length} certificates displayed
          </p>
        </div>
      </div>
    </section>
  );
}
