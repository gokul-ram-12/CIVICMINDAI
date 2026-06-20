import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Layers, 
  Clock, 
  Trophy, 
  Download, 
  Github,
  Zap,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenSettings: () => void;
  hasKey: boolean;
}

export default function LandingPage({ onEnterApp, onOpenSettings, hasKey }: LandingPageProps) {
  // Stagger animation variants for cinematic entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(12px)' },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: custom * 0.3,
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] text-zinc-100 no-print">

      {/* Header / Navbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/10"
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 shadow-lg">
            <BrainCircuit className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            HackForge<span className="text-zinc-500 font-light">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenSettings}
            className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
              hasKey 
                ? 'border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10' 
                : 'border-white/20 bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-zinc-400' : 'bg-white animate-pulse'}`} />
            <span>{hasKey ? 'Gemini Engine Active' : 'Enter API Key'}</span>
          </button>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center text-center flex-grow"
      >
        {/* Launch Badge */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/8 bg-white/3 text-zinc-400 text-xs font-medium tracking-wide"
        >
          <Zap className="w-3 h-3 text-white" />
          <span>Google AI Studio & Gemini Engine Integration</span>
        </motion.div>

        {/* Large Cinematic Positioned Text: Plan, Build, Ship */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center my-6 md:my-10 text-7xl md:text-[9.5rem] font-light leading-none tracking-tighter select-none">
          <motion.span 
            variants={wordVariants}
            custom={0}
            className="editorial-heading text-zinc-600 block md:inline"
          >
            Plan.
          </motion.span>
          <motion.span 
            variants={wordVariants}
            custom={1}
            className="editorial-heading bg-gradient-to-b from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent block md:inline"
          >
            Build.
          </motion.span>
          <motion.span 
            variants={wordVariants}
            custom={2}
            className="editorial-heading text-zinc-400 block md:inline"
          >
            Ship.
          </motion.span>
        </div>

        {/* Tagline & Subheading */}
        <motion.h2 
          variants={itemVariants}
          className="text-2xl md:text-3xl font-light text-zinc-300 tracking-tight mb-4"
        >
          Your AI Co-Founder For Hackathons
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="max-w-xl text-sm md:text-base text-zinc-500 font-light leading-relaxed mb-12"
        >
          An editorial blueprint builder for developers. Generate repository frameworks, visual architecture nodes, milestone roadmaps, and judge pitch documents in a single dark workspace.
        </motion.p>

        {/* CTA Actions */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm mb-20"
        >
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-semibold transition-all duration-300 shadow-xl shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {!hasKey && (
            <button
              onClick={onOpenSettings}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0a0a0c] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Configure API Key
            </button>
          )}
        </motion.div>

        {/* Trust Badges & Stats */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-5xl py-8 border-y border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-24 bg-white/[0.01] backdrop-blur-sm rounded-[28px] px-6"
        >
          <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-0">
            <span className="text-3xl font-bold text-white mb-1.5 tracking-tighter">
              1,000+
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Blueprints Generated
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-0">
            <span className="text-3xl font-bold text-white mb-1.5 tracking-tighter">
              50+
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Stacks Supported
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 last:border-0">
            <span className="text-3xl font-bold text-white mb-1.5 tracking-tighter">
              100%
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Co-Founder Planning
            </span>
          </div>
        </motion.div>

        {/* Premium Product Grid Cards (Apple style) */}
        <section className="w-full max-w-6xl mb-12">
          <motion.h3 
            variants={itemVariants}
            className="editorial-heading text-2xl md:text-4xl text-white mb-3"
          >
            Showcase.
          </motion.h3>
          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 max-w-md mx-auto mb-16 text-xs font-light"
          >
            Crafted with Stripe's precision layout and Apple's micro-details for hackathon sprints.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">Interactive Visual Architecture</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Map complex services into visual nodes (Client → API → Storage → AI Engine). Graph pipelines update instantly with selected components.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">Hour-by-Hour Roadmap</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Receive granular timelines broken into active milestone stages. Mark items as completed to sync progress bars in real-time.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">Judge Perspective Audit</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Review innovation vectors, business validation, depth, and demo strategies to guarantee high marks on pitch day.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">AI Confidence Indices</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Score your concept on complexity, judge appeal, and feasibility with circular gauges designed after expensive dashboard software.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">Winning Probability Analysis</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Analyze core project strengths, dev risks, and weaknesses alongside structural code improvements.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="luxury-glass spotlight-card p-7 rounded-[28px]"
            >
              <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-white mb-6">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-tight">Structured Exporters</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Download structured Markdown blueprints, JSON config presets, or save beautiful PDF briefs via native A4 browser layouts.
              </p>
            </motion.div>
          </div>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-xs gap-4 bg-black/10 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-zinc-700" />
          <span>Curated for Vercel, Linear, & OpenAI Launch design schemes.</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} HackForge AI. Apple/Stripe-level craftsmanship.</span>
        </div>
      </footer>
    </div>
  );
}
