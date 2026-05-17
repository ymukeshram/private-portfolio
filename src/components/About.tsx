import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { label: 'Projects Completed', value: 5, suffix: '+' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-display font-bold text-neon-blue">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            About <span className="text-gradient">Me</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue/20 to-neon-blue/10 rounded-2xl blur-2xl group-hover:opacity-100 transition-opacity opacity-50" />
            <div className="glass p-2 rounded-2xl relative overflow-hidden">
              <img 
                src="/mukesh.jpeg" 
                alt="Mukesh Ram" 
                className="rounded-xl w-full h-auto transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold mb-6 text-neon-blue">
              Passionate Data Science Student & AI Enthusiast
            </h3>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              I am a Data Science undergraduate with hands-on experience in AI-driven automation and machine learning systems. 
              With a strong foundation in Data Structures and Algorithms, I am focused on building efficient, automated solutions 
              that solve real-world problems.
            </p>
            <p className="text-white/70 leading-relaxed mb-10 text-lg">
              Currently pursuing my B.Tech in Data Science at GITAM Deemed University, I've gained practical experience 
              as an AI & ML Engineer Intern at Relai.world, where I specialized in streamlining processes using n8n 
              and cloud-based tools. I am passionate about pushing the boundaries of AI to create seamless user experiences.
            </p>

            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <span className="text-xs uppercase tracking-widest text-white/40 mt-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
