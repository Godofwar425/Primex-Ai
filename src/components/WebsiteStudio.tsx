import React, { useState } from 'react';
import { 
  Sparkles, Layout, Globe, ArrowRight, Loader2, Palette, Zap, 
  Smartphone, Code, CheckCircle, Flame, Layers
} from 'lucide-react';
import { WEBSITE_TEMPLATES } from '../data/defaults.ts';
import { generateWebsiteRapid } from '../services/apiClient.ts';
import { Artifact } from '../types/index.ts';
import confetti from 'canvas-confetti';

interface WebsiteStudioProps {
  onWebsiteGenerated: (artifact: Artifact) => void;
  onClose?: () => void;
}

export const WebsiteStudio: React.FC<WebsiteStudioProps> = ({
  onWebsiteGenerated,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('modern-dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themes = [
    { id: 'modern-dark', name: 'Dark Luxe', color: 'bg-zinc-900 border-zinc-700' },
    { id: 'claude-terracotta', name: 'Claude Warmth', color: 'bg-amber-950 border-amber-700' },
    { id: 'neon-cyberpunk', name: 'Cyber Neon', color: 'bg-purple-950 border-purple-600' },
    { id: 'emerald-fintech', name: 'Emerald Clean', color: 'bg-emerald-950 border-emerald-700' },
    { id: 'minimal-light', name: 'Minimalist Bright', color: 'bg-zinc-100 border-zinc-300 text-zinc-900' }
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await generateWebsiteRapid(textToUse, selectedTheme);
      if (res.error) {
        throw new Error(res.error);
      }

      const newArtifact: Artifact = {
        id: `web-${Date.now()}`,
        identifier: `web-app-${Date.now()}`,
        title: res.title || 'Generated Website App',
        type: 'html',
        language: 'html',
        content: res.html,
        createdAt: Date.now(),
        version: 1
      };

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      onWebsiteGenerated(newArtifact);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate website');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-zinc-200">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Website & App Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-serif">
          Generate Full-Stack Web Apps in Seconds
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Describe anything you want to create—landing pages, interactive analytics dashboards, playable browser games, or responsive productivity tools. Claude writes 100% complete code with real Tailwind CSS and live reactivity.
        </p>
      </div>

      {/* Generator Prompt Box */}
      <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-10">
        <label htmlFor="website-prompt-input" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Describe the website or web application you want to build
        </label>
        <div className="relative mb-4">
          <textarea
            id="website-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build an AI copywriting studio with a live editor, character counter, tone switcher, and exported markdown preview..."
            rows={3}
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 resize-none"
          />
        </div>

        {/* Theme Selector & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              Theme:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedTheme === t.id
                      ? 'border-amber-500 text-amber-300 bg-amber-950/40 shadow-sm'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 bg-zinc-900/60'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Website Code...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Build & Launch Canvas</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Instant Ready-To-Build Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Or Launch from High-Craft Templates
            </h3>
          </div>
          <span className="text-xs text-zinc-500">1-Click Instant Generation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEBSITE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleGenerate(tpl.prompt)}
              className="group relative bg-[#18181c] hover:bg-[#1f1f25] border border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {tpl.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-amber-200 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Code className="w-3 h-3 text-zinc-400" />
                  HTML5 • Tailwind • JS
                </span>
                <span className="text-amber-400 font-medium group-hover:underline">
                  Launch &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
