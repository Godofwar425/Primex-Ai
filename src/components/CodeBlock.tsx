import React, { useState } from 'react';
import { Copy, Check, Play, Maximize2, Loader2 } from 'lucide-react';
import { executeCodeSandbox } from '../services/apiClient.ts';

interface CodeBlockProps {
  language?: string;
  value: string;
  onOpenInArtifact?: (code: string, language: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value, onOpenInArtifact }) => {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await executeCodeSandbox(value, language);
      setOutput(res.output || 'Execution completed with no output');
    } catch (err: any) {
      setOutput(`Execution error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const isPreviewable = ['html', 'svg', 'react', 'jsx', 'tsx', 'javascript'].includes(language.toLowerCase()) ||
    value.includes('<!DOCTYPE') || value.includes('<html') || value.startsWith('<svg');

  const isRunnable = ['javascript', 'js', 'typescript', 'ts', 'python', 'py'].includes(language.toLowerCase());

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#121215] text-zinc-200 text-sm font-mono shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-zinc-800/80 text-xs text-zinc-400">
        <span className="font-medium text-amber-500/90 lowercase">{language || 'code'}</span>
        <div className="flex items-center gap-1.5">
          {isRunnable && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1 px-2 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 transition-colors disabled:opacity-50"
              title="Run code in sandbox"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Run</span>
            </button>
          )}

          {isPreviewable && onOpenInArtifact && (
            <button
              onClick={() => onOpenInArtifact(value, language)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Open in Artifact Canvas"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-3.5 overflow-x-auto text-[13px] leading-relaxed max-h-[480px]">
        <pre className="text-zinc-200 font-mono">
          <code>{value}</code>
        </pre>
      </div>

      {/* Sandbox Output Console */}
      {output && (
        <div className="border-t border-zinc-800 bg-black/60 p-3 text-xs">
          <div className="text-zinc-400 text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Terminal Output</span>
            <button onClick={() => setOutput(null)} className="text-zinc-500 hover:text-zinc-300">Clear</button>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
};
