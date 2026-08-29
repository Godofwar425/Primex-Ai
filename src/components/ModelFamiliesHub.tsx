import React, { useState } from 'react';
import { AI_MODEL_FAMILIES } from '../data/aiCatalog.ts';
import { 
  Boxes, 
  Sparkles, 
  Cpu, 
  Award, 
  BarChart3, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Flame,
  Globe
} from 'lucide-react';

interface ModelFamiliesHubProps {
  onSelectModelForChat: (modelId: string) => void;
  onClose: () => void;
}

export function ModelFamiliesHub({ onSelectModelForChat, onClose }: ModelFamiliesHubProps) {
  const [selectedFamilyId, setSelectedFamilyId] = useState('family-claude');

  const activeFamily = AI_MODEL_FAMILIES.find(f => f.id === selectedFamilyId) || AI_MODEL_FAMILIES[0];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold">
              <Boxes className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Major AI Model Families & Frontier Hub</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
              12 Global Model Architectures
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Compare architectures and benchmark matrices for <strong>GPT, Claude, Gemini, Llama, Mistral, DeepSeek, Qwen, Grok, Gemma, Command, Phi, & o-Series</strong>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium self-start sm:self-auto transition-all"
        >
          Back to Hub
        </button>
      </div>

      {/* Grid of all 12 Model Families */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AI_MODEL_FAMILIES.map((family) => {
          const isSelected = selectedFamilyId === family.id;
          return (
            <div
              key={family.id}
              onClick={() => setSelectedFamilyId(family.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-white">{family.name}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {family.company}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">
                  {family.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>MMLU: <strong className="text-blue-400">{family.benchmarks.mmlu}</strong></span>
                <span>Math: <strong className="text-emerald-400">{family.benchmarks.math}</strong></span>
                <span>Code: <strong className="text-amber-400">{family.benchmarks.coding}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Family */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 space-y-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{activeFamily.name} Deep Architecture</h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                {activeFamily.company}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              {activeFamily.description}
            </p>
          </div>

          <button
            onClick={() => onSelectModelForChat(activeFamily.models[0].toLowerCase().replace(/\s+/g, '-'))}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch in Chat Workspace
          </button>
        </div>

        {/* Model Variants in this Family */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Available Models in this Family ({activeFamily.models.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {activeFamily.models.map((modelName) => (
              <div
                key={modelName}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center font-mono text-xs text-zinc-200"
              >
                <div className="font-semibold">{modelName}</div>
                <div className="text-[9px] text-emerald-400 mt-1">Unlimited Free Access</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Radar Comparison */}
        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-zinc-400">MMLU General Knowledge</div>
            <div className="text-xl font-bold text-blue-400">{activeFamily.benchmarks.mmlu}</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: activeFamily.benchmarks.mmlu }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-zinc-400">GSM8K & MATH Benchmark</div>
            <div className="text-xl font-bold text-emerald-400">{activeFamily.benchmarks.math}</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: activeFamily.benchmarks.math }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-zinc-400">HumanEval Code Generation</div>
            <div className="text-xl font-bold text-amber-400">{activeFamily.benchmarks.coding}</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: activeFamily.benchmarks.coding }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
