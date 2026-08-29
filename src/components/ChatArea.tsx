import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, Send, Paperclip, Globe, Brain, Terminal, Layout, 
  ArrowUp, Square, Loader2, FileText, Image as ImageIcon, X, 
  ChevronDown, ChevronRight, ExternalLink, Code2, Play, Mic, MicOff,
  Link2, CheckCircle2, Copy, Check, Film, Music, PenTool, BookOpen,
  Swords, Boxes, Zap
} from 'lucide-react';
import { Message, Artifact, Attachment, Plugin, Connector, UserSettings, AIStudioView, AIModelInfo } from '../types/index.ts';
import { CodeBlock } from './CodeBlock.tsx';
import { AI_CHATBOT_MODELS } from '../data/aiCatalog.ts';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onStopStreaming?: () => void;
  activeArtifact: Artifact | null;
  onOpenArtifact: (artifact: Artifact) => void;
  plugins: Plugin[];
  connectors: Connector[];
  settings: UserSettings;
  onTogglePlugin: (id: string) => void;
  onOpenConnectors: () => void;
  onOpenStudio: () => void;
  onSelectView?: (view: AIStudioView) => void;
  activeModelId?: string;
  onSelectModel?: (modelId: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onStopStreaming,
  activeArtifact,
  onOpenArtifact,
  plugins,
  connectors,
  settings,
  onTogglePlugin,
  onOpenConnectors,
  onOpenStudio,
  onSelectView,
  activeModelId = 'claude-3-7-sonnet',
  onSelectModel
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [selectedModel, setSelectedModel] = useState<string>(activeModelId);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isWebSearchEnabled = plugins.find(p => p.id === 'web-search')?.enabled ?? false;

  const currentModelObj = AI_CHATBOT_MODELS.find(m => m.id === selectedModel) || AI_CHATBOT_MODELS[0];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;

    onSendMessage(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle file uploads (Images, CSV, TXT, Code)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();

      if (isImage) {
        reader.onload = () => {
          setAttachments(prev => [
            ...prev,
            {
              id: `att-${Date.now()}-${Math.random()}`,
              name: file.name,
              type: file.type,
              size: file.size,
              base64: reader.result as string,
              mimeType: file.type
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = () => {
          setAttachments(prev => [
            ...prev,
            {
              id: `att-${Date.now()}-${Math.random()}`,
              name: file.name,
              type: file.type || 'text/plain',
              size: file.size,
              textContent: reader.result as string
            }
          ]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Speech to text toggle
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsRecording(false);
    }
  };

  const starterPrompts = [
    {
      title: 'Generate Full-Stack Web Application',
      desc: 'Build an interactive dashboard with dynamic data visualizations and responsive widgets',
      prompt: 'Build a production-ready interactive analytics dashboard with live KPI cards, time-series charts, and filter controls in a standalone single-page artifact.'
    },
    {
      title: 'Analyze Codebase & Refactor Architecture',
      desc: 'Review structural state logic, fix memory leaks, and generate TypeScript types',
      prompt: 'Review the architecture of a distributed event-driven message queue in TypeScript and propose an optimized zero-copy memory ring buffer.'
    },
    {
      title: 'Deep Research Synthesis & Citations',
      desc: 'Ground facts with live web search, scholarly verification, and comparative matrices',
      prompt: 'Conduct a deep research overview comparing transformer attention mechanisms with state space models (Mamba) for long-sequence audio and video processing.'
    },
    {
      title: 'Creative Worldbuilding & Code Sandbox',
      desc: 'Synthesize interactive physics simulations, game mechanics, or creative writing',
      prompt: 'Create a complete interactive 2D orbital gravity playground simulation in HTML5 Canvas with customizable planetary masses and gravitational vectors.'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#141417] text-zinc-100 relative overflow-hidden">
      {/* Top Universal Model Switcher & Studio Shortcuts Bar */}
      <div className="h-14 border-b border-zinc-800/80 bg-zinc-950/60 px-4 flex items-center justify-between shrink-0 backdrop-blur-md z-10">
        {/* Model Selector Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-100 shadow-sm transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentModelObj.accentColor || '#d97706' }} />
            <span>{currentModelObj.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-950 text-amber-400 font-mono">
              Free & No Limit
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Model Switcher Menu */}
          {isModelDropdownOpen && (
            <div className="absolute top-11 left-0 w-80 max-h-96 overflow-y-auto bg-zinc-900 border border-zinc-750 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                Select Active Frontier Model
              </div>
              {AI_CHATBOT_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    if (onSelectModel) onSelectModel(model.id);
                    setIsModelDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between text-xs transition-all ${
                    selectedModel === model.id
                      ? 'bg-amber-600/20 text-white font-semibold border border-amber-500/40'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.accentColor }} />
                      <span className="font-bold">{model.name}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{model.description}</div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 shrink-0 ml-1">
                    {model.company}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Studio View Shortcuts */}
        <div className="flex items-center gap-1.5">
          {onSelectView && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectView('chatbasic')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs flex items-center gap-1 font-semibold border border-amber-500/30 transition-all"
                title="ChatBasic - Direct, instant structured answers"
              >
                <Zap className="w-3 h-3 fill-current text-amber-400" />
                <span>ChatBasic</span>
              </button>
              <button
                onClick={() => onSelectView('arena')}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1 font-semibold border border-rose-500/30 transition-all"
                title="Side-by-Side Dual/Quad Model Battle Mode"
              >
                <Swords className="w-3 h-3 text-rose-400" />
                <span>Battle (Side-by-Side)</span>
              </button>
              <div className="hidden xl:flex items-center gap-1">
                <button
                  onClick={() => onSelectView('image')}
                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 font-medium border border-zinc-800 transition-all"
                  title="DALL-E, Midjourney, FLUX, SDXL"
                >
                  <ImageIcon className="w-3 h-3 text-pink-400" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => onSelectView('video')}
                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 font-medium border border-zinc-800 transition-all"
                  title="Sora, Runway, Veo, Kling"
                >
                  <Film className="w-3 h-3 text-cyan-400" />
                  <span>Video</span>
                </button>
                <button
                  onClick={() => onSelectView('coding')}
                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 font-medium border border-zinc-800 transition-all"
                  title="Cursor, Claude Code, Copilot"
                >
                  <Code2 className="w-3 h-3 text-emerald-400" />
                  <span>IDE</span>
                </button>
              </div>
            </div>
          )}

          {/* Web Search Chip Toggle */}
          <button
            onClick={() => onTogglePlugin('web-search')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              isWebSearchEnabled
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Live Web Search Grounding"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Active Artifact Indicator */}
          {activeArtifact && (
            <button
              onClick={() => onOpenArtifact(activeArtifact)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-950/30 transition-all"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Canvas Active</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Welcome & Empty State */
          <div className="max-w-3xl mx-auto py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-amber-900/30 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mb-2">
              All Major AI Tools Combined in One
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mb-6 leading-relaxed">
              Experience <strong>ChatGPT, Claude 3.7, Gemini 2.5, DeepSeek R1, Grok 3, Llama 3.3, DALL·E, Sora, Suno, & Cursor</strong> completely free with zero limits.
            </p>

            {/* Quick Starter Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {starterPrompts.map((starter, i) => (
                <div
                  key={i}
                  onClick={() => onSendMessage(starter.prompt, [])}
                  className="group bg-[#1a1a1f] hover:bg-[#22222a] border border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-xs sm:text-sm text-zinc-100 group-hover:text-amber-200 transition-colors">
                      {starter.title}
                    </h3>
                    <ArrowUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 rotate-45 transition-transform" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {starter.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.role === 'user' ? (
                  /* User Message */
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-zinc-800/90 text-zinc-100 rounded-2xl rounded-tr-sm px-4 py-3 border border-zinc-700/60 shadow-sm">
                      {/* User Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg text-xs text-zinc-300 border border-zinc-700">
                              {att.mimeType?.startsWith('image/') ? (
                                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-sky-400" />
                              )}
                              <span className="truncate max-w-[150px]">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant Message */
                  <div className="flex items-start gap-3.5">
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-amber-900/30">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Deep Thinking Accordion */}
                      {msg.thinking && (
                        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden text-xs">
                          <button
                            onClick={() => setExpandedThinking(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                            className="w-full px-3.5 py-2 flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-950/40"
                          >
                            <div className="flex items-center gap-2">
                              <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span className="font-semibold text-zinc-300">Deep Reasoning Chain</span>
                            </div>
                            {expandedThinking[msg.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                          {expandedThinking[msg.id] && (
                            <div className="p-3.5 text-zinc-400 text-xs font-mono whitespace-pre-wrap border-t border-zinc-800/80 bg-black/40 leading-relaxed">
                              {msg.thinking}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Markdown Body Content */}
                      <div className="prose prose-invert max-w-none text-sm text-zinc-200 leading-relaxed font-sans">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match ? match[1] : '';
                              const isInline = !match && !String(children).includes('\n');

                              if (isInline) {
                                return (
                                  <code className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                    {children}
                                  </code>
                                );
                              }

                              return (
                                <CodeBlock
                                  language={language || 'text'}
                                  value={String(children).replace(/\n$/, '')}
                                />
                              );
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Generated Interactive Artifact Buttons */}
                      {msg.artifacts && msg.artifacts.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {msg.artifacts.map((art) => (
                            <div
                              key={art.id}
                              onClick={() => onOpenArtifact(art)}
                              className="group flex items-center justify-between p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 hover:border-amber-500 cursor-pointer transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                  <Layout className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-amber-200 group-hover:text-amber-100">
                                    {art.title}
                                  </div>
                                  <div className="text-[10px] text-zinc-400 font-mono uppercase">
                                    Interactive {art.type} Artifact • Version {art.version}
                                  </div>
                                </div>
                              </div>

                              <button className="px-3 py-1 rounded-lg bg-amber-600/30 group-hover:bg-amber-600 text-amber-300 group-hover:text-white text-xs font-semibold transition-colors flex items-center gap-1">
                                <span>Open in Canvas</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Grounding Source Web Links */}
                      {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.groundingChunks.map((chunk, idx) => (
                            chunk.web?.uri ? (
                              <a
                                key={idx}
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-amber-300 transition-colors"
                              >
                                <Globe className="w-3 h-3 text-amber-500" />
                                <span className="truncate max-w-[180px]">{chunk.web.title || chunk.web.uri}</span>
                                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                              </a>
                            ) : null
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Live Streaming Indicator */}
            {isStreaming && (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>OmniAI Synthesizing Stream...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Composer & Toolbar */}
      <div className="p-3 sm:p-4 bg-zinc-950/80 border-t border-zinc-800/80">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Active Attachments Preview Chips */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
              {attachments.map((att) => (
                <div key={att.id} className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-lg text-xs text-zinc-200">
                  {att.mimeType?.startsWith('image/') ? (
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span className="truncate max-w-[120px]">{att.name}</span>
                  <button onClick={() => removeAttachment(att.id)} className="hover:text-red-400 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form Composer */}
          <form onSubmit={handleSubmit} className="relative bg-zinc-900 border border-zinc-750 focus-within:border-amber-500/60 rounded-2xl p-2.5 transition-all shadow-xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${currentModelObj.name} anything, request web apps, write code, or execute deep synthesis...`}
              rows={1}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none px-2 py-1 min-h-[42px] max-h-48"
            />

            {/* Input Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 px-1">
              <div className="flex items-center gap-1">
                {/* File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  title="Attach images, documents, or code files"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Speech to text */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isRecording ? 'bg-red-500/20 text-red-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                  title="Speech to Text"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              {/* Send / Stop Streaming Button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md transition-colors"
                  title="Stop Generating"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() && attachments.length === 0}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:hover:bg-amber-600 text-white shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                  title="Send Message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="text-[10px] text-center text-zinc-500 font-mono">
            OmniAI • 100% Free & Unlimited • Model: {currentModelObj.name}
          </div>
        </div>
      </div>
    </div>
  );
};
