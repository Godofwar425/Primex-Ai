import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Code, Play, RefreshCw, Download, ExternalLink, 
  Smartphone, Tablet, Monitor, Copy, Check, Terminal, Sparkles, Edit3
} from 'lucide-react';
import { Artifact } from '../types/index.ts';
import { buildSandboxHtml } from '../utils/artifactParser.ts';

interface ArtifactCanvasProps {
  artifact: Artifact | null;
  onClose: () => void;
  onUpdateArtifact?: (updated: Artifact) => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  artifact,
  onClose,
  onUpdateArtifact
}) => {
  if (!artifact) return null;

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'console'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editedCode, setEditedCode] = useState(artifact.content);
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync edited code when artifact changes
  useEffect(() => {
    setEditedCode(artifact.content);
    setConsoleLogs([]);
  }, [artifact.id, artifact.content]);

  // Handle iframe message listening for console.log
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'IFRAME_CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${event.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const isHtml = artifact.type === 'html' || artifact.language === 'html' || editedCode.includes('<!DOCTYPE');
    const extension = isHtml ? 'html' : artifact.type === 'svg' ? 'svg' : 'tsx';
    const blob = new Blob([editedCode], { type: isHtml ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'artifact'}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const fullHtml = buildSandboxHtml(editedCode, artifact.language);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleReload = () => {
    if (iframeRef.current) {
      const fullHtml = buildSandboxHtml(editedCode, artifact.language);
      iframeRef.current.srcdoc = fullHtml;
      setConsoleLogs(prev => [...prev, `[System] Reloaded at ${new Date().toLocaleTimeString()}`]);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditedCode(newCode);
    if (onUpdateArtifact) {
      onUpdateArtifact({
        ...artifact,
        content: newCode
      });
    }
  };

  // Build the sandboxed HTML string to inject into iframe
  const sandboxedHtml = buildSandboxHtml(editedCode, artifact.language);

  // Inject console interceptor script into sandbox
  const instrumentedHtml = sandboxedHtml.replace(
    '<head>',
    `<head>
    <script>
      (function() {
        const originalLog = console.log;
        const originalError = console.error;
        console.log = function(...args) {
          window.parent.postMessage({ type: 'IFRAME_CONSOLE_LOG', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
          originalLog.apply(console, args);
        };
        console.error = function(...args) {
          window.parent.postMessage({ type: 'IFRAME_CONSOLE_LOG', message: 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
          originalError.apply(console, args);
        };
      })();
    </script>`
  );

  return (
    <aside aria-label="Artifact Canvas Panel" className="h-full flex flex-col bg-[#161619] border-l border-zinc-800/90 shadow-2xl relative z-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-sm">
        {/* Title & Metadata */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-6 h-6 rounded bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-600/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-zinc-100 text-xs truncate" title={artifact.title}>
              {artifact.title || 'Generated Artifact'}
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono uppercase">
              {artifact.type} • {artifact.language}
            </span>
          </div>
        </div>

        {/* View Mode Tabs (Preview / Code / Console) */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'console'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Console</span>
            {consoleLogs.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5"></span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {activeTab === 'preview' && (
            <div className="hidden sm:flex items-center gap-0.5 mr-2 px-1 py-0.5 bg-zinc-950 rounded border border-zinc-800">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleReload}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Download Standalone File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Open Fullscreen in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors ml-1"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 relative overflow-hidden bg-[#0c0c0e]">
        {/* 1. Preview Mode */}
        {activeTab === 'preview' && (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-auto bg-zinc-950/80">
            <div
              className={`h-full transition-all duration-300 shadow-2xl bg-white rounded-lg overflow-hidden border border-zinc-800 flex flex-col ${
                deviceMode === 'desktop'
                  ? 'w-full'
                  : deviceMode === 'tablet'
                  ? 'w-[768px] max-w-full'
                  : 'w-[375px] max-w-full'
              }`}
            >
              {deviceMode !== 'desktop' && (
                <div className="h-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-center px-3">
                  <div className="w-12 h-1 bg-zinc-700 rounded-full"></div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                title={artifact.title}
                srcDoc={instrumentedHtml}
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full flex-1 border-0 bg-white"
              />
            </div>
          </div>
        )}

        {/* 2. Code Editor Mode */}
        {activeTab === 'code' && (
          <div className="w-full h-full flex flex-col bg-[#111114]">
            <div className="px-4 py-2 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Interactive Editor (Changes reflect in real-time)</span>
              </div>
              <span className="font-mono text-[11px]">{editedCode.split('\n').length} lines</span>
            </div>
            <div className="flex-1 p-3 overflow-auto">
              <textarea
                value={editedCode}
                onChange={handleCodeChange}
                spellCheck={false}
                className="w-full h-full bg-transparent font-mono text-[13px] text-zinc-200 resize-none outline-none leading-relaxed selection:bg-amber-600/30 selection:text-amber-200"
              />
            </div>
          </div>
        )}

        {/* 3. Console Logs Mode */}
        {activeTab === 'console' && (
          <div className="w-full h-full flex flex-col bg-black text-xs font-mono p-3 overflow-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-400">
              <span>Sandbox Console Output ({consoleLogs.length} events)</span>
              <button
                onClick={() => setConsoleLogs([])}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                Clear
              </button>
            </div>
            {consoleLogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                <Terminal className="w-8 h-8 mb-2 opacity-50" />
                <p>No console messages captured yet.</p>
                <p className="text-[11px] text-zinc-600 mt-1">Logs, warnings, and errors from your artifact will appear here.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`py-1 px-2 rounded font-mono ${
                      log.includes('ERROR')
                        ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                        : 'bg-zinc-900/50 text-emerald-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
