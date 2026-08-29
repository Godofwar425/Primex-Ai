import React, { useState } from 'react';
import { 
  Plus, MessageSquare, Layout, Zap, Link2, Settings, 
  Trash2, Sparkles, ChevronRight, Search, Bot, Database, 
  PanelLeftClose, PanelLeft, Image as ImageIcon, Film,
  Code2, Music, PenTool, BookOpen, Swords, Boxes
} from 'lucide-react';
import { Conversation, Plugin, Connector, AIStudioView } from '../types/index.ts';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  activeView: AIStudioView;
  onSelectView: (view: AIStudioView) => void;
  onOpenSettings: () => void;
  plugins: Plugin[];
  connectors: Connector[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  activeView,
  onSelectView,
  onOpenSettings,
  plugins,
  connectors,
  collapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const activePluginsCount = plugins.filter(p => p.enabled).length;
  const connectedConnectorsCount = connectors.filter(c => c.status === 'connected').length;

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const STUDIO_BUTTONS: Array<{ id: AIStudioView; name: string; icon: React.ReactNode; color: string }> = [
    { id: 'chat', name: 'Chatbots & AI', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { id: 'chatbasic', name: 'ChatBasic Q&A', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { id: 'arena', name: 'Battle Mode (Dual)', icon: <Swords className="w-3.5 h-3.5" />, color: 'text-rose-400' },
    { id: 'image', name: 'AI Image Studio', icon: <ImageIcon className="w-3.5 h-3.5" />, color: 'text-pink-400' },
    { id: 'video', name: 'AI Video Studio', icon: <Film className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
    { id: 'coding', name: 'AI Coding IDE', icon: <Code2 className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
    { id: 'audio', name: 'AI Music & Audio', icon: <Music className="w-3.5 h-3.5" />, color: 'text-purple-400' },
    { id: 'writing', name: 'Writing Suite', icon: <PenTool className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { id: 'research', name: 'Research Lab', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'text-teal-400' },
    { id: 'models', name: '12 Model Families', icon: <Boxes className="w-3.5 h-3.5" />, color: 'text-blue-400' },
    { id: 'studio', name: 'Artifacts Preview', icon: <Layout className="w-3.5 h-3.5" />, color: 'text-indigo-400' }
  ];

  if (collapsed) {
    return (
      <aside aria-label="Collapsed Sidebar Navigation" className="w-16 h-full bg-[#121215] border-r border-zinc-800/80 flex flex-col items-center py-3.5 justify-between shrink-0">
        <div className="flex flex-col items-center gap-2.5">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-md shadow-amber-900/30 transition-transform hover:scale-105"
            title="Expand Sidebar"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          
          <button
            onClick={onNewConversation}
            className="p-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 shadow-md transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="w-8 h-[1px] bg-zinc-800 my-1"></div>

          {STUDIO_BUTTONS.slice(0, 7).map((btn) => (
            <button
              key={btn.id}
              onClick={() => onSelectView(btn.id)}
              className={`p-2.5 rounded-xl transition-colors ${activeView === btn.id ? 'bg-zinc-800 ' + btn.color : 'text-zinc-400 hover:text-zinc-200'}`}
              title={btn.name}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Settings & Directives"
        >
          <Settings className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Sidebar Navigation" className="w-72 h-full bg-[#121215] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 shadow-lg select-none">
      {/* Top Header & Brand */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-900/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-sm tracking-tight text-white leading-tight">
                PrimeX AI
              </h1>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider">
                Super Studio • Free & Unlimited
              </span>
            </div>
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Start New Chat Action */}
        <button
          onClick={onNewConversation}
          className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-amber-950/40 flex items-center justify-center gap-2 transition-all mb-3"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Conversation</span>
        </button>

        {/* AI Studios Navigation Hub */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1 mb-1">
            AI Studios & Suites
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {STUDIO_BUTTONS.map((btn) => {
              const isActive = activeView === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => onSelectView(btn.id)}
                  className={`p-2 rounded-xl text-left flex items-center gap-2 text-xs transition-all border ${
                    isActive
                      ? 'bg-zinc-800/90 border-zinc-700 text-white font-semibold shadow-sm'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                  }`}
                >
                  <span className={btn.color}>{btn.icon}</span>
                  <span className="truncate text-[11px]">{btn.name.split(' ')[0]} {btn.name.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversations History List */}
      <div className="flex-1 px-3.5 overflow-hidden flex flex-col min-h-0 pt-2 border-t border-zinc-800/80">
        {/* Search Chats Input */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between">
          <span>Recent Sessions</span>
          <span>{conversations.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-4 text-xs text-zinc-600">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  onSelectView('chat');
                }}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                  conv.id === activeConversationId && activeView === 'chat'
                    ? 'bg-zinc-800/90 text-amber-300 font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${conv.id === activeConversationId && activeView === 'chat' ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{conv.title || 'Untitled Session'}</span>
                </div>

                <button
                  onClick={(e) => onDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700/80 text-zinc-500 hover:text-red-400 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Settings & Status */}
      <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/40 space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-500" />
            <span>Studio Preferences</span>
          </div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono font-semibold">
            Zero Limits
          </span>
        </button>
      </div>
    </aside>
  );
};
