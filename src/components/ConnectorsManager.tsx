import React, { useState } from 'react';
import { 
  GitBranch, Database, Globe, FileText, FolderGit2, Plus, 
  CheckCircle2, AlertCircle, RefreshCw, X, Trash2, ArrowRight, 
  ShieldCheck, Loader2, Link2
} from 'lucide-react';
import { Connector } from '../types/index.ts';
import { testConnector } from '../services/apiClient.ts';

interface ConnectorsManagerProps {
  connectors: Connector[];
  onAddConnector: (connector: Connector) => void;
  onRemoveConnector: (connectorId: string) => void;
  onUpdateConnector: (connector: Connector) => void;
  onClose?: () => void;
}

export const ConnectorsManager: React.FC<ConnectorsManagerProps> = ({
  connectors,
  onAddConnector,
  onRemoveConnector,
  onUpdateConnector,
  onClose
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, any>>({});
  
  // New connector form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Connector['type']>('github');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const getTypeIcon = (type: Connector['type']) => {
    switch (type) {
      case 'github': return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'postgres': return <Database className="w-5 h-5 text-sky-400" />;
      case 'rest_api': return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'notion': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'files': return <FolderGit2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleTest = async (connector: Connector) => {
    setTestingId(connector.id);
    try {
      const res = await testConnector(connector.type, connector.config);
      setTestResult(prev => ({ ...prev, [connector.id]: res }));
      onUpdateConnector({
        ...connector,
        status: res.status === 'connected' ? 'connected' : 'error',
        lastSynced: Date.now()
      });
    } catch (e: any) {
      setTestResult(prev => ({ ...prev, [connector.id]: { error: e.message } }));
      onUpdateConnector({ ...connector, status: 'error' });
    } finally {
      setTestingId(null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newConn: Connector = {
      id: `conn-${Date.now()}`,
      name: newName,
      type: newType,
      description: newDesc || `Custom ${newType.toUpperCase()} connector`,
      status: 'connected',
      config: {
        endpoint: newEndpoint,
        created: new Date().toISOString()
      },
      contextData: {
        endpoint: newEndpoint,
        connectedAt: Date.now(),
        sampleSchema: ['id', 'name', 'status', 'created_at']
      },
      lastSynced: Date.now()
    };

    onAddConnector(newConn);
    setNewName('');
    setNewEndpoint('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Data & Workspace Connectors</h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Inject real repository code, database schemas, REST endpoints, and documents directly into Claude's prompt context.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Connector</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Connectors List */}
      <div className="space-y-3.5 mb-8">
        {connectors.map((conn) => (
          <div
            key={conn.id}
            className="bg-[#18181c] border border-zinc-800 hover:border-zinc-700/90 rounded-xl p-4 transition-all duration-200 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Details */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                  {getTypeIcon(conn.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-zinc-100">{conn.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      conn.status === 'connected'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-red-950/60 text-red-400 border border-red-800/40'
                    }`}>
                      {conn.status === 'connected' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Context</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Disconnected</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{conn.description}</p>
                  
                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-zinc-500 font-mono">
                    <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Type: {conn.type}
                    </span>
                    {conn.lastSynced && (
                      <span>Last synced: {new Date(conn.lastSynced).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleTest(conn)}
                  disabled={testingId === conn.id}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Test Connection & Refresh Schema"
                >
                  {testingId === conn.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Sync / Test</span>
                </button>
                <button
                  onClick={() => onRemoveConnector(conn.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                  title="Remove connector"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test result output */}
            {testResult[conn.id] && (
              <div className="mt-3 pt-3 border-t border-zinc-800 text-xs font-mono bg-black/40 rounded-lg p-2.5">
                <span className="text-zinc-400">Sync Handshake:</span>
                <pre className="text-emerald-400 mt-1 whitespace-pre-wrap">
                  {JSON.stringify(testResult[conn.id], null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Connector Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181c] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-amber-500" />
                Add New Connector
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Connector Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="github">GitHub Repository</option>
                  <option value="postgres">PostgreSQL / SQL Database</option>
                  <option value="rest_api">REST API / Webhook</option>
                  <option value="notion">Notion Documentation</option>
                  <option value="files">Local Workspace Files</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Connector Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Production Frontend Repo or Stripe Billing API"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Connection Endpoint / Identifier / URI
                </label>
                <input
                  type="text"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  placeholder="e.g. org/repo-name or https://api.service.com/v1"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description (Optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief note about what this connector provides..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors"
                >
                  Connect Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
