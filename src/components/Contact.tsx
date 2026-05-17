import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            Get In <span className="text-gradient">Touch</span>
          </motion.h2>
          <div className="w-20 h-1 bg-neon-blue rounded-full" />
        </div>

        <div className="grid lg:grid-cols-1 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-display font-bold mb-8">Let's build something amazing together</h3>
            <p className="text-white/60 mb-12 text-lg max-w-2xl">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="p-4 glass rounded-2xl text-neon-blue group-hover:neon-border transition-all">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Email Me</p>
                  <p className="text-lg font-medium">Ymukeshram@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="p-4 glass rounded-2xl text-neon-blue group-hover:neon-border transition-all">
                  <Phone size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Call Me</p>
                  <p className="text-lg font-medium">+91 6305966488</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="p-4 glass rounded-2xl text-emerald-400 group-hover:neon-border transition-all">
                  <MapPin size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Location</p>
                  <p className="text-lg font-medium">Hyderabad, India</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              {[
                { icon: <Github size={24} />, href: 'https://github.com/ymukeshram' },
                { icon: <Linkedin size={24} />, href: 'https://linkedin.com/in/mukesh-yenduri' },
                { icon: <Mail size={24} />, href: 'mailto:Ymukeshram@gmail.com' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="p-5 glass rounded-2xl text-white/70 hover:text-neon-blue hover:neon-border transition-all"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
