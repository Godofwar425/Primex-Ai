import React from 'react';
import { 
  X, Brain, Sliders, Sparkles, ShieldAlert, Cpu, 
  Terminal, CheckCircle, Zap
} from 'lucide-react';
import { UserSettings } from '../types/index.ts';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const personas = [
    {
      id: 'autonomous-builder',
      name: 'Autonomous Software Engineer & Architect',
      desc: 'Builds full production-grade applications, writes complete codebases with zero omission or placeholders.',
      prompt: 'You are an elite principal software architect and full-stack engineer. Always output 100% complete, fully implemented code. Never use placeholders or truncation. Ensure maximum aesthetic polish and responsive interactivity.'
    },
    {
      id: 'deep-researcher',
      name: 'Deep Technical Researcher & Scientist',
      desc: 'Performs exhaustive analysis, mathematical derivations, algorithmic benchmarking, and systematic reasoning.',
      prompt: 'You are an advanced researcher and technical analyst. Formulate structured proofs, analyze edge cases thoroughly, and provide deep citations and rigorous evaluations.'
    },
    {
      id: 'website-craftsman',
      name: 'Creative UI/UX Designer & Web Builder',
      desc: 'Specialized in crafting breathtaking modern interfaces, micro-animations, glassmorphic layouts, and responsive designs.',
      prompt: 'You are a master creative director and frontend craftsperson. Focus on visual hierarchy, Tailwind styling, micro-interactions, responsive containers, and modern design aesthetics.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181c] border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Engine & Directives</h3>
              <p className="text-xs text-zinc-400">Configure Claude reasoning depth, autonomous execution, and persona.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs text-zinc-300">
          {/* 1. Deep Thinking & Reasoning Mode */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-zinc-100 text-sm">Deep Reasoning (Thinking Mode)</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, thinkingMode: !settings.thinkingMode })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.thinkingMode ? 'bg-amber-600' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    settings.thinkingMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Enables Claude to formulate step-by-step internal chains of thought before executing complex code generation, mathematical proofs, or system architectures.
            </p>
          </div>

          {/* 2. Unlimited Autonomous Mode */}
          <div className="bg-zinc-950/80 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-current" />
                <span className="font-semibold text-amber-200 text-sm">Unrestricted Autonomous Builder</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Empowers Claude to fulfill technical coding and building requests with zero artificial limits, maximum depth, complete uninterrupted files, and unrestricted full-stack artifact generation.
            </p>
          </div>

          {/* 3. Preset Persona Selector */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-2">
              Persona & Technical Specialization
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {personas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onUpdateSettings({ ...settings, customSystemPrompt: p.prompt })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    settings.customSystemPrompt === p.prompt
                      ? 'bg-amber-950/30 border-amber-500/80 text-amber-100'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-zinc-100">{p.name}</h4>
                    {settings.customSystemPrompt === p.prompt && (
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Custom Directives Textarea */}
          <div>
            <label className="block font-semibold text-zinc-200 mb-1">
              Custom System Instructions & Guidelines
            </label>
            <textarea
              rows={4}
              value={settings.customSystemPrompt}
              onChange={(e) => onUpdateSettings({ ...settings, customSystemPrompt: e.target.value })}
              placeholder="e.g. Always respond with TypeScript and Tailwind CSS, create full HTML artifacts for web apps..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            />
          </div>

          {/* 5. Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-zinc-200">Creativity / Temperature</label>
              <span className="font-mono text-amber-400 font-semibold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => onUpdateSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>Precise & Deterministic (0.0)</span>
              <span>Balanced (0.7)</span>
              <span>Highly Creative (1.0)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-5 mt-6 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-900/20"
          >
            Apply Directives
          </button>
        </div>
      </div>
    </div>
  );
};
