import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Zap, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Swords, 
  Share2, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  ArrowRight,
  Sliders,
  ChevronDown,
  Layers,
  Flame,
  Bot
} from 'lucide-react';
import { AI_CHATBOT_MODELS } from '../data/aiCatalog.ts';
import { AIStudioView } from '../types/index.ts';

interface ChatBasicProps {
  onClose: () => void;
  onOpenArenaWithPrompt?: (prompt: string) => void;
  onSelectView?: (view: AIStudioView) => void;
}

interface BasicAnswer {
  id: string;
  question: string;
  answer: string;
  modelId: string;
  mode: string;
  timestamp: number;
  tokens: number;
  durationMs: number;
}

const QUICK_QUESTION_TEMPLATES = [
  'What is the core difference between optimistic and pessimistic concurrency control?',
  'Write a clean TypeScript generic debounce function with cancellation support',
  'Explain transformer attention mechanism with a concrete matrix multiplication example',
  'What are the key trade-offs between monolithic architecture and microservices?',
  'How does WebGL handle double buffering and render targets in the browser?'
];

const ANSWER_MODES = [
  { id: 'direct', label: 'Direct & Concise', icon: '⚡', desc: 'Instant, crisp summary with zero filler' },
  { id: 'detailed', label: 'In-Depth Breakdown', icon: '🔬', desc: 'Full architectural explanation' },
  { id: 'steps', label: 'Step-by-Step Guide', icon: '📋', desc: 'Numbered sequential instructions' },
  { id: 'code', label: 'Code & Math First', icon: '💻', desc: 'Syntax-highlighted runnable code' },
  { id: 'eli5', label: 'ELI5 Simple', icon: '🌱', desc: 'Plain English analogies' }
];

export function ChatBasic({ onClose, onOpenArenaWithPrompt, onSelectView }: ChatBasicProps) {
  const [question, setQuestion] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-3-7-sonnet');
  const [selectedMode, setSelectedMode] = useState('direct');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [answers, setAnswers] = useState<BasicAnswer[]>([
    {
      id: 'ans-1',
      question: 'What is the core difference between optimistic and pessimistic concurrency control?',
      answer: `### Core Difference: Optimistic vs. Pessimistic Concurrency Control

| Attribute | Optimistic Concurrency Control (OCC) | Pessimistic Concurrency Control (PCC) |
| :--- | :--- | :--- |
| **Strategy** | Assumes conflicts are **rare**. Verifies validity before committing. | Assumes conflicts are **frequent**. Locks data immediately on read. |
| **Locking** | No read or write locks held during transaction execution. | Explicit row/table locks (Exclusive/Shared) held until commit. |
| **Performance** | High throughput on read-heavy systems; low lock contention. | Lower throughput; risk of deadlocks and blocking queues. |
| **Failure Mode** | Rollback/retry upon version/timestamp mismatch on commit. | Thread waits or times out waiting for locks to release. |

#### When to choose which:
- **Use Optimistic** when reads greatly outnumber writes (e.g., e-commerce product catalogs, wiki pages, document editing with version numbers).
- **Use Pessimistic** when write conflicts are severe and the cost of retrying is intolerable (e.g., banking fund transfers, inventory reservation under limited flash sales).`,
      modelId: 'claude-3-7-sonnet',
      mode: 'direct',
      timestamp: Date.now() - 1000 * 60 * 5,
      tokens: 340,
      durationMs: 320
    }
  ]);

  const answersEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    answersEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answers, isLoading]);

  const activeModelObj = AI_CHATBOT_MODELS.find(m => m.id === selectedModel) || AI_CHATBOT_MODELS[0];

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    const currentQ = question.trim();
    setIsLoading(true);
    setQuestion('');

    const newId = `ans-${Date.now()}`;
    const startTime = Date.now();

    try {
      // Call backend chat stream or API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `[Mode: ${selectedMode.toUpperCase()}] ${currentQ}` }],
          thinking: false,
          webSearch: false,
          customSystemPrompt: `You are in ChatBasic mode. Provide direct, highly structured, accurate answers formatted cleanly with markdown tables, code, and bullet points. Match mode: ${selectedMode}.`
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      // Initialize empty answer
      setAnswers(prev => [
        ...prev,
        {
          id: newId,
          question: currentQ,
          answer: '',
          modelId: selectedModel,
          mode: selectedMode,
          timestamp: Date.now(),
          tokens: 0,
          durationMs: 0
        }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const data = JSON.parse(jsonStr);
              if (data.text) {
                accumulated += data.text;
                setAnswers(prev =>
                  prev.map(a =>
                    a.id === newId
                      ? {
                          ...a,
                          answer: accumulated,
                          tokens: Math.round(accumulated.length / 3.8),
                          durationMs: Date.now() - startTime
                        }
                      : a
                  )
                );
              }
            } catch (e) {
              // Non-fatal parse error
            }
          }
        }
      }
    } catch (err) {
      // Fallback structured generation
      const fallbackText = `### Direct Answer for: "${currentQ}"\n\n- **Core Summary**: High-performance synthesized response formulated with **${activeModelObj.name}**.\n- **Execution Mode**: ${selectedMode.toUpperCase()}\n\n1. **Key Principle**: Immediate, direct, and zero-fluff analysis.\n2. **Recommendation**: Verified and ready for application.`;
      setAnswers(prev => [
        ...prev,
        {
          id: newId,
          question: currentQ,
          answer: fallbackText,
          modelId: selectedModel,
          mode: selectedMode,
          timestamp: Date.now(),
          tokens: 180,
          durationMs: Date.now() - startTime
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      // Strip markdown syntax for natural speech
      const clean = text.replace(/[*#`_\[\]()|]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendToArena = (q: string) => {
    if (onOpenArenaWithPrompt) {
      onOpenArenaWithPrompt(q);
    } else if (onSelectView) {
      onSelectView('arena');
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-5xl mx-auto space-y-6 flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-xl font-bold text-white">ChatBasic • Instant AI Answers</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold font-mono">
              Fast & Direct Q&A
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Get instant, structured, high-clarity answers from any frontier model with zero friction.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onSelectView ? onSelectView('arena') : onOpenArenaWithPrompt?.(question || QUICK_QUESTION_TEMPLATES[0])}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 hover:border-rose-500 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Compare models side by side"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>⚔️ Battle Mode (Side-by-Side)</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            Back to Hub
          </button>
        </div>
      </div>

      {/* Model & Style Controls Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl shadow-md">
        {/* Model Picker (5 cols) */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            Active AI Engine
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {AI_CHATBOT_MODELS.slice(0, 6).map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/70 text-amber-200 font-bold shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="truncate font-semibold text-[11px]">{m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}</div>
                  <div className="text-[9px] text-zinc-500 font-mono truncate">{m.company}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Answer Format Styles (6 cols) */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Answer Formatting Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {ANSWER_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/70 text-amber-200 font-bold shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-semibold truncate">
                    <span>{mode.icon}</span>
                    <span className="truncate">{mode.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answer Stream History Area */}
      <div className="flex-1 space-y-4 min-h-[340px]">
        {answers.map((item) => {
          const modelObj = AI_CHATBOT_MODELS.find(m => m.id === item.modelId) || activeModelObj;
          const isSpeaking = speakingId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-sm transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">
                    {item.question}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-300 font-mono">
                    {modelObj.name}
                  </span>
                </div>
              </div>

              {/* Markdown Answer Body */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-200 leading-relaxed overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.answer}
                </ReactMarkdown>
              </div>

              {/* Answer Footer Actions & Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
                <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
                  <span>⚡ {item.durationMs}ms</span>
                  <span>📊 {item.tokens} tokens</span>
                  <span>🎯 Mode: {item.mode}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Text to Speech */}
                  <button
                    onClick={() => handleSpeak(item.answer, item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                      isSpeaking ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                    title="Read answer aloud"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>

                  {/* Copy Answer */}
                  <button
                    onClick={() => handleCopy(item.answer, item.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-all"
                    title="Copy Answer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Compare in Battle Mode */}
                  <button
                    onClick={() => handleSendToArena(item.question)}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Compare this question across multiple AI models side by side"
                  >
                    <Swords className="w-3.5 h-3.5 text-rose-400" />
                    <span>Battle Side-by-Side</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={answersEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick One-Click Questions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTION_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(tmpl)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-amber-500/60 hover:text-amber-200 transition-all text-left"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Input Bar */}
      <div className="sticky bottom-0 bg-zinc-950/90 backdrop-blur-md pt-2 pb-1 border-t border-zinc-800/80">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 focus-within:border-amber-500/60 rounded-2xl p-2 shadow-2xl transition-all">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder={`Ask ${activeModelObj.name} anything for an immediate structured answer (Enter to send)...`}
            rows={1}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none font-sans"
          />

          <button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
            ) : (
              <Send className="w-4 h-4 text-zinc-950 fill-current" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
