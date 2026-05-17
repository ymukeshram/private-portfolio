import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-dark-bg flex flex-col items-center justify-center"
    >
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-neon-blue/20 border-t-neon-blue rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border-2 border-white/10 border-b-white/40 rounded-full"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <span className="text-xl font-display font-bold tracking-[0.5em] text-gradient">INITIALIZING</span>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.8)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
