import { useState, useEffect } from 'react';
import type { Blueprint, FormInputs, HistoryItem } from '../types/blueprint';
import InputForm from './InputForm';
import ArchitectureDiagram from './ArchitectureDiagram';
import TimelinePlanner from './TimelinePlanner';
import JudgePerspectiveView from './JudgePerspectiveView';
import CustomSelect from './CustomSelect';
import { formatBlueprintToMarkdown } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  History, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Brain,
  ShieldCheck,
  AlertTriangle,
  FolderTree,
  Sparkles,
  Trash2,
  Search,
  ArrowRight,
  Plus,
  Layers,
  Users,
  Settings,
  Trophy,
  FolderClosed,
  ChevronRight,
  HeartPulse,
  Leaf,
  GraduationCap,
  Building,
  Clock
} from 'lucide-react';

interface MainDashboardProps {
  initialBlueprint: Blueprint | null;
  initialInputs: FormInputs | null;
  onGenerate: (inputs: FormInputs) => void;
  isLoading: boolean;
}

export default function MainDashboard({ 
  initialBlueprint, 
  initialInputs, 
  onGenerate, 
  isLoading
}: MainDashboardProps) {
  // View states: 'archive' | 'new' | 'templates' | 'team' | 'settings' | 'active'
  const [viewState, setViewState] = useState<'archive' | 'new' | 'templates' | 'team' | 'settings' | 'active'>('archive');
  const [blueprint, setBlueprint] = useState<Blueprint | null>(initialBlueprint);
  const [inputs, setInputs] = useState<FormInputs | null>(initialInputs);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'architecture' | 'timeline' | 'judge'>('blueprint');

  // Search & Filters for Sprints Archive
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('All Themes');
  const [sortBy, setSortBy] = useState('Latest');
  
  // History & Interaction state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [expandedFeatures, setExpandedFeatures] = useState<Record<number, boolean>>({});

  // Sync new blueprints when generated
  useEffect(() => {
    if (initialBlueprint) {
      setBlueprint(initialBlueprint);
      setViewState('active'); // auto-redirect to active view
    }
    if (initialInputs) setInputs(initialInputs);
  }, [initialBlueprint, initialInputs]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hackforge_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [viewState]);

  const handleSelectHistory = (item: HistoryItem) => {
    setBlueprint(item.blueprint);
    setInputs(item.inputs);
    setViewState('active');
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('hackforge_history', JSON.stringify(updated));
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('hackforge_history');
  };

  const toggleFeature = (idx: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Exporters
  const exportAsMarkdown = () => {
    if (!blueprint || !inputs) return;
    const md = formatBlueprintToMarkdown(blueprint, inputs);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${blueprint.projectName.replace(/\s+/g, '_')}_Blueprint.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    if (!blueprint) return;
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${blueprint.projectName.replace(/\s+/g, '_')}_Config.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort history list
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.blueprint.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.inputs.theme.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.inputs.skills.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = themeFilter === 'All Themes' || item.inputs.goal === themeFilter || item.blueprint.projectName.includes(themeFilter);
    return matchesSearch && matchesTheme;
  }).sort((_a, _b) => {
    if (sortBy === 'Latest') {
      return 0;
    } else {
      return -1;
    }
  });

  // Get icons matching category in grid with custom glass styles and tints
  const getCategoryIconDetails = (projectName: string) => {
    const name = projectName.toLowerCase();
    const iconClass = "w-4.5 h-4.5";
    if (name.includes('eco') || name.includes('carbon')) {
      return {
        icon: <Leaf className={`${iconClass} text-emerald-400`} />,
        containerClass: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
      };
    }
    if (name.includes('medi') || name.includes('health')) {
      return {
        icon: <HeartPulse className={`${iconClass} text-indigo-400`} />,
        containerClass: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
      };
    }
    if (name.includes('edu') || name.includes('learn')) {
      return {
        icon: <GraduationCap className={`${iconClass} text-purple-400`} />,
        containerClass: "bg-purple-500/10 border border-purple-500/20 text-purple-400"
      };
    }
    if (name.includes('fin') || name.includes('credit') || name.includes('risk')) {
      return {
        icon: <Sparkles className={`${iconClass} text-amber-400`} />,
        containerClass: "bg-amber-500/10 border border-amber-500/20 text-amber-400"
      };
    }
    return {
      icon: <Building className={`${iconClass} text-cyan-400`} />,
      containerClass: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
    };
  };

  const getCategoryLabel = (id: string, goal: string) => {
    if (id === 'eco-track') return 'Sustainability';
    if (id === 'medi-mate') return 'Healthcare';
    if (id === 'edu-forge') return 'Education';
    if (id === 'fin-vision') return 'FinTech';
    if (id === 'smart-city') return 'Smart Cities';
    return goal;
  };

  // Radial Score Ring SVG (Grayscale apple styling)
  const RadialScoreRing = ({ score, label }: { score: number; label: string }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center justify-center p-3 border border-white/5 bg-white/[0.005] rounded-2xl relative overflow-hidden">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-white/5 fill-none"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-white/70 fill-none"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
              strokeDasharray={circumference}
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-white">
            {score}%
          </span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mt-2 text-center truncate w-full">
          {label}
        </span>
      </div>
    );
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // Mock preset templates details
  const TEMPLATES_LIST = [
    { name: 'Sustainability Grid', category: 'Environment', theme: 'AI Carbon Footprint auditor', skills: 'React, Tailwind CSS, Gemini API', desc: 'Audit greenhouse emissions through OCR files.', goal: 'Winning' as const },
    { name: 'Healthcare Triage', category: 'Medical', theme: 'AI clinical check-in telemetry', skills: 'React, Express, Python, MongoDB', desc: 'Remote health tracker with automatic pain alerts.', goal: 'MVP' as const },
    { name: 'SmartCity IoT', category: 'Urban Infrastructure', theme: 'IoT Traffic light optimization', skills: 'React, Node, Express, Socket.io', desc: 'Dynamic municipal vehicle routing simulator.', goal: 'Social Impact' as const },
    { name: 'AI Collaborative Agents', category: 'Machine Learning', theme: 'Multi-Agent collaboratives system', skills: 'React, FastApi, LangChain, Postgres', desc: 'Orchestrate cooperative digital workers.', goal: 'Startup Idea' as const },
    { name: 'Micro-Lending Risk', category: 'FinTech', theme: 'Peer-to-peer alternative sales credit rating', skills: 'React, Tailwind, Express, SQLite', desc: 'Credit evaluations for merchant microloans.', goal: 'Winning' as const }
  ];

  const themeFilterOptions = [
    { value: 'All Themes', label: 'All Themes' },
    { value: 'Winning', label: 'Winning Goal' },
    { value: 'MVP', label: 'MVP Goal' },
    { value: 'Learning', label: 'Learning Goal' }
  ];

  const sortOptions = [
    { value: 'Latest', label: 'Latest' },
    { value: 'Oldest', label: 'Oldest' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-8 min-h-[85vh] rounded-[28px] border border-white/5 bg-black/45 backdrop-blur-3xl flex overflow-hidden shadow-2xl relative z-10 no-print">
      
      {/* LEFT SIDEBAR (Apple-styled persistent panel) */}
      <aside className="w-72 border-r border-white/5 bg-white/[0.005] p-6 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center space-x-3 pb-2 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest leading-none">HackForge AI</h2>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1 block">Co-Founder Workspace</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => setViewState('archive')}
              className={`w-full p-3 rounded-xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                viewState === 'archive' 
                  ? 'bg-white/5 border border-white/10 text-white' 
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide leading-none">Sprints Archive</p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 truncate">Your past project blueprints</p>
              </div>
            </button>

            <button
              onClick={() => setViewState('new')}
              className={`w-full p-3 rounded-xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                viewState === 'new' 
                  ? 'bg-white/5 border border-white/10 text-white' 
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide leading-none">New Blueprint</p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 truncate">Generate winning project</p>
              </div>
            </button>

            <button
              onClick={() => setViewState('templates')}
              className={`w-full p-3 rounded-xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                viewState === 'templates' 
                  ? 'bg-white/5 border border-white/10 text-white' 
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide leading-none">Templates</p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 truncate">Explore idea templates</p>
              </div>
            </button>

            <button
              onClick={() => setViewState('team')}
              className={`w-full p-3 rounded-xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                viewState === 'team' 
                  ? 'bg-white/5 border border-white/10 text-white' 
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide leading-none">Team Hub</p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 truncate">Collaborate with your team</p>
              </div>
            </button>

            <button
              onClick={() => setViewState('settings')}
              className={`w-full p-3 rounded-xl flex items-center space-x-3.5 transition-all text-left cursor-pointer ${
                viewState === 'settings' 
                  ? 'bg-white/5 border border-white/10 text-white' 
                  : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-black border border-white/5 shrink-0">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-wide leading-none">Settings</p>
                <p className="text-[9px] text-zinc-500 font-light mt-0.5 truncate">Personalize your workspace</p>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Pro Card */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.01] space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2.5 opacity-20">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-1.5">
              <span>Upgrade to Pro</span>
            </h4>
            <p className="text-[10px] text-zinc-500 font-light leading-relaxed">
              Unlock unlimited blueprints, priority AI generation & more.
            </p>
          </div>
          <button className="w-full py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest text-white transition-all cursor-pointer">
            Upgrade Now →
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE PANEL (spans remaining width, scrollable) */}
      <main className="flex-1 p-8 overflow-y-auto max-h-[85vh] relative z-10">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: SPRINTS ARCHIVE GRID */}
          {viewState === 'archive' && (
            <motion.div
              key="archive-workspace"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="space-y-8"
            >
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="editorial-heading text-2xl md:text-3xl text-white">Sprints Archive</h2>
                  <p className="text-xs text-zinc-500 font-light mt-1">Revisit your past hackathon blueprints and insights.</p>
                </div>

                {/* Right Profile Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewState('new')}
                    className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-950 hover:from-zinc-700 hover:to-zinc-900 border border-white/10 text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Blueprint</span>
                  </button>

                  <div className="flex items-center space-x-2.5 p-1 px-3.5 rounded-full border border-white/5 bg-white/[0.01]">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                      AS
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[10px] font-bold text-white">Anmol S.</p>
                      <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Free Plan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.005] p-3 border border-white/5 rounded-2xl">
                {/* Search sprints input */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your sprints..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/5 rounded-xl text-white placeholder-zinc-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all font-light"
                  />
                </div>
                {/* Dropdowns */}
                <div className="flex items-center space-x-3 w-full md:w-auto z-20">
                  <CustomSelect
                    value={themeFilter}
                    onChange={(val) => setThemeFilter(val)}
                    options={themeFilterOptions}
                    className="w-full md:w-40"
                  />

                  <CustomSelect
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    options={sortOptions}
                    className="w-full md:w-28"
                  />
                </div>
              </div>

              {/* Sprints Grid (EcoTrack, MediMate, EduForge, etc.) */}
              {filteredHistory.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredHistory.map((item) => {
                    const details = getCategoryIconDetails(item.blueprint.projectName);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistory(item)}
                        className="luxury-glass p-5 flex flex-col justify-between min-h-[220px] transition-all cursor-pointer relative group"
                      >
                        {/* Close / delete handle */}
                        <button
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black border border-white/5 text-zinc-600 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        {/* Top Info */}
                        <div className="space-y-4">
                          {/* Custom Category Icon & Title */}
                          <div className="flex items-center space-x-3">
                            <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center w-10 h-10 ${details.containerClass}`}>
                              {details.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white tracking-tight leading-none">
                                {item.blueprint.projectName}
                              </h3>
                              <span className="text-[11px] text-zinc-500 mt-1 block">
                                {getCategoryLabel(item.id, item.inputs.goal)}
                              </span>
                            </div>
                          </div>

                          {/* Summary description */}
                          <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-3">
                            {item.blueprint.tagline}
                          </p>
                        </div>

                        {/* Bottom Info Row */}
                        <div className="flex items-center justify-between mt-6 pt-2 text-[11px] font-medium text-zinc-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.timestamp}</span>
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <Users className="w-3.5 h-3.5 shrink-0" />
                              <span>Team of {item.inputs.teamSize}</span>
                            </span>
                          </div>

                          {/* Arrow Link circle */}
                          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shrink-0">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Drag slot card at the end */}
                  <div className="border border-dashed border-white/15 bg-white/[0.005] rounded-[24px] p-6 flex flex-col items-center justify-center text-center min-h-[220px] space-y-3 cursor-default">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center">
                      <FolderClosed className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white tracking-tight">Drag any sprint here</p>
                      <p className="text-[10px] text-zinc-500 font-light leading-relaxed max-w-[140px] mx-auto">
                        to organize your workspace
                      </p>
                    </div>
                  </div>

                </div>

                {/* Pagination Row */}
                <div className="flex items-center justify-center space-x-2 mt-8 pt-4">
                  <button className="w-8 h-8 rounded-lg border border-white/5 bg-black hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#6366f1] text-white font-bold text-xs flex items-center justify-center transition-all">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-white/5 bg-black hover:bg-white/5 text-zinc-400 hover:text-white font-medium text-xs flex items-center justify-center transition-all cursor-pointer">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-white/5 bg-black hover:bg-white/5 text-zinc-400 hover:text-white font-medium text-xs flex items-center justify-center transition-all cursor-pointer">
                    3
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-white/5 bg-black hover:bg-white/5 text-zinc-500 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
                /* Empty Grid State */
                <div className="luxury-glass p-12 text-center flex flex-col items-center justify-center min-h-[350px] space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-center">
                    <History className="w-5 h-5 text-zinc-600 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold tracking-tight text-white">No Sprints Found</h3>
                    <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-light">
                      Start a new sprint session in the sidebar to generate your first project blueprint plan.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW 2: NEW BLUEPRINT GENERATOR */}
          {viewState === 'new' && (
            <motion.div
              key="new-blueprint-view"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2 mb-6">
                <h2 className="editorial-heading text-2xl md:text-3xl text-white">Generate Co-Founder Blueprint</h2>
                <p className="text-xs text-zinc-500 font-light">Configure your hackathon parameters to initiate the Gemini planner.</p>
              </div>
              <InputForm onSubmit={onGenerate} isLoading={isLoading} />
            </motion.div>
          )}

          {/* VIEW 3: TEMPLATES VIEW */}
          {viewState === 'templates' && (
            <motion.div
              key="templates-view"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="space-y-8"
            >
              <div>
                <h2 className="editorial-heading text-2xl md:text-3xl text-white">Project Templates</h2>
                <p className="text-xs text-zinc-500 font-light mt-1">Quick-start templates designed after premium SaaS applications.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TEMPLATES_LIST.map((tpl, idx) => (
                  <div
                    key={idx}
                    className="luxury-glass p-5 flex flex-col justify-between min-h-[200px]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">{tpl.category}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                          {tpl.goal}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">{tpl.name}</h3>
                        <p className="text-[11px] text-zinc-500 font-light leading-relaxed mt-2">{tpl.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onGenerate({
                          theme: tpl.theme,
                          timeLimit: '48 Hours',
                          teamSize: 3,
                          skills: tpl.skills,
                          goal: tpl.goal
                        });
                      }}
                      className="w-full py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer mt-4"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIEW 4: TEAM HUB VIEW */}
          {viewState === 'team' && (
            <motion.div
              key="team-hub-view"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="space-y-8"
            >
              <div>
                <h2 className="editorial-heading text-2xl md:text-3xl text-white">Team Hub</h2>
                <p className="text-xs text-zinc-500 font-light mt-1">Collaborate with your team members in a shared glass workspace.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Team Members List */}
                <div className="luxury-glass p-6 md:col-span-7 space-y-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2">Active Members</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.005] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">AS</div>
                        <div>
                          <p className="text-xs font-semibold text-white">Anmol S. (You)</p>
                          <p className="text-[9px] text-zinc-500">Workspace Owner</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Online</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.005] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs font-semibold text-zinc-400 shrink-0">SK</div>
                        <div>
                          <p className="text-xs font-semibold text-white">Sarah K.</p>
                          <p className="text-[9px] text-zinc-500">UI/UX Designer</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded">Invited</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.005] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs font-semibold text-zinc-400 shrink-0">LN</div>
                        <div>
                          <p className="text-xs font-semibold text-white">Liam N.</p>
                          <p className="text-[9px] text-zinc-500">Backend Engineer</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded">Invited</span>
                    </div>
                  </div>
                </div>

                {/* Team invites form */}
                <div className="luxury-glass p-6 md:col-span-5 space-y-4 h-fit">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2">Invite Collaborators</h3>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                    Share this unique token with your hackathon team members to let them connect and view the live blueprint in sync.
                  </p>
                  
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="forge-session-xyz-4912"
                      className="w-full pl-3 pr-10 py-2 bg-black border border-white/5 rounded-xl text-white text-xs focus:outline-none font-mono text-zinc-400"
                    />
                    <button
                      onClick={() => handleCopyText('forge-session-xyz-4912', 'token')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                    >
                      {copiedStates['token'] ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 5: SETTINGS VIEW */}
          {viewState === 'settings' && (
            <motion.div
              key="settings-view"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="max-w-xl mx-auto space-y-8"
            >
              <div>
                <h2 className="editorial-heading text-2xl md:text-3xl text-white">Workspace Settings</h2>
                <p className="text-xs text-zinc-500 font-light mt-1">Configure your workspace defaults and clean storage files.</p>
              </div>

              <div className="luxury-glass p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Local Credentials</h3>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                    HackForge AI stores blueprints in your browser's Local Storage. Clearing this will delete all saved sessions.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">Sprint Archive Count</p>
                    <p className="text-[10px] text-zinc-500 font-light">Current cached blueprints: {history.length}</p>
                  </div>

                  <button
                    onClick={handleClearHistory}
                    disabled={history.length === 0}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 disabled:border-zinc-800 disabled:text-zinc-600 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Clear Archives
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 6: ACTIVE WORKSPACE (Tabbed view for loaded blueprint) */}
          {viewState === 'active' && blueprint && (
            <motion.div
              key="active-blueprint-view"
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Center Area (Tabbed Workspace - span 8) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Back button and title */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setViewState('archive')}
                    className="px-3.5 py-1.5 rounded-lg border border-white/8 bg-black hover:bg-white/5 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>← Back to Archive</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                      Active Board
                    </span>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 p-0.5 rounded-xl bg-white/3 border border-white/5">
                  {(['blueprint', 'architecture', 'timeline', 'judge'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-white text-black font-semibold'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tab === 'judge' ? 'Judge Perspective' : tab}
                    </button>
                  ))}
                </div>

                {/* Workspace Content */}
                <div className="space-y-6">
                  {/* TAB 1: BLUEPRINT */}
                  {activeTab === 'blueprint' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Title block */}
                      <div className="luxury-glass p-6 relative overflow-hidden">
                        <div className="space-y-2.5 max-w-[85%]">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            Blueprint Output
                          </span>
                          <h2 className="editorial-heading text-2xl sm:text-4xl text-white">{blueprint.projectName}</h2>
                          <p className="text-xs text-zinc-500 italic font-light">{blueprint.tagline}</p>
                        </div>

                        <div className="mt-5 pt-5 border-t border-white/5">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Elevator Pitch</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-light">{blueprint.elevatorPitch}</p>
                        </div>
                      </div>

                      {/* Problem & Solution */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="luxury-glass p-5 space-y-2">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Problem Statement</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-light">{blueprint.problemStatement}</p>
                        </div>

                        <div className="luxury-glass p-5 space-y-2">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Solution Overview</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-light">{blueprint.solutionOverview}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Core Features</span>
                        <div className="space-y-3">
                          {blueprint.coreFeatures.map((feat, idx) => {
                            const isExpanded = !!expandedFeatures[idx];
                            return (
                              <div key={idx} className="luxury-glass overflow-hidden">
                                <div 
                                  onClick={() => toggleFeature(idx)}
                                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.01] transition-all select-none"
                                >
                                  <span className="text-xs font-semibold text-white flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    <span>{feat.title}</span>
                                  </span>
                                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                </div>
                                {isExpanded && (
                                  <div className="p-4 border-t border-white/5 bg-white/[0.005] text-xs text-zinc-400 leading-relaxed font-light animate-fade-in">
                                    {feat.description}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="luxury-glass p-5 space-y-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Tech Stack Blueprint</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {blueprint.techStack.map((tech, idx) => (
                            <div key={idx} className="p-3 border border-white/5 bg-white/[0.005] rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-white">{tech.name}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                                    {tech.category}
                                  </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 leading-relaxed font-light">{tech.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Folder Structure */}
                      <div className="luxury-glass overflow-hidden">
                        <div className="p-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-2">
                            <FolderTree className="w-4 h-4 text-zinc-400" />
                            <span>Repository Structure</span>
                          </span>
                          <button
                            onClick={() => handleCopyText(blueprint.folderStructure, 'folders')}
                            className="px-2 py-1 rounded border border-white/8 bg-white/3 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center space-x-1"
                          >
                            {copiedStates['folders'] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedStates['folders'] ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[10px] font-mono text-zinc-400 leading-relaxed max-h-72 bg-black">
                          {blueprint.folderStructure}
                        </pre>
                      </div>

                      {/* Deployment */}
                      <div className="luxury-glass p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Deployment Plan</span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-white uppercase tracking-widest">
                            {blueprint.deployment.provider}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {blueprint.deployment.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-400 font-light">
                              <span className="font-bold text-white shrink-0">{idx + 1}.</span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: ARCHITECTURE */}
                  {activeTab === 'architecture' && (
                    <ArchitectureDiagram data={blueprint.architecture} />
                  )}

                  {/* TAB 3: TIMELINE */}
                  {activeTab === 'timeline' && (
                    <TimelinePlanner timeline={blueprint.timeline} />
                  )}

                  {/* TAB 4: JUDGE perspective */}
                  {activeTab === 'judge' && (
                    <JudgePerspectiveView data={blueprint.judgePerspective} />
                  )}
                </div>
              </div>

              {/* Right Panel (Metrics & Exports - span 4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Export Options */}
                <div className="luxury-glass p-5 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                    Export Workspace
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={exportAsMarkdown}
                      className="w-full py-2.5 px-3 bg-black hover:bg-white/[0.02] border border-white/8 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Save Markdown Doc</span>
                    </button>
                    <button
                      onClick={exportAsJSON}
                      className="w-full py-2.5 px-3 bg-black hover:bg-white/[0.02] border border-white/8 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Config JSON</span>
                    </button>
                    <button
                      onClick={exportAsMarkdown} // Fallback project summary
                      className="w-full py-2.5 px-3 bg-black hover:bg-white/[0.02] border border-white/8 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Save Project Summary</span>
                    </button>
                  </div>
                </div>

                {/* AI Scores metrics */}
                <div className="luxury-glass p-5 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2">
                    SaaS Feasibility Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <RadialScoreRing score={blueprint.scores.innovation} label="Innovation" />
                    <RadialScoreRing score={blueprint.scores.feasibility} label="Feasibility" />
                    <RadialScoreRing score={blueprint.scores.judgeAppeal} label="Appeal" />
                    <RadialScoreRing score={blueprint.scores.complexity} label="Complexity" />
                  </div>
                  <div className="w-full">
                    <RadialScoreRing score={blueprint.scores.marketPotential} label="Market Potential" />
                  </div>
                </div>

                {/* Winning Probability Audit */}
                <div className="luxury-glass p-5 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Sprint SWOT Audit</span>
                  </h4>

                  <div className="space-y-4 text-xs font-light">
                    {/* Strengths */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-white flex items-center space-x-1 uppercase text-[8px] tracking-widest">
                        <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                        <span>Strengths</span>
                      </span>
                      <div className="space-y-1 pl-2.5">
                        {blueprint.winningProbability.strengths.slice(0, 3).map((st, i) => (
                          <p key={i} className="text-zinc-400 text-[11px] leading-relaxed font-light">- {st}</p>
                        ))}
                      </div>
                    </div>

                    {/* Threats & Risks */}
                    <div className="space-y-1.5 border-t border-white/5 pt-3">
                      <span className="font-bold text-zinc-500 flex items-center space-x-1.5 uppercase text-[8px] tracking-widest">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Threats & Risks</span>
                      </span>
                      <div className="space-y-1 pl-2.5">
                        {blueprint.winningProbability.weaknesses.slice(0, 2).map((we, i) => (
                          <p key={i} className="text-zinc-500 text-[11px] leading-relaxed font-light">- {we}</p>
                        ))}
                        {blueprint.winningProbability.risks.slice(0, 2).map((ri, i) => (
                          <p key={i} className="text-zinc-500 text-[11px] leading-relaxed font-light">- {ri}</p>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-1.5 border-t border-white/5 pt-3">
                      <span className="font-bold text-zinc-300 flex items-center space-x-1 uppercase text-[8px] tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        <span>Enhancements</span>
                      </span>
                      <div className="space-y-1 pl-2.5">
                        {blueprint.winningProbability.improvements.slice(0, 3).map((im, i) => (
                          <p key={i} className="text-zinc-400 text-[11px] leading-relaxed font-light">- {im}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
