import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, ShieldAlert, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function SettingsModal({ isOpen, onClose, onSave, currentKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in no-print">
      <div className="w-full max-w-md luxury-glass overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm tracking-tight text-white uppercase tracking-widest">Engine API Key</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 bg-black/40">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-10 py-2.5 bg-black border border-white/8 rounded-xl text-white placeholder-zinc-800 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-xs transition-all font-light"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-600 hover:text-zinc-300 transition-all"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-light leading-relaxed">
              Saved locally in your browser's <code className="px-1 py-0.5 bg-white/5 rounded border border-white/5 font-mono text-zinc-400">localStorage</code>. Credentials are sent directly to Google API endpoints.
            </p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-start space-x-3">
            <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-zinc-400 leading-relaxed font-light">
              <span className="font-semibold text-white">Security:</span> Access to <strong>Gemini 2.5 Pro/Flash</strong> is recommended. Check your billing status or usage tiers on Google AI Studio if errors persist.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saved}
              className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-97 cursor-pointer"
            >
              {saved ? (
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-black" />
                  <span>Saved</span>
                </span>
              ) : (
                'Save Config'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
