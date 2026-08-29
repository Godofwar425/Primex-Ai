import React, { useState } from 'react';
import { AI_WRITING_TOOLS } from '../data/aiCatalog.ts';
import { 
  PenTool, 
  Sparkles, 
  CheckCheck, 
  FileText, 
  Copy, 
  Check, 
  LayoutTemplate, 
  Wand2, 
  Download, 
  Layers, 
  Target, 
  Flame,
  RefreshCw
} from 'lucide-react';

interface WritingStudioProps {
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'seo-blog', name: 'SEO Blog Post (Writesonic)', desc: 'High-ranking structured article with keywords and headings' },
  { id: 'executive-summary', name: 'Executive Memo (Notion AI)', desc: 'Concise corporate briefing with bulleted action items' },
  { id: 'sales-email', name: 'Cold Sales Pitch (Copy.ai)', desc: 'Compelling email sequence with high conversion rate' },
  { id: 'brand-ad', name: 'Viral Ad Copy (Jasper AI)', desc: 'Attention-grabbing social headlines & marketing copy' },
  { id: 'visual-card', name: 'Canva Design Card', desc: 'Graphic social slide layout with bold quote typography' }
];

export function WritingStudio({ onClose }: WritingStudioProps) {
  const [selectedTool, setSelectedTool] = useState('grammarly-ai');
  const [selectedTemplate, setSelectedTemplate] = useState('seo-blog');
  const [tone, setTone] = useState<'authoritative' | 'conversational' | 'inspirational' | 'concise'>('authoritative');
  const [prompt, setPrompt] = useState('Write a comprehensive guide on how multimodal AI agents are revolutionizing software development and creative industries.');
  const [documentContent, setDocumentContent] = useState(`## The Autonomous Revolution: How Multimodal AI Transforms Modern Engineering

In 2026, artificial intelligence transitioned from static text prediction to fully autonomous multimodal agents. These systems don't merely generate code snippets—they simulate complete system architectures, orchestrate deployment containers, and verify their own operational correctness in real time.

### Key Paradigm Shifts:
1. **Unified Reasoning & Execution**: Models now synthesize code, preview artifacts in sandbox canvases, and execute regression tests without human bottlenecks.
2. **Context Expansion**: Frontier models ingest entire 2-million token multi-repository codebases in a single prompt.
3. **Cross-Modality Synthesis**: Real-time voice interaction, procedural music composition, and cinematic 4K video rendering have merged into a single developer cockpit.

> "The true developer superpower is no longer syntax memorization, but system orchestration and architectural vision."
`);

  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ words: 125, readingTime: '1 min', readability: 'Grade 11 (Professional)' });

  const handleApplyToolAction = (action: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      if (action === 'polish') {
        setDocumentContent(prev => 
          prev.replace('In 2026, artificial intelligence transitioned', 'By 2026, advanced artificial intelligence has definitively transitioned')
        );
      } else if (action === 'expand') {
        setDocumentContent(prev => prev + `\n\n### Strategic Implications for Enterprises\nOrganizations adopting autonomous developer agents observe a 4x reduction in cycle time and near-zero regression defect rates across complex microservice architectures.`);
      } else if (action === 'summarize') {
        setDocumentContent(prev => `**TL;DR Executive Summary:**\nAutonomous multimodal AI agents have revolutionized software engineering by uniting reasoning, artifact rendering, and containerized testing into an integrated workflow, quadrupling engineering velocity.`);
      }

      // Update word count stats
      const wordCount = documentContent.split(/\s+/).filter(Boolean).length;
      setStats({
        words: wordCount,
        readingTime: `${Math.ceil(wordCount / 200)} min`,
        readability: 'Grade 12 (Executive)'
      });

      setIsProcessing(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeToolObj = AI_WRITING_TOOLS.find(t => t.id === selectedTool) || AI_WRITING_TOOLS[0];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
              <PenTool className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Writing & Productivity Suite</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Unified productivity suite combining <strong>Grammarly, Jasper, Copy.ai, Notion AI, Writesonic, Writer, & Canva AI</strong>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium self-start sm:self-auto transition-all"
        >
          Back to Hub
        </button>
      </div>

      {/* Tool Selector Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Select AI Writing Assistant
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {AI_WRITING_TOOLS.map((tool) => {
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{tool.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{tool.company}</div>
                <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-amber-400 font-mono">
                  {tool.badge.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Templates & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Generator Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <Wand2 className="w-4 h-4 text-amber-400" />
              Content Generation Topic
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="What would you like the AI writing assistant to craft?"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
            />

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Select Tone</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['authoritative', 'conversational', 'inspirational', 'concise'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs capitalize transition-all ${
                      tone === t
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleApplyToolAction('expand')}
              disabled={isProcessing}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Draft with {activeToolObj.name}
                </>
              )}
            </button>
          </div>

          {/* Productivity Templates */}
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2.5">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
              Productivity Blueprints
            </div>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex flex-col gap-0.5 text-xs transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-amber-500/10 border-amber-500/60 text-white font-medium'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-zinc-200">{tmpl.name}</div>
                  <div className="text-[10px] text-zinc-500">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Rich Document Editor & Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[560px]">
          {/* Action Toolbar */}
          <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleApplyToolAction('polish')}
                disabled={isProcessing}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 font-semibold flex items-center gap-1 text-[11px]"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Grammarly Polish
              </button>
              <button
                onClick={() => handleApplyToolAction('expand')}
                disabled={isProcessing}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-medium flex items-center gap-1 text-[11px]"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Jasper Expand
              </button>
              <button
                onClick={() => handleApplyToolAction('summarize')}
                disabled={isProcessing}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-medium flex items-center gap-1 text-[11px]"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Notion Summarize
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([documentContent], { type: 'text/markdown' });
                  element.href = URL.createObjectURL(file);
                  element.download = 'article.md';
                  document.body.appendChild(element);
                  element.click();
                }}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                title="Download Markdown"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Textarea Document */}
          <textarea
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            className="flex-1 w-full bg-[#0d0d10] p-5 text-xs font-sans text-zinc-200 leading-relaxed resize-none focus:outline-none border-none selection:bg-amber-500/30 selection:text-white"
          />

          {/* Real-Time Telemetry Stats Bar */}
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <div className="flex items-center gap-4">
              <span>Words: <strong className="text-zinc-200">{stats.words}</strong></span>
              <span>Reading: <strong className="text-zinc-200">{stats.readingTime}</strong></span>
              <span>Level: <strong className="text-amber-400">{stats.readability}</strong></span>
            </div>
            <span className="text-zinc-500">Autonomous Assistant Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
