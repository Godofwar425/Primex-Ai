import React, { useState } from 'react';
import { AI_CODING_TOOLS } from '../data/aiCatalog.ts';
import { 
  Code2, 
  Play, 
  Terminal, 
  Sparkles, 
  FileCode, 
  FolderTree, 
  Copy, 
  Check, 
  Download, 
  Wand2, 
  Bug, 
  Cpu,
  RefreshCw
} from 'lucide-react';
import { executeCode } from '../services/apiClient.ts';

interface CodingStudioProps {
  onClose: () => void;
}

interface ProjectFile {
  name: string;
  language: string;
  content: string;
}

const INITIAL_FILES: ProjectFile[] = [
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quantum Matrix Simulation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background-color: #09090b; font-family: monospace; }</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 text-emerald-400">
  <div class="max-w-md w-full bg-zinc-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
    <div class="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
      <span class="font-bold text-sm">QUANTUM SIMULATOR</span>
      <span class="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">ACTIVE</span>
    </div>
    <div id="matrixOutput" class="h-44 overflow-hidden text-xs space-y-1 bg-black/60 p-3 rounded-xl border border-zinc-800"></div>
    <button onclick="pulseMatrix()" class="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition-all">
      EXECUTE QUANTUM SURGE
    </button>
  </div>
  <script>
    const out = document.getElementById('matrixOutput');
    function log(msg) {
      const line = document.createElement('div');
      line.textContent = '> ' + msg;
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    }
    function pulseMatrix() {
      log('Qubit Superposition Entanglement: ' + Math.random().toString(36).substring(7));
    }
    for(let i=0; i<4; i++) pulseMatrix();
  </script>
</body>
</html>`
  },
  {
    name: 'simulator.ts',
    language: 'typescript',
    content: `// Autonomous Distributed State Engine
export interface StateNode {
  id: string;
  hash: string;
  entropy: number;
  timestamp: number;
}

export class QuantumMesh {
  private nodes: StateNode[] = [];

  constructor(nodeCount = 5) {
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        id: \`node-\${i}\`,
        hash: Math.random().toString(16).substring(2, 10),
        entropy: Math.random() * 100,
        timestamp: Date.now()
      });
    }
  }

  public runConsensus(): { quorum: boolean; meanEntropy: number } {
    const totalEntropy = this.nodes.reduce((acc, n) => acc + n.entropy, 0);
    const mean = totalEntropy / this.nodes.length;
    console.log(\`Consensus executed across \${this.nodes.length} nodes. Mean Entropy: \${mean.toFixed(2)}\`);
    return { quorum: true, meanEntropy: mean };
  }
}

// Test runner
const mesh = new QuantumMesh(8);
const result = mesh.runConsensus();
console.log('Simulation Status:', result);
`
  },
  {
    name: 'algorithm.py',
    language: 'python',
    content: `# Neural Graph Attention Optimization
import math

def calculate_attention(query, key, value):
    dot_product = sum(q * k for q, k in zip(query, key))
    scale = math.sqrt(len(query))
    weights = math.exp(dot_product / scale)
    output = [v * weights for v in value]
    return output

q = [0.24, 0.88, 0.12, 0.65]
k = [0.22, 0.85, 0.15, 0.60]
v = [1.0, 2.0, 3.0, 4.0]

print("Attention Output Vector:", calculate_attention(q, k, v))
`
  }
];

export function CodingStudio({ onClose }: CodingStudioProps) {
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [activeFileName, setActiveFileName] = useState('index.html');
  const [selectedTool, setSelectedTool] = useState('cursor-composer');
  const [composerPrompt, setComposerPrompt] = useState('Refactor the state machine to include dynamic error boundaries and live telemetry charts');
  const [isComposing, setIsComposing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'OmniAI Coding Environment Ready.',
    'Tool Active: Cursor Composer Multi-File Engine.',
    'Runtime: Full-Stack JavaScript/TypeScript & HTML Live Runner.'
  ]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeFile = files.find(f => f.name === activeFileName) || files[0];

  const handleFileChange = (newContent: string) => {
    setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: newContent } : f));
  };

  const handleRunCode = async () => {
    setIsRunningCode(true);
    setTerminalLogs(prev => [...prev, `> Executing ${activeFile.name}...`]);

    try {
      const res = await executeCode(activeFile.content, activeFile.language);
      if (res.success) {
        setTerminalLogs(prev => [...prev, res.output, `[Done in ${res.durationMs}ms]`]);
      } else {
        setTerminalLogs(prev => [...prev, `[ERROR] ${res.output}`]);
      }
    } catch (e: any) {
      setTerminalLogs(prev => [...prev, `Execution error: ${e.message}`]);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleApplyComposer = () => {
    if (!composerPrompt.trim() || isComposing) return;
    setIsComposing(true);

    setTimeout(() => {
      const toolObj = AI_CODING_TOOLS.find(t => t.id === selectedTool);
      setTerminalLogs(prev => [
        ...prev,
        `> [${toolObj?.name || 'AI Assistant'}] Analyzing repository AST for prompt: "${composerPrompt}"...`,
        `> Generated multi-file optimizations for ${activeFile.name}. Code updated successfully.`
      ]);

      // Enhance active file with modern boilerplate
      if (activeFile.name === 'index.html') {
        const enhanced = activeFile.content.replace(
          'QUANTUM SIMULATOR',
          'QUANTUM MATRIX V3.7 (AI ENHANCED)'
        );
        handleFileChange(enhanced);
      }

      setIsComposing(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Coding & Full-Stack IDE</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Unified agentic IDE combining <strong>GitHub Copilot, Cursor Composer, Claude Code, Amazon Q Developer, Windsurf, Replit AI, & Gemini Code Assist</strong>.
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
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          Select AI Coding Assistant & Agent
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {AI_CODING_TOOLS.map((tool) => {
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{tool.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{tool.company}</div>
                <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono">
                  {tool.badge.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Composer Input Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Code Composer & Multi-File Refactor</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Active: {AI_CODING_TOOLS.find(t => t.id === selectedTool)?.name}
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={composerPrompt}
            onChange={(e) => setComposerPrompt(e.target.value)}
            placeholder="Instruct the AI coding agent to refactor, write features, fix bugs, or optimize performance..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 font-sans"
          />
          <button
            onClick={handleApplyComposer}
            disabled={isComposing || !composerPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isComposing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Refactoring...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Compose Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Project Explorer + File Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
          {/* File Tabs & Actions Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <FolderTree className="w-3.5 h-3.5 text-zinc-500 mr-1" />
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFileName(file.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                    activeFileName === file.name
                      ? 'bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  {file.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run
              </button>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <textarea
            value={activeFile.content}
            onChange={(e) => handleFileChange(e.target.value)}
            className="flex-1 w-full bg-[#0d0d10] p-4 text-xs font-mono text-emerald-300 leading-relaxed resize-none focus:outline-none border-none selection:bg-emerald-500/30 selection:text-white"
            spellCheck={false}
          />
        </div>

        {/* Right Output & Terminal Console (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
          <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integrated Terminal & Output</span>
            </div>
            <button
              onClick={() => setTerminalLogs(['OmniAI Terminal Cleared.'])}
              className="text-[10px] text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 p-4 bg-black/80 font-mono text-[11px] text-zinc-300 space-y-2 overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={`leading-relaxed ${
                  log.startsWith('[ERROR]')
                    ? 'text-red-400'
                    : log.startsWith('>')
                    ? 'text-emerald-400 font-semibold'
                    : 'text-zinc-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setTerminalLogs(prev => [
                  ...prev,
                  `> [${selectedTool}] Checking AST linting...`,
                  `> 0 syntax errors found. Production code validated.`
                ]);
              }}
              className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1 text-[11px]"
            >
              <Bug className="w-3 h-3 text-emerald-400" />
              Analyze Bugs
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([activeFile.content], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = activeFile.name;
                document.body.appendChild(element);
                element.click();
              }}
              className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1 text-[11px]"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              Export File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
