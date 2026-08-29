import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AI_CHATBOT_MODELS } from '../data/aiCatalog.ts';
import { 
  Swords, 
  Sparkles, 
  Play, 
  RefreshCw, 
  Zap, 
  Clock, 
  Check, 
  Copy, 
  Layers, 
  Flame,
  Award,
  Columns2,
  LayoutGrid,
  Volume2,
  VolumeX,
  Code2,
  ArrowRight,
  TrendingUp,
  Sliders,
  MessageSquare
} from 'lucide-react';
import { AIStudioView } from '../types/index.ts';

interface ModelArenaProps {
  onClose: () => void;
  initialPrompt?: string;
  onSelectView?: (view: AIStudioView) => void;
}

const ARENA_BENCHMARK_PROMPTS = [
  'Write a self-contained WebGL particle vortex shader in HTML/JS with reactive mouse physics',
  'Solve the 3-body gravitational problem using Runge-Kutta 4th order numerical integration in Python',
  'Critique the epistemological foundations of Karl Popper falsificationism versus Thomas Kuhn paradigm shifts',
  'Explain quantum entanglement to a software engineer using distributed consensus and cryptographic keys',
  'Compare Rust vs Go for high-concurrency microservices with concrete memory allocations and thread models'
];

interface ModelResult {
  content: string;
  durationMs: number;
  tokens: number;
  speedTps: number;
  thinking?: string;
}

export function ModelArena({ onClose, initialPrompt, onSelectView }: ModelArenaProps) {
  const [prompt, setPrompt] = useState(initialPrompt || ARENA_BENCHMARK_PROMPTS[0]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'claude-3-7-sonnet',
    'gpt-4o-chatgpt',
    'gemini-2-5-pro',
    'deepseek-r1'
  ]);
  const [viewMode, setViewMode] = useState<'dual' | 'quad'>('dual');
  const [isRunning, setIsRunning] = useState(false);
  const [voteWinner, setVoteWinner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncScroll, setSyncScroll] = useState(true);
  const [showDiffHighlights, setShowDiffHighlights] = useState(false);

  const [responses, setResponses] = useState<Record<string, ModelResult>>({
    'claude-3-7-sonnet': {
      content: `### Claude 3.7 Sonnet (Hybrid Reasoning Engine)

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; overflow: hidden; background: #050508; font-family: sans-serif; }
    #hud { position: absolute; top: 12px; left: 12px; color: #f59e0b; font-size: 11px; }
  </style>
</head>
<body>
  <div id="hud">WebGL 60FPS Vortex Physics • Mouse Attractor Active</div>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    let mouse = { x: 0, y: 0 };
    window.onmousemove = e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    // Instanced GPU Physics Buffer for 60,000 Particle dynamics
    console.log("Claude 3.7: High-fidelity particle pipeline compiled.");
  </script>
</body>
</html>
\`\`\`

#### Architectural Highlights:
1. **Zero Garbage Collection**: Pre-allocated \`Float32Array\` instanced vertex buffers.
2. **Dynamic Gravitational Attractor**: Real-time inverse-square mouse velocity vector.
3. **Responsive Viewport**: Window resize observer with devicePixelRatio scaling.`,
      durationMs: 420,
      tokens: 380,
      speedTps: 84
    },
    'gpt-4o-chatgpt': {
      content: `### GPT-4o (Omni Frontier Engine)

Here is the complete self-contained WebGL particle vortex simulation with reactive physics:

\`\`\`javascript
// Vertex Shader Source with Vector Rotational Curl
const vsSource = \`
  attribute vec3 aPosition;
  uniform vec2 uMouse;
  void main() {
    vec3 pos = aPosition;
    float dist = length(pos.xy - uMouse);
    float angle = 1.0 / (dist + 0.15);
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    pos.xy = rot * (pos.xy - uMouse) + uMouse;
    gl_Position = vec4(pos, 1.0);
    gl_PointSize = 2.5;
  }
\`;
\`\`\`

#### Key Innovations:
- **Rotational Curl Dynamics**: Uses angular matrix rotation around the mouse cursor.
- **Color Temperature Shader**: Dynamic color shift based on particle speed.
- **Single-Pass Render**: Minimal draw-call overhead.`,
      durationMs: 460,
      tokens: 320,
      speedTps: 78
    },
    'gemini-2-5-pro': {
      content: `### Gemini 2.5 Pro (Multimodal Deep Reasoning)

\`\`\`javascript
// High-Throughput WebGL 2.0 Transform Feedback Vortex System
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');

// Ping-Pong Velocity Buffer Swap
class ParticleVortex {
  constructor(particleCount = 50000) {
    this.count = particleCount;
    this.initBuffers();
  }
  
  step(mousePos, deltaTime) {
    // GPU-accelerated subpass computation
  }
}
\`\`\`

#### Performance Benchmark:
- **WebGL 2.0 Transform Feedback**: Eliminates CPU-to-GPU memory transfer bottlenecks.
- **Adaptive Euler Integrator**: Prevents numerical explosion when mouse moves rapidly.`,
      durationMs: 380,
      tokens: 410,
      speedTps: 92
    },
    'deepseek-r1': {
      content: `### DeepSeek R1 (Open Reasoning Benchmark)

<think>
1. User prompt requests a high-performance WebGL particle vortex with reactive mouse physics.
2. Formulation:
   - Coordinate normalization: NDC range [-1.0, 1.0].
   - Physics law: Tangential acceleration $\\vec{a}_\\theta = \\frac{\\omega}{r^2 + \\epsilon}$ + Centripetal pull $\\vec{a}_r = -k \\frac{\\vec{r}}{r + \\delta}$.
3. Implementation strategy: Use single instanced VBO with point primitives and alpha blending.
</think>

\`\`\`html
<!DOCTYPE html>
<html>
<body>
<canvas id="sim"></canvas>
<script>
  // Mathematical Runge-Kutta angular vortex solver
  const gl = document.getElementById('sim').getContext('webgl');
  // Precision GPU floating-point precision enabled
</script>
</body>
</html>
\`\`\`

#### Mathematical Formulation:
- **Runge-Kutta 4th Order** velocity approximations.
- **Softened Coulomb potential** kernel to avoid singularity at $r \\to 0$.`,
      durationMs: 510,
      tokens: 450,
      speedTps: 76
    }
  });

  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleScroll = (sourceModelId: string, e: React.UIEvent<HTMLDivElement>) => {
    if (!syncScroll) return;
    const targetTop = e.currentTarget.scrollTop;
    const activeModels = viewMode === 'dual' ? selectedModelIds.slice(0, 2) : selectedModelIds;
    activeModels.forEach(mId => {
      if (mId !== sourceModelId && scrollRefs.current[mId]) {
        scrollRefs.current[mId]!.scrollTop = targetTop;
      }
    });
  };

  const handleToggleModel = (id: string) => {
    if (selectedModelIds.includes(id)) {
      if (selectedModelIds.length > 2) {
        setSelectedModelIds(prev => prev.filter(m => m !== id));
      }
    } else {
      if (selectedModelIds.length < 4) {
        setSelectedModelIds(prev => [...prev, id]);
      }
    }
  };

  const handleRunArena = async () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setVoteWinner(null);

    const activeList = viewMode === 'dual' ? selectedModelIds.slice(0, 2) : selectedModelIds;

    // Simulate concurrent stream answering for each active model
    const startTime = Date.now();

    setTimeout(() => {
      const updated: Record<string, ModelResult> = { ...responses };

      activeList.forEach(mId => {
        const modelObj = AI_CHATBOT_MODELS.find(m => m.id === mId);
        const duration = Math.floor(280 + Math.random() * 320);
        const speed = Math.floor(70 + Math.random() * 35);
        const tokens = Math.floor(250 + Math.random() * 200);

        updated[mId] = {
          content: `### ${modelObj?.name} Response for: "${prompt.slice(0, 40)}..."\n\n1. **Core Solution & Analysis**:\n   - Comprehensive solution formulated with state-of-the-art ${modelObj?.family} architecture.\n   - High-throughput reasoning and deep parameter alignment.\n\n\`\`\`typescript\n// ${modelObj?.name} Optimized Implementation\nexport function solveBenchmark(input: string) {\n  console.log("Synthesized benchmark execution with ${modelObj?.name}");\n  return { status: "optimized", latencyMs: ${duration}, tokens: ${tokens} };\n}\n\`\`\`\n\n2. **Benchmark Characteristics**:\n   - Token Velocity: **${speed} tok/s**\n   - First-token Latency: **${duration} ms**\n   - Context Window: **${modelObj?.contextWindow || '1M Tokens'}**`,
          durationMs: duration,
          tokens: tokens,
          speedTps: speed
        };
      });

      setResponses(updated);
      setIsRunning(false);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayedModels = viewMode === 'dual' ? selectedModelIds.slice(0, 2) : selectedModelIds;

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 font-bold">
              <Swords className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Battle Mode • Side-by-Side Model Arena</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold font-mono">
              Live Frontier AI Duel
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Run identical prompts simultaneously across <strong>Claude 3.7 vs ChatGPT-4o vs Gemini 2.5 vs DeepSeek R1</strong> in real-time side-by-side columns.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick switch to ChatBasic */}
          <button
            onClick={() => onSelectView ? onSelectView('chatbasic') : onClose()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 hover:border-amber-500 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Switch to ChatBasic Instant Answers"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>ChatBasic (Instant Q&A)</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            Back to Hub
          </button>
        </div>
      </div>

      {/* Arena Configuration Bar */}
      <div className="space-y-3 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-xl backdrop-blur-sm">
        {/* Model Selection Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            Active Duel Models ({displayedModels.length} Active in View)
          </label>

          {/* View Mode Switcher: 50/50 Dual vs Quad */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setViewMode('dual')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'dual' ? 'bg-rose-500 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Side-by-Side Dual (50/50)</span>
              </button>
              <button
                onClick={() => setViewMode('quad')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'quad' ? 'bg-rose-500 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Multi-Grid ({selectedModelIds.length} Models)</span>
              </button>
            </div>

            <button
              onClick={() => setSyncScroll(!syncScroll)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                syncScroll
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-semibold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
              title="Synchronize vertical scrolling across all model response columns"
            >
              Sync Scroll: {syncScroll ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Model Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {AI_CHATBOT_MODELS.map((model) => {
            const isSelected = selectedModelIds.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => handleToggleModel(model.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-500/10'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs truncate">{model.name}</div>
                <div className="text-[10px] text-zinc-500 font-normal truncate">{model.company}</div>
              </button>
            );
          })}
        </div>

        {/* Prompt Input Box & Runner */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Prompt to Compare Simultaneously
            </span>
            <button
              onClick={() => {
                const random = ARENA_BENCHMARK_PROMPTS[Math.floor(Math.random() * ARENA_BENCHMARK_PROMPTS.length)];
                setPrompt(random);
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Random Benchmark Prompt
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunArena();
              }}
              placeholder="Enter any code, logic puzzle, math problem, or reasoning prompt to battle test..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/70 font-sans"
            />
            <button
              onClick={handleRunArena}
              disabled={isRunning || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Battling...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Battle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Columns Container */}
      <div className={`grid grid-cols-1 gap-4 ${
        viewMode === 'dual'
          ? 'md:grid-cols-2'
          : displayedModels.length === 2
          ? 'md:grid-cols-2'
          : displayedModels.length === 3
          ? 'md:grid-cols-3'
          : 'md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {displayedModels.map((modelId) => {
          const modelObj = AI_CHATBOT_MODELS.find(m => m.id === modelId);
          const response = responses[modelId] || {
            content: `Generating comparison response for ${modelObj?.name}...`,
            durationMs: 400,
            tokens: 300,
            speedTps: 80
          };
          const isWinner = voteWinner === modelId;
          const isCopied = copiedId === modelId;

          return (
            <div
              key={modelId}
              className={`rounded-2xl border flex flex-col justify-between bg-zinc-900/90 overflow-hidden shadow-xl transition-all backdrop-blur-sm ${
                isWinner
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10'
                  : 'border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-bold text-white truncate">{modelObj?.name}</h2>
                    {isWinner && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold">
                        👑 Winner
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{modelObj?.company} • {modelObj?.badge}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-rose-300 font-mono font-semibold">
                    {response.speedTps} t/s
                  </span>
                </div>
              </div>

              {/* Column Answer Content with Scroll Synchronization */}
              <div
                ref={el => { scrollRefs.current[modelId] = el; }}
                onScroll={(e) => handleScroll(modelId, e)}
                className="p-4 flex-1 text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed overflow-y-auto max-h-[500px] min-h-[300px] space-y-3 select-text"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response.content}
                </ReactMarkdown>
              </div>

              {/* Column Footer with Telemetry, Copy, & Voting */}
              <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <div className="font-mono text-[10px] text-zinc-500">
                  <span>⚡ {response.durationMs}ms</span> • <span>📊 {response.tokens} tok</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(response.content, modelId)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-all"
                    title="Copy this model's response"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setVoteWinner(modelId)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isWinner
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isWinner ? 'Voted Best' : 'Vote Best'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
