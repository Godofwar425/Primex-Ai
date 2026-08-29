export type AIStudioView = 
  | 'chat' 
  | 'chatbasic'
  | 'image' 
  | 'video' 
  | 'coding' 
  | 'audio' 
  | 'writing' 
  | 'research' 
  | 'arena' 
  | 'models' 
  | 'studio' 
  | 'plugins' 
  | 'connectors';

export interface AIModelInfo {
  id: string;
  name: string;
  family: string;
  company: string;
  category: 'chatbot' | 'reasoning' | 'code' | 'multimodal' | 'open_source';
  badge: string;
  accentColor: string;
  description: string;
  contextWindow: string;
  strengths: string[];
  systemPromptPreset: string;
  isFreeUnlimited: boolean;
}

export interface ImageGenResult {
  id: string;
  prompt: string;
  engine: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
  seed: number;
  createdAt: number;
}

export interface VideoGenResult {
  id: string;
  prompt: string;
  engine: string;
  cameraMotion: string;
  durationSeconds: number;
  fps: number;
  videoPreviewUrl: string;
  thumbnailUrl: string;
  createdAt: number;
}

export interface AudioGenResult {
  id: string;
  title: string;
  engine: string;
  type: 'music' | 'voice' | 'cleaned' | 'cleaner';
  prompt: string;
  genre?: string;
  voiceName?: string;
  duration: string;
  waveform: number[];
  audioDataUri?: string;
  lyrics?: string;
  createdAt: number;
}

export interface ArenaSession {
  id: string;
  prompt: string;
  selectedModels: string[];
  responses: Record<string, {
    modelId: string;
    modelName: string;
    content: string;
    status: 'pending' | 'streaming' | 'completed' | 'error';
    durationMs: number;
    tokens: number;
  }>;
  createdAt: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  base64?: string;
  mimeType?: string;
  textContent?: string;
}

export interface Artifact {
  id: string;
  identifier: string;
  title: string;
  type: 'code' | 'html' | 'website' | 'svg' | 'markdown' | 'react' | 'javascript' | 'python';
  language: string;
  content: string;
  createdAt: number;
  version: number;
}

export interface GroundingSource {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
  groundingChunks?: GroundingSource[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thinking?: string;
  modelId?: string;
  artifacts?: Artifact[];
  groundingMetadata?: GroundingMetadata;
  attachments?: Attachment[];
  pluginExecutions?: Array<{
    pluginId: string;
    action: string;
    output: string;
    success: boolean;
  }>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  activeArtifactId?: string;
  modelId?: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'code' | 'web' | 'analytics' | 'vision' | 'api';
  icon: string;
  enabled: boolean;
  featured?: boolean;
}

export interface Connector {
  id: string;
  name: string;
  type: 'github' | 'postgres' | 'rest_api' | 'notion' | 'files';
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  contextData?: Record<string, any>;
  lastSynced?: number;
}

export interface UserSettings {
  model: string;
  thinkingMode: boolean;
  thinkingLevel: 'HIGH' | 'LOW' | 'MINIMAL';
  temperature: number;
  customSystemPrompt: string;
  unlimitedMode: boolean;
  defaultTheme: 'dark' | 'light' | 'claude';
}
