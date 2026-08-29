import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Artifact, Attachment, Plugin, Connector, UserSettings, AIStudioView } from './types/index.ts';
import { DEFAULT_PLUGINS, DEFAULT_CONNECTORS, DEFAULT_SETTINGS } from './data/defaults.ts';
import { extractArtifacts } from './utils/artifactParser.ts';
import { streamChat } from './services/apiClient.ts';

import { Sidebar } from './components/Sidebar.tsx';
import { ChatArea } from './components/ChatArea.tsx';
import { ArtifactCanvas } from './components/ArtifactCanvas.tsx';
import { WebsiteStudio } from './components/WebsiteStudio.tsx';
import { PluginsManager } from './components/PluginsManager.tsx';
import { ConnectorsManager } from './components/ConnectorsManager.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

// New All-In-One Unified AI Studios
import { ImageStudio } from './components/ImageStudio.tsx';
import { VideoStudio } from './components/VideoStudio.tsx';
import { CodingStudio } from './components/CodingStudio.tsx';
import { AudioStudio } from './components/AudioStudio.tsx';
import { WritingStudio } from './components/WritingStudio.tsx';
import { ResearchStudio } from './components/ResearchStudio.tsx';
import { ModelArena } from './components/ModelArena.tsx';
import { ChatBasic } from './components/ChatBasic.tsx';
import { ModelFamiliesHub } from './components/ModelFamiliesHub.tsx';

const STORAGE_KEYS = {
  CONVERSATIONS: 'omni_ai_conversations',
  ACTIVE_ID: 'omni_ai_active_id',
  ACTIVE_MODEL: 'omni_ai_active_model',
  PLUGINS: 'omni_ai_plugins',
  CONNECTORS: 'omni_ai_connectors',
  SETTINGS: 'omni_ai_settings'
};

export default function App() {
  // 1. Initial State Loaders from localStorage
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading conversations', e);
    }
    const initialId = `session-${Date.now()}`;
    return [
      {
        id: initialId,
        title: 'New Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      }
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {}
    return conversations[0]?.id || `session-${Date.now()}`;
  });

  const [activeModelId, setActiveModelId] = useState<string>(() => {
    try {
      const savedModel = localStorage.getItem(STORAGE_KEYS.ACTIVE_MODEL);
      if (savedModel) return savedModel;
    } catch (e) {}
    return 'claude-3-7-sonnet';
  });

  const [plugins, setPlugins] = useState<Plugin[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLUGINS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PLUGINS;
  });

  const [connectors, setConnectors] = useState<Connector[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CONNECTORS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  // UI state
  const [activeView, setActiveView] = useState<AIStudioView>('chat');
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [arenaInitialPrompt, setArenaInitialPrompt] = useState<string>('');

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeConversationId);
    } catch (e) {}
  }, [activeConversationId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MODEL, activeModelId);
    } catch (e) {}
  }, [activeModelId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLUGINS, JSON.stringify(plugins));
    } catch (e) {}
  }, [plugins]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTORS, JSON.stringify(connectors));
    } catch (e) {}
  }, [connectors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Current active conversation
  const currentConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Actions
  const handleNewConversation = () => {
    const newId = `session-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setActiveArtifact(null);
    setActiveView('chat');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    if (updated.length === 0) {
      const freshId = `session-${Date.now()}`;
      setConversations([
        {
          id: freshId,
          title: 'New Session',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: []
        }
      ]);
      setActiveConversationId(freshId);
    } else {
      setConversations(updated);
      if (activeConversationId === id) {
        setActiveConversationId(updated[0].id);
      }
    }
  };

  const handleTogglePlugin = (id: string) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddConnector = (connector: Connector) => {
    setConnectors(prev => [...prev, connector]);
  };

  const handleRemoveConnector = (id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateConnector = (updatedConnector: Connector) => {
    setConnectors(prev =>
      prev.map(c => (c.id === updatedConnector.id ? updatedConnector : c))
    );
  };

  // Send message flow with streaming and artifact parser
  const handleSendMessage = async (content: string, attachments: Attachment[] = []) => {
    if (!content.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments
    };

    const assistantMessageId = `msg-asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    // Update conversation state with user message and pending assistant message
    const updatedMessages = [...currentConversation.messages, userMessage, initialAssistantMessage];
    
    // Auto title if first message
    let newTitle = currentConversation.title;
    if (currentConversation.messages.length === 0) {
      newTitle = content.slice(0, 36) + (content.length > 36 ? '...' : '');
    }

    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversationId
          ? {
              ...c,
              title: newTitle,
              updatedAt: Date.now(),
              messages: updatedMessages
            }
          : c
      )
    );

    setIsStreaming(true);

    try {
      let accumulatedText = '';
      let accumulatedThinking = '';
      let groundingData: any = null;

      await streamChat({
        messages: updatedMessages.slice(0, -1), // Send history including new user message
        thinking: settings.thinkingMode,
        webSearch: plugins.some(p => p.id === 'web-search' && p.enabled),
        activePlugins: plugins,
        activeConnectors: connectors,
        customSystemPrompt: settings.customSystemPrompt,
        temperature: settings.temperature,
        attachments,
        onChunk: (chunkText: string, grounding?: any) => {
          accumulatedText += chunkText;
          if (grounding) {
            groundingData = grounding;
          }

          // Parse any artifacts generated in stream
          const parsed = extractArtifacts(accumulatedText);

          // Update message in conversation
          setConversations(prevConversations =>
            prevConversations.map(c => {
              if (c.id !== activeConversationId) return c;
              return {
                ...c,
                messages: c.messages.map(m => {
                  if (m.id !== assistantMessageId) return m;
                  return {
                    ...m,
                    content: accumulatedText,
                    thinking: accumulatedThinking || undefined,
                    artifacts: parsed.artifacts.length > 0 ? parsed.artifacts : undefined,
                    groundingMetadata: groundingData || undefined
                  };
                })
              };
            })
          );

          // If a new artifact was created, auto-select it
          if (parsed.artifacts.length > 0) {
            const latest = parsed.artifacts[parsed.artifacts.length - 1];
            setActiveArtifact(prev => (prev?.id === latest.id ? latest : prev || latest));
          }
        },
        onError: (err: string) => {
          setConversations(prevConversations =>
            prevConversations.map(c => {
              if (c.id !== activeConversationId) return c;
              return {
                ...c,
                messages: c.messages.map(m => {
                  if (m.id !== assistantMessageId) return m;
                  return {
                    ...m,
                    content: m.content || `I encountered an issue generating the response: ${err}. Please try again.`
                  };
                })
              };
            })
          );
        },
        onDone: () => {
          setIsStreaming(false);
        }
      });
    } catch (error: any) {
      console.error('Streaming error:', error);
      setConversations(prevConversations =>
        prevConversations.map(c => {
          if (c.id !== activeConversationId) return c;
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id !== assistantMessageId) return m;
              return {
                ...m,
                content: m.content || `I encountered an issue generating the response: ${error.message || 'Network error'}. Please try again.`
              };
            })
          };
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Update artifact in current conversation
  const handleUpdateArtifact = (updatedArtifact: Artifact) => {
    setActiveArtifact(updatedArtifact);
    setConversations(prevConversations =>
      prevConversations.map(c => {
        if (c.id !== activeConversationId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (!m.artifacts) return m;
            return {
              ...m,
              artifacts: m.artifacts.map(art => (art.id === updatedArtifact.id ? updatedArtifact : art))
            };
          })
        };
      })
    );
  };

  const handleWebsiteGenerated = (artifact: Artifact) => {
    setActiveArtifact(artifact);
    setActiveView('chat');
  };

  return (
    <div className="flex h-screen w-screen bg-[#101013] text-zinc-100 overflow-hidden font-sans antialiased">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setActiveView('chat');
        }}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        plugins={plugins}
        connectors={connectors}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 h-full flex overflow-hidden relative">
        {/* Chat Workspace View */}
        {activeView === 'chat' && (
          <div className="flex-1 h-full flex overflow-hidden">
            {/* Messages Chat Area */}
            <div className={`h-full flex flex-col transition-all duration-300 ${activeArtifact ? 'w-full lg:w-1/2' : 'w-full'}`}>
              <ChatArea
                messages={currentConversation.messages}
                isStreaming={isStreaming}
                onSendMessage={handleSendMessage}
                onStopStreaming={() => setIsStreaming(false)}
                activeArtifact={activeArtifact}
                onOpenArtifact={(art) => setActiveArtifact(art)}
                plugins={plugins}
                connectors={connectors}
                settings={settings}
                onTogglePlugin={handleTogglePlugin}
                onOpenConnectors={() => setActiveView('connectors')}
                onOpenStudio={() => setActiveView('studio')}
                onSelectView={setActiveView}
                activeModelId={activeModelId}
                onSelectModel={(modelId) => setActiveModelId(modelId)}
              />
            </div>

            {/* Split Screen Artifact Canvas */}
            {activeArtifact && (
              <div className="hidden lg:block w-1/2 h-full">
                <ArtifactCanvas
                  artifact={activeArtifact}
                  onClose={() => setActiveArtifact(null)}
                  onUpdateArtifact={handleUpdateArtifact}
                />
              </div>
            )}
          </div>
        )}

        {/* AI Image Studio View */}
        {activeView === 'image' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ImageStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* AI Video Studio View */}
        {activeView === 'video' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <VideoStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* AI Coding IDE View */}
        {activeView === 'coding' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <CodingStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* AI Audio Studio View */}
        {activeView === 'audio' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <AudioStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* AI Writing Studio View */}
        {activeView === 'writing' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <WritingStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* AI Deep Research Studio View */}
        {activeView === 'research' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ResearchStudio onClose={() => setActiveView('chat')} />
          </div>
        )}

        {/* ChatBasic Instant Answer View */}
        {activeView === 'chatbasic' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ChatBasic
              onClose={() => setActiveView('chat')}
              onOpenArenaWithPrompt={(promptText) => {
                setArenaInitialPrompt(promptText);
                setActiveView('arena');
              }}
              onSelectView={setActiveView}
            />
          </div>
        )}

        {/* Multi-Model Arena Battle View (Side-by-Side) */}
        {activeView === 'arena' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ModelArena
              initialPrompt={arenaInitialPrompt}
              onClose={() => setActiveView('chat')}
              onSelectView={setActiveView}
            />
          </div>
        )}

        {/* 12 Model Families Hub View */}
        {activeView === 'models' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ModelFamiliesHub
              onSelectModelForChat={(modelId) => {
                setActiveModelId(modelId);
                setActiveView('chat');
              }}
              onClose={() => setActiveView('chat')}
            />
          </div>
        )}

        {/* Website Studio View */}
        {activeView === 'studio' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <WebsiteStudio
              onWebsiteGenerated={handleWebsiteGenerated}
              onClose={() => setActiveView('chat')}
            />
          </div>
        )}

        {/* Plugins Manager View */}
        {activeView === 'plugins' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <PluginsManager
              plugins={plugins}
              onTogglePlugin={handleTogglePlugin}
              onClose={() => setActiveView('chat')}
            />
          </div>
        )}

        {/* Connectors Manager View */}
        {activeView === 'connectors' && (
          <div className="flex-1 h-full overflow-y-auto bg-[#141417]">
            <ConnectorsManager
              connectors={connectors}
              onAddConnector={handleAddConnector}
              onRemoveConnector={handleRemoveConnector}
              onUpdateConnector={handleUpdateConnector}
              onClose={() => setActiveView('chat')}
            />
          </div>
        )}

        {/* Mobile Fullscreen Artifact Modal */}
        {activeArtifact && (
          <div className="lg:hidden fixed inset-0 z-40 bg-[#141417]">
            <ArtifactCanvas
              artifact={activeArtifact}
              onClose={() => setActiveArtifact(null)}
              onUpdateArtifact={handleUpdateArtifact}
            />
          </div>
        )}
      </main>

      {/* 3. Settings & Directives Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
