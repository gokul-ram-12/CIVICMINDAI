import type { JudgePerspective } from '../types/blueprint';
import { 
  Trophy, 
  Lightbulb, 
  TrendingUp, 
  Terminal, 
  Sparkles,
  Play
} from 'lucide-react';

interface JudgePerspectiveViewProps {
  data: JudgePerspective;
}

export default function JudgePerspectiveView({ data }: JudgePerspectiveViewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Standout Box */}
      <div className="relative luxury-glass p-6 border border-white/10 bg-white/[0.02]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl shrink-0 shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
              Winning Pitch Secret
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Why this Project Stands Out</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {data.standoutReason}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Judging Criteria Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Innovation Points */}
        <div className="luxury-glass p-5 space-y-4">
          <div className="flex items-center space-x-2.5 text-zinc-300">
            <Lightbulb className="w-4 h-4" />
            <h4 className="font-bold text-white text-[10px] uppercase tracking-widest">Innovation Points</h4>
          </div>
          <div className="space-y-2">
            {data.innovationPoints.map((point, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl border border-white/5 bg-white/[0.005]">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-white/5 border border-white/10 text-white text-[10px] font-semibold shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Value */}
        <div className="luxury-glass p-5 space-y-3.5">
          <div className="flex items-center space-x-2.5 text-zinc-300">
            <TrendingUp className="w-4 h-4" />
            <h4 className="font-bold text-white text-[10px] uppercase tracking-widest">Business & Market Value</h4>
          </div>
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.005] text-xs text-zinc-300 leading-relaxed font-light">
            {data.businessValue}
          </div>
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
            Monetization & Impact metrics
          </div>
        </div>

        {/* Technical Depth */}
        <div className="luxury-glass p-5 space-y-3.5">
          <div className="flex items-center space-x-2.5 text-zinc-300">
            <Terminal className="w-4 h-4" />
            <h4 className="font-bold text-white text-[10px] uppercase tracking-widest">Technical Depth</h4>
          </div>
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-zinc-300 leading-relaxed font-mono font-light">
            {data.technicalDepth}
          </div>
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
            Algorithmic complexities & APIs
          </div>
        </div>

        {/* Demo Strategy */}
        <div className="luxury-glass p-5 space-y-3.5">
          <div className="flex items-center space-x-2.5 text-zinc-300">
            <Play className="w-4 h-4" />
            <h4 className="font-bold text-white text-[10px] uppercase tracking-widest">Demo Impact Guide</h4>
          </div>
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.005] text-xs text-zinc-300 leading-relaxed font-light">
            {data.demoImpact}
          </div>
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
            WOW factors & Seeded demo data
          </div>
        </div>
      </div>

      {/* Quick Judge Checklist */}
      <div className="p-4 border border-white/5 bg-white/[0.005] rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <span className="text-[10px] font-medium tracking-wide text-zinc-400">
            Pitch deck ready? Synthesize these points directly for your presentation slides.
          </span>
        </div>
      </div>
    </div>
  );
}
