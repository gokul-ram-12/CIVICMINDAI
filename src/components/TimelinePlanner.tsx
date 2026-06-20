import { useState } from 'react';
import type { TimelineStage } from '../types/blueprint';
import { Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelinePlannerProps {
  timeline: TimelineStage[];
}

export default function TimelinePlanner({ timeline }: TimelinePlannerProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleTask = (stageIdx: number, taskIdx: number) => {
    const key = `${stageIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleStage = (idx: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const totalTasks = timeline.reduce((acc, stage) => acc + stage.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Metric */}
      <div className="luxury-glass p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">Development Roadmap Sprints</h3>
            <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Check off milestones in real-time as your team builds</p>
          </div>
        </div>

        {/* Progress gauge */}
        <div className="flex items-center space-x-3.5 w-full sm:w-auto">
          <div className="flex-1 sm:w-44 bg-white/5 border border-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white shrink-0 min-w-[50px] text-right uppercase tracking-wider">
            {progressPercent}% Built
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Central Vertical Connector Line */}
        <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-[1px] bg-white/10 pointer-events-none" />

        {timeline.map((stage, sIdx) => {
          const isExpanded = !!expandedStages[sIdx];
          const stageTasks = stage.tasks;
          const stageCompletedCount = stageTasks.filter((_, tIdx) => !!completedTasks[`${sIdx}-${tIdx}`]).length;
          const isStageFinished = stageCompletedCount === stageTasks.length && stageTasks.length > 0;

          return (
            <div key={sIdx} className="relative group">
              {/* Timeline Bullet Node */}
              <div 
                className={`absolute left-[-21px] sm:left-[-25px] top-2 flex items-center justify-center w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] rounded-full border transition-all duration-300 z-10 cursor-pointer ${
                  isStageFinished 
                    ? 'border-white bg-white text-black scale-110 shadow-sm' 
                    : stageCompletedCount > 0
                      ? 'border-white/60 bg-white/20'
                      : 'border-white/10 bg-black group-hover:border-white/40'
                }`}
                onClick={() => toggleStage(sIdx)}
              />

              {/* Card Container */}
              <div className="luxury-glass overflow-hidden">
                {/* Stage Header */}
                <div 
                  onClick={() => toggleStage(sIdx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.01] transition-all select-none bg-white/[0.01]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-300 font-bold rounded text-[9px] uppercase tracking-widest shrink-0">
                      {stage.stage}
                    </span>
                    <h4 className="font-semibold text-white text-xs sm:text-sm truncate tracking-tight">
                      {stage.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      {stageCompletedCount}/{stageTasks.length} Done
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </div>

                {/* Stage Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-white/5 bg-white/[0.005] space-y-2 animate-fade-in">
                    {stageTasks.map((task, tIdx) => {
                      const isDone = !!completedTasks[`${sIdx}-${tIdx}`];
                      
                      return (
                        <div 
                          key={tIdx}
                          onClick={() => toggleTask(sIdx, tIdx)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                            isDone 
                              ? 'border-white/5 bg-white/[0.01] text-zinc-500 hover:bg-white/[0.02]' 
                              : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01] text-zinc-300'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isDone ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : (
                              <div className="w-4 h-4 border border-white/15 rounded bg-black" />
                            )}
                          </div>
                          <span className={`text-xs leading-relaxed font-light ${isDone ? 'line-through text-zinc-600' : ''}`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
