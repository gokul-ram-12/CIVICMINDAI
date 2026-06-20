import { useState } from 'react';
import type { FormInputs } from '../types/blueprint';
import CustomSelect from './CustomSelect';
import { 
  Sparkles, 
  AlertCircle
} from 'lucide-react';

interface InputFormProps {
  onSubmit: (inputs: FormInputs) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: '🌱 Sustainability',
    theme: 'AI Eco-Footprint Tracker & Waste sorter app',
    timeLimit: '24 Hours',
    teamSize: 3,
    skills: 'React, Tailwind CSS, Gemini API, Node.js, Supabase',
    goal: 'Winning' as const
  },
  {
    name: '🏥 Healthcare',
    theme: 'Personalized AI Patient Triage & Medication Tracker',
    timeLimit: '48 Hours',
    teamSize: 4,
    skills: 'React, Vite, Express, Python, MongoDB, Gemini API',
    goal: 'MVP' as const
  },
  {
    name: '🤖 AI Agents',
    theme: 'Autonomic Multi-Agent Collaborative Task Solver',
    timeLimit: '48 Hours',
    teamSize: 2,
    skills: 'React, Python, FastAPI, LangChain, Gemini API, PostgreSQL',
    goal: 'Startup Idea' as const
  },
  {
    name: '🎓 Education',
    theme: 'Gamified AI Storybook Generator for Children\'s Literacy',
    timeLimit: '36 Hours',
    teamSize: 2,
    skills: 'React, Tailwind CSS, Firebase, Gemini Vision, TypeScript',
    goal: 'Learning' as const
  },
  {
    name: '🏙️ Smart Cities',
    theme: 'AI-Powered Smart Parking Spot Allocation & Energy Grid Grid',
    timeLimit: '72 Hours',
    teamSize: 5,
    skills: 'React, Node.js, Express, Socket.io, AWS, MongoDB',
    goal: 'Social Impact' as const
  },
  {
    name: '💳 FinTech',
    theme: 'AI Micro-Lending and Risk Analysis for Street Vendors',
    timeLimit: '24 Hours',
    teamSize: 1,
    skills: 'React, Express, Tailwind, PostgreSQL, Stripe API',
    goal: 'Winning' as const
  },
  {
    name: '🚜 Agriculture',
    theme: 'Smart Soil Nutrient Monitor & AI Irrigation Planner',
    timeLimit: '48 Hours',
    teamSize: 3,
    skills: 'React, Python, Django, SQLite, Raspberry Pi APIs',
    goal: 'MVP' as const
  }
];

const TIME_OPTIONS = [
  { value: '24 Hours', label: '24 Hours' },
  { value: '36 Hours', label: '36 Hours' },
  { value: '48 Hours', label: '48 Hours' },
  { value: '72 Hours', label: '72 Hours' },
  { value: '1 Week', label: '1 Week' }
];

const TEAM_SIZE_OPTIONS = [
  { value: '1', label: '1 (Solo)' },
  { value: '2', label: '2 Members' },
  { value: '3', label: '3 Members' },
  { value: '4', label: '4 Members' },
  { value: '5', label: '5 Members' }
];

const GOAL_OPTIONS = [
  { value: 'Winning', label: 'Winning (High Innovation)' },
  { value: 'Learning', label: 'Learning (Tech Discovery)' },
  { value: 'MVP', label: 'MVP (Working Core Product)' },
  { value: 'Social Impact', label: 'Social Impact (Solve Problems)' },
  { value: 'Startup Idea', label: 'Startup Idea (Commercial Value)' }
];

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [theme, setTheme] = useState('');
  const [timeLimit, setTimeLimit] = useState('24 Hours');
  const [teamSize, setTeamSize] = useState(3);
  const [skills, setSkills] = useState('');
  const [goal, setGoal] = useState<FormInputs['goal']>('Winning');
  const [error, setError] = useState('');

  const THEME_LIMIT = 100;
  const SKILLS_LIMIT = 150;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTheme(preset.theme);
    setTimeLimit(preset.timeLimit);
    setTeamSize(preset.teamSize);
    setSkills(preset.skills);
    setGoal(preset.goal);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theme.trim()) {
      setError('Please provide a hackathon theme or project idea.');
      return;
    }
    if (!skills.trim()) {
      setError('Please list some team skills or technologies.');
      return;
    }

    setError('');
    onSubmit({
      theme: theme.trim(),
      timeLimit,
      teamSize,
      skills: skills.trim(),
      goal
    });
  };

  return (
    <div className="w-full space-y-6 no-print">
      {/* Templates Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Preset Scenarios
        </label>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pb-1">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1.5 rounded-xl border border-white/5 bg-white/3 text-[11px] font-medium text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer select-none"
            >
              {preset.name.split(' ')[0]} {preset.name.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="luxury-glass p-5 space-y-4">
        {/* Error Callout */}
        {error && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-2 text-zinc-300 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Hackathon Theme */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
              <span>Theme / Project Idea</span>
            </label>
            <span className="text-[9px] text-zinc-600">
              {theme.length}/{THEME_LIMIT}
            </span>
          </div>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value.slice(0, THEME_LIMIT))}
            placeholder="Describe the challenge theme..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/8 rounded-xl text-white placeholder-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 transition-all font-light"
          />
        </div>

        {/* Available Time & Team Size (Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Time Available
            </label>
            <CustomSelect
              value={timeLimit}
              onChange={(val) => setTimeLimit(val)}
              options={TIME_OPTIONS}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Team Size
            </label>
            <CustomSelect
              value={String(teamSize)}
              onChange={(val) => setTeamSize(Number(val))}
              options={TEAM_SIZE_OPTIONS}
            />
          </div>
        </div>

        {/* Skills / Technology Stack */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
              <span>Technologies / Skills</span>
            </label>
            <span className="text-[9px] text-zinc-600">
              {skills.length}/{SKILLS_LIMIT}
            </span>
          </div>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value.slice(0, SKILLS_LIMIT))}
            placeholder="React, Python, Gemini..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/8 rounded-xl text-white placeholder-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 transition-all font-light"
          />
        </div>

        {/* Hackathon Goal */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Sprint Objective
          </label>
          <CustomSelect
            value={goal}
            onChange={(val) => setGoal(val as FormInputs['goal'])}
            options={GOAL_OPTIONS}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 active:scale-97 cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-black" />
          <span>Generate Project Plan</span>
        </button>
      </form>
    </div>
  );
}
