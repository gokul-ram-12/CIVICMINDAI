import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  dropdownAlign?: 'left' | 'right';
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  className = '',
  dropdownAlign = 'left'
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/8 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest cursor-pointer flex items-center justify-between hover:border-white/25 hover:bg-black/80 transition-all"
      >
        <span className="truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder || 'Select Option'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </div>

      {/* Options Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 min-w-[180px] w-full mt-2 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl p-1.5 shadow-2xl space-y-0.5 overflow-hidden ${
              dropdownAlign === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all ${
                  opt.value === value
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
