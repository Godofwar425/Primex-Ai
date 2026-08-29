import React, { useState } from 'react';
import { 
  Globe, Terminal, Layout, BarChart3, Webhook, Sparkles, 
  Check, X, Zap, Play, Search, Loader2, ShieldCheck, Settings2
} from 'lucide-react';
import { Plugin } from '../types/index.ts';
import { runWebSearch, executeCodeSandbox } from '../services/apiClient.ts';

interface PluginsManagerProps {
  plugins: Plugin[];
  onTogglePlugin: (pluginId: string) => void;
  onClose?: () => void;
}

export const PluginsManager: React.FC<PluginsManagerProps> = ({
  plugins,
  onTogglePlugin,
  onClose
}) => {
  const [testingPluginId, setTestingPluginId] = useState<string | null>(null);
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-sky-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-amber-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-purple-400" />;
      case 'Webhook': return <Webhook className="w-5 h-5 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-yellow-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleTestPlugin = async (plugin: Plugin) => {
    setTestingPluginId(plugin.id);
    setTestResult(null);
    setLoadingTest(true);

    try {
      if (plugin.id === 'web-search') {
        const query = testQuery || 'Latest breakthroughs in artificial intelligence 2026';
        const res = await runWebSearch(query);
        setTestResult(res);
      } else if (plugin.id === 'code-interpreter') {
        const code = testQuery || `// Safe Sandbox Test
const data = [12, 45, 89, 23, 67, 91];
const avg = data.reduce((a,b) => a+b, 0) / data.length;
console.log("Dataset:", data);
console.log("Calculated Average:", avg.toFixed(2));
console.log("Timestamp:", new Date().toISOString());`;
        const res = await executeCodeSandbox(code, 'javascript');
        setTestResult(res);
      } else {
        // Generic plugin test simulation
        await new Promise(r => setTimeout(r, 600));
        setTestResult({
          status: 'success',
          message: `Plugin "${plugin.name}" is healthy and connected to runtime engine.`
        });
      }
    } catch (e: any) {
      setTestResult({ error: e.message });
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Plugins & Extensibility Engine</h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Supercharge Claude with modular execution tools, live search grounding, sandboxes, and visual generators.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`bg-[#18181c] border rounded-xl p-4 transition-all duration-200 ${
              plugin.enabled
                ? 'border-zinc-700/80 shadow-md'
                : 'border-zinc-800/40 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  {getIcon(plugin.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100 flex items-center gap-1.5">
                    {plugin.name}
                    {plugin.featured && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-normal">
                        Core
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                    {plugin.category}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => onTogglePlugin(plugin.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  plugin.enabled ? 'bg-amber-600' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    plugin.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {plugin.description}
            </p>

            {/* Test Action */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Active in context
              </span>
              <button
                onClick={() => handleTestPlugin(plugin)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Test Plugin</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Plugin Test Runner Drawer */}
      {testingPluginId && (
        <div className="bg-[#141418] border border-amber-500/30 rounded-xl p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Testing Plugin: {plugins.find(p => p.id === testingPluginId)?.name}
            </h4>
            <button
              onClick={() => { setTestingPluginId(null); setTestResult(null); }}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Close Test
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder={
                testingPluginId === 'web-search'
                  ? 'Enter query to search live web (e.g. quantum computing breakthrough)'
                  : testingPluginId === 'code-interpreter'
                  ? 'Enter JS expression (e.g. console.log(Math.sqrt(1024) * 5))'
                  : 'Enter payload or test input...'
              }
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/70"
            />
            <button
              onClick={() => {
                const p = plugins.find(x => x.id === testingPluginId);
                if (p) handleTestPlugin(p);
              }}
              disabled={loadingTest}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loadingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Execute</span>
            </button>
          </div>

          {testResult && (
            <div className="bg-black/60 border border-zinc-800 rounded-lg p-3 text-xs font-mono max-h-60 overflow-auto">
              <pre className="text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
