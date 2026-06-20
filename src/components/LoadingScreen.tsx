import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const STAGES = [
  { text: 'Analyzing Theme & Guidelines', subtitle: 'Scanning hackathon prompt constraints...' },
  { text: 'Researching Opportunities', subtitle: 'Analyzing market viability and AI innovation angles...' },
  { text: 'Designing Architecture', subtitle: 'Constructing microservice layouts and file schemas...' },
  { text: 'Generating Roadmap', subtitle: 'Building detailed development sprints and timeframes...' },
  { text: 'Preparing Winning Strategy', subtitle: 'Formulating pitching guidelines and judge perspectives...' }
];

export default function LoadingScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage transition timer
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    // Speed progression bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 98) {
          const increment = prev < 40 ? 1.5 : prev < 75 ? 0.8 : 0.2;
          return prev + increment;
        }
        return prev;
      });
    }, 80);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] p-6 no-print">
      {/* Background Cinematic Grids */}
      <div className="cinematic-grid" />
      <div className="spotlight-glow" />

      <div className="w-full max-w-md text-center space-y-12 relative z-10">
        
        {/* Animated Spin Loop */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center w-16 h-16 rounded-full border border-white/5 bg-white/[0.02]"
          >
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          </motion.div>
        </div>

        {/* Text transition container */}
        <div className="h-20 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h3 className="editorial-heading text-xl md:text-2xl text-white">
                {STAGES[currentStage].text}
              </h3>
              <p className="text-[11px] text-zinc-500 font-light tracking-wide">
                {STAGES[currentStage].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-3">
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            <span>Progress: {Math.round(progress)}%</span>
            <span className="animate-pulse">Active Synthesis</span>
          </div>
        </div>

        {/* Generation Milestones */}
        <div className="space-y-3.5 pt-6 border-t border-white/5 text-left max-w-xs mx-auto">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStage;
            const isActive = idx === currentStage;
            
            return (
              <div 
                key={idx}
                className={`flex items-center space-x-3.5 transition-all duration-500 ${
                  isCompleted ? 'opacity-30 scale-95' : isActive ? 'opacity-100 scale-100' : 'opacity-10'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full border transition-all ${
                  isCompleted 
                    ? 'border-white bg-white' 
                    : isActive 
                      ? 'border-white/50 bg-white/10' 
                      : 'border-white/5 bg-transparent'
                }`} />
                <span className={`text-[11px] font-medium tracking-wide ${
                  isCompleted 
                    ? 'text-zinc-400 line-through decoration-zinc-600' 
                    : isActive 
                      ? 'text-white font-bold' 
                      : 'text-zinc-500'
                }`}>
                  {stage.text.split(' ')[0]} {stage.text.split(' ').slice(1).join(' ')}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
