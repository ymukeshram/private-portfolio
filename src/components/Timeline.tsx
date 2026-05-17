import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Briefcase } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const journeyData = [
  {
    type: 'education',
    title: 'Schooling',
    organization: 'Vignan School, Hyderabad',
    date: 'June 2019 – March 2021',
    description: 'Completed 10th Class with a strong foundation in academics.',
    icon: <GraduationCap size={20} />
  },
  {
    type: 'education',
    title: 'High School (MPC)',
    organization: 'Sri Chaitanya Junior College, Hyderabad',
    date: 'June 2021 – March 2023',
    description: 'Focused on Mathematics, Physics, and Chemistry during high school studies.',
    icon: <GraduationCap size={20} />
  },
  {
    type: 'education',
    title: 'B.Tech in Data Science',
    organization: 'GITAM Deemed University, Hyderabad',
    date: 'August 2023 – June 2027',
    description: 'Pursuing Bachelor of Technology in Data Science with a focus on AI, programming, and analytical skills.',
    icon: <GraduationCap size={20} />
  }
];

function TimelineSection({ title, data }: { title: string; data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-24">
      <div className="flex flex-col items-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold mb-4"
        >
          {title.split(' ')[0]} <span className="text-gradient">{title.split(' ').slice(1).join(' ')}</span>
        </motion.h2>
        <div className="w-20 h-1 bg-neon-blue rounded-full" />
      </div>

      <div className="relative">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-blue/50 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="flex flex-col gap-12">
          {data.map((item, idx) => (
            <motion.div
              key={(item.title || item.role) + item.date}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-dark-bg border-2 border-neon-blue -translate-x-1/2 z-10 hidden md:block" />

              <div className="w-full md:w-1/2">
                <div className={`glass p-8 rounded-2xl border-l-4 ${item.type === 'experience' || item.type === 'internship' ? 'border-neon-blue' : item.type === 'education' ? 'border-neon-blue/60' : 'border-emerald-400'} hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center gap-4 mb-4">
                    {item.type !== 'achievement' && (
                      <div className="p-2 glass rounded-lg text-neon-blue">
                        {item.icon || <Briefcase size={20} />}
                      </div>
                    )}
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{item.date || item.duration}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-1">{item.title || item.role}</h3>
                  <p className="text-neon-blue text-sm font-medium mb-4">{item.organization || item.company}</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="hidden md:block w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [internships, setInternships] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const qI = query(collection(db, 'internships'), orderBy('createdAt', 'desc'));
    const unsubI = onSnapshot(qI, (snapshot) => {
      setInternships(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        type: 'internship',
        ...doc.data() 
      })));
    });

    const qA = query(collection(db, 'achievements'), orderBy('createdAt', 'desc'));
    const unsubA = onSnapshot(qA, (snapshot) => {
      setAchievements(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        type: 'achievement',
        ...doc.data() 
      })));
    });

    return () => { unsubI(); unsubA(); };
  }, []);

  const displayInternships = internships;
  const displayAchievements = achievements;

  return (
    <section id="timeline" className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-4xl mx-auto">
        <TimelineSection title="My Journey" data={journeyData} />
        <TimelineSection title="My Internships" data={displayInternships} />
        <TimelineSection title="My Achievements" data={displayAchievements} />
      </div>
    </section>
  );
}
