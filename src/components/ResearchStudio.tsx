import React, { useState } from 'react';
import { AI_RESEARCH_TOOLS } from '../data/aiCatalog.ts';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Volume2, 
  Play, 
  Pause, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Award,
  RefreshCw
} from 'lucide-react';

interface ResearchStudioProps {
  onClose: () => void;
}

interface AcademicPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  citations: number;
  consensusScore: number;
  tldr: string;
  url: string;
}

const SAMPLE_PAPERS: AcademicPaper[] = [
  {
    id: 'paper-1',
    title: 'Reinforcement Learning with Verifiable Chain-of-Thought in Large Language Models',
    authors: 'DeepSeek-AI Research & Stanford NLP',
    year: 2025,
    citations: 1840,
    consensusScore: 96,
    tldr: 'Demonstrates that pure RL reward signals without supervised fine-tuning induce emergent logical reflection, backtrack search, and near-perfect mathematical problem solving.',
    url: 'https://arxiv.org/abs/2501.12948'
  },
  {
    id: 'paper-2',
    title: 'Constitutional AI: Harmlessness from AI Feedback and Self-Correction',
    authors: 'Anthropic Research Team',
    year: 2024,
    citations: 3290,
    consensusScore: 92,
    tldr: 'Proves that models can evaluate and steer their own behavioral safety rules without constant human feedback loops.',
    url: 'https://arxiv.org/abs/2212.08073'
  },
  {
    id: 'paper-3',
    title: 'FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-Precision',
    authors: 'Tri Dao, Princeton University',
    year: 2024,
    citations: 2150,
    consensusScore: 98,
    tldr: 'Unlocks 1.5-2x speedup on Hopper GPUs by overlapping tensor-core GEMMs with asynchronous memory copies.',
    url: 'https://arxiv.org/abs/2407.08608'
  }
];

export function ResearchStudio({ onClose }: ResearchStudioProps) {
  const [selectedTool, setSelectedTool] = useState('perplexity-deep-research');
  const [query, setQuery] = useState('How does Reinforcement Learning with chain-of-thought verification (DeepSeek R1 / OpenAI o1) compare to traditional Supervised Fine-Tuning?');
  const [isSearching, setIsSearching] = useState(false);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  const [researchSummary, setResearchSummary] = useState(`### Executive Synthesis: Reasoning RL vs. Supervised Fine-Tuning

The transition to reasoning models (such as **DeepSeek R1**, **OpenAI o1/o3-mini**, and **Claude 3.7 Sonnet Thinking**) marks a fundamental departure from traditional next-token imitation learning (SFT).

#### Key Research Takeaways:
1. **Emergent Self-Correction**: When rewarded purely on verifiable outcomes (math proofs, code execution passing unit tests), models discover internal backtracking search, counterfactual verification, and "wait, let me double check" loops autonomously.
2. **Compute-Optimal Inference**: Test-time compute scaling replaces raw pretraining parameter scaling. Allocating more inference tokens generates higher accuracy curves on complex benchmarks.
3. **Consensus Score (96% Agreement)**: The academic consensus strongly confirms that outcome-based RL with long thinking tokens outperforms 10x larger base models trained on static human demonstrations.
`);

  const handleRunSearch = () => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
    }, 1400);
  };

  const handlePlayAudioOverview = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingPodcast) {
        window.speechSynthesis.cancel();
        setIsPlayingPodcast(false);
      } else {
        const text = "Welcome to the NotebookLM Deep Dive Podcast. Today we're breaking down how Reinforcement Learning and Chain-of-Thought reasoning transformed frontier AI. Host 1: It's wild how models learned to double-check their own answers without being explicitly programmed to do so. Host 2: Exactly, the verifiable reward signal is what changed everything.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingPodcast(false);
        setIsPlayingPodcast(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const activeToolObj = AI_RESEARCH_TOOLS.find(t => t.id === selectedTool) || AI_RESEARCH_TOOLS[0];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-black font-bold shadow-lg shadow-teal-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Research & Knowledge Lab</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Deep academic search & synthesis combining <strong>Perplexity, NotebookLM, Elicit, Consensus, Semantic Scholar, & SciSpace</strong>.
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
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Select AI Research Engine
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {AI_RESEARCH_TOOLS.map((tool) => {
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500/60 text-white shadow-lg shadow-teal-500/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{tool.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{tool.company}</div>
                <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-teal-400 font-mono">
                  {tool.badge.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-teal-400" />
            Deep Academic & Scientific Query
          </span>
          <span className="text-[11px] text-zinc-500">Searching 200M+ Peer-Reviewed Papers</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search complex scientific claims, papers, or hypotheses..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500/60 font-sans"
          />
          <button
            onClick={handleRunSearch}
            disabled={isSearching || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                Run Deep Research
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Synthesis Report + Right Academic Citations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Research Synthesis (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-4">
            {/* Header with NotebookLM Audio Podcast */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="font-semibold text-xs text-zinc-200">
                  {activeToolObj.name} Synthesis Report
                </span>
              </div>

              <button
                onClick={handlePlayAudioOverview}
                className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isPlayingPodcast ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>NotebookLM Audio Deep Dive</span>
              </button>
            </div>

            {/* Scientific Consensus Meter (Consensus.ai style) */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">
                  96%
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200">Scientific Consensus: High Agreement</div>
                  <div className="text-[10px] text-zinc-500">Based on 28 analyzed peer-reviewed publications</div>
                </div>
              </div>

              <div className="w-28 bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[96%]" />
              </div>
            </div>

            {/* Markdown Synthesis text */}
            <div className="prose prose-invert max-w-none text-xs text-zinc-300 space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
              {researchSummary}
            </div>
          </div>
        </div>

        {/* Right Academic Sources & Citations (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span>Grounding Sources ({SAMPLE_PAPERS.length})</span>
            <span className="text-[10px] text-teal-400 font-mono">Semantic Scholar API</span>
          </div>

          <div className="space-y-3">
            {SAMPLE_PAPERS.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-100 leading-snug">{paper.title}</h4>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-teal-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="text-[10px] text-zinc-400 flex items-center gap-3 font-mono">
                  <span>{paper.authors}</span>
                  <span>• {paper.year}</span>
                  <span className="text-teal-400">{paper.citations} Citations</span>
                </div>

                <p className="text-[11px] text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed">
                  <strong className="text-teal-400">TL;DR:</strong> {paper.tldr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
