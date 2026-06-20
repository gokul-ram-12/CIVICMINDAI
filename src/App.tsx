import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MainDashboard from './components/MainDashboard';
import SettingsModal from './components/SettingsModal';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { generateBlueprint } from './services/gemini';
import { MOCK_SPRINTS } from './services/mockBlueprints';
import type { Blueprint, FormInputs, HistoryItem } from './types/blueprint';
import { AlertOctagon, Key, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [currentInputs, setCurrentInputs] = useState<FormInputs | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Framer Motion spring values for fluid, organic "jelly" mouse following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 35, stiffness: 90 }; // Creates a laggy, fluid motion
  const jellyX = useSpring(mouseX, springConfig);
  const jellyY = useSpring(mouseY, springConfig);

  // Initialize API Key and pre-seed mock sessions on mount
  useEffect(() => {
    // 1. API Key Setup
    const savedKey = localStorage.getItem('hackforge_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else if (import.meta.env.VITE_GEMINI_API_KEY) {
      setApiKey(import.meta.env.VITE_GEMINI_API_KEY);
    }

    // 2. Pre-seed Sprints Archive if empty
    const savedHistory = localStorage.getItem('hackforge_history');
    if (!savedHistory || JSON.parse(savedHistory).length === 0) {
      const seededHistory: HistoryItem[] = MOCK_SPRINTS.map(s => ({
        id: s.id,
        timestamp: s.timestamp,
        inputs: s.inputs,
        blueprint: s.blueprint
      }));
      localStorage.setItem('hackforge_history', JSON.stringify(seededHistory));
      
      // Default set active blueprint to the first mock sprint (EcoTrack AI) to prevent empty load
      setBlueprint(seededHistory[0].blueprint);
      setCurrentInputs(seededHistory[0].inputs);
    }
  }, []);

  // Global mousemove tracker mapping coordinate values to the jelly follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by 300px (half of jelly-glow's width) to center on cursor
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('hackforge_api_key', key);
  };

  const handleGenerate = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    setCurrentInputs(inputs);

    try {
      const generated = await generateBlueprint(inputs, apiKey);
      setBlueprint(generated);
      setView('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to complete project plan compilation. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentInputs) {
      handleGenerate(currentInputs);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Spring-lagged Jelly Follower (shines through glass panels in background) */}
      <motion.div
        style={{
          x: jellyX,
          y: jellyY,
        }}
        className="jelly-glow"
      />

      {/* Error Callout Display */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm animate-fade-in no-print">
          <div className="w-full max-w-lg luxury-glass p-6 border border-white/10 bg-white/[0.02] shadow-2xl space-y-6 text-center animate-slide-up">
            <div className="flex justify-center">
              <div className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white">
                <AlertOctagon className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="editorial-heading text-lg text-white">Compilation Fault</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                The Gemini AI Engine encountered an issue generating your plan. This is commonly caused by an invalid API key, network latency, or safety blockers.
              </p>
            </div>

            <div className="p-3.5 bg-black rounded-2xl border border-white/5 text-left font-mono text-[9px] text-zinc-500 break-words leading-relaxed max-h-32 overflow-y-auto">
              {error}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setError(null);
                  setIsSettingsOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Key className="w-4 h-4" />
                <span>Configure API Key</span>
              </button>
              
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Generation</span>
              </button>

              <button
                onClick={() => setError(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-transparent text-zinc-500 hover:text-zinc-300 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Router with transitions */}
      <div className="flex-grow">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {view === 'landing' ? (
              <motion.div
                key="landing-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <LandingPage
                  onEnterApp={() => setView('dashboard')}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  hasKey={!!apiKey}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Exit to Landing Page */}
                <div className="absolute top-4 left-4 z-20 sm:left-6 no-print">
                  <button
                    onClick={() => setView('landing')}
                    className="px-3.5 py-1.5 rounded-lg border border-white/8 bg-black hover:bg-white/5 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Landing Page</span>
                  </button>
                </div>

                <MainDashboard
                  initialBlueprint={blueprint}
                  initialInputs={currentInputs}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}
