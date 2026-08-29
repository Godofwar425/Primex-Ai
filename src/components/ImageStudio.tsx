import React, { useState } from 'react';
import { AI_IMAGE_ENGINES } from '../data/aiCatalog.ts';
import { ImageGenResult } from '../types/index.ts';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Wand2, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Maximize2, 
  Palette, 
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink,
  Flame
} from 'lucide-react';

interface ImageStudioProps {
  onClose: () => void;
}

const STYLES = [
  { id: 'photorealistic', name: 'Photorealistic 8K', icon: '📸' },
  { id: 'cinematic', name: 'Cinematic Movie Still', icon: '🎬' },
  { id: 'anime', name: 'Studio Ghibli / Anime', icon: '🌸' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '🌃' },
  { id: 'concept-art', name: 'Epic Concept Art', icon: '🎨' },
  { id: '3d-render', name: 'Octane 3D Render', icon: '💎' },
  { id: 'oil-painting', name: 'Classical Oil Canvas', icon: '🖌️' },
  { id: 'minimalist', name: 'Minimalist Vector', icon: '📐' }
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)', preview: '1:1' },
  { id: '16:9', label: 'Landscape (16:9)', preview: '16:9' },
  { id: '9:16', label: 'Portrait Story (9:16)', preview: '9:16' },
  { id: '4:3', label: 'Classic (4:3)', preview: '4:3' }
];

const PROMPT_SUGGESTIONS = [
  'Futuristic crystalline solarpunk city floating above iridescent clouds, cinematic golden hour lighting, 8k octane render',
  'Cyberpunk samurai warrior standing in neon-lit Tokyo rain, photorealistic reflections, volumetric fog, Unreal Engine 5',
  'Studio Ghibli style magical floating library inside an ancient glowing redwood tree, fireflies, whimsical watercolor atmosphere',
  'Hyper-detailed mechanical clockwork dragon with glowing sapphire core and polished brass gears, macro photography',
  'Minimalist Bauhaus architecture villa overlooking tranquil Mediterranean sea, mid-century modern aesthetic, soft morning sunlight'
];

const CURATED_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80'
];

export function ImageStudio({ onClose }: ImageStudioProps) {
  const [selectedEngine, setSelectedEngine] = useState('flux-1-schnell');
  const [prompt, setPrompt] = useState(PROMPT_SUGGESTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [gallery, setGallery] = useState<ImageGenResult[]>([
    {
      id: 'img-1',
      prompt: 'Futuristic crystalline solarpunk city floating above iridescent clouds, cinematic golden hour lighting, 8k octane render',
      engine: 'flux-1-schnell',
      style: 'photorealistic',
      aspectRatio: '16:9',
      imageUrl: CURATED_SAMPLE_IMAGES[0],
      seed: 849204,
      createdAt: Date.now() - 1000 * 60 * 12
    },
    {
      id: 'img-2',
      prompt: 'Cyberpunk samurai warrior standing in neon-lit Tokyo rain, photorealistic reflections, volumetric fog',
      engine: 'midjourney-v6',
      style: 'cyberpunk',
      aspectRatio: '16:9',
      imageUrl: CURATED_SAMPLE_IMAGES[1],
      seed: 582910,
      createdAt: Date.now() - 1000 * 60 * 30
    },
    {
      id: 'img-3',
      prompt: 'Hyper-detailed steampunk clockwork heart with glowing sapphire quartz gears',
      engine: 'dalle-3',
      style: 'concept-art',
      aspectRatio: '1:1',
      imageUrl: CURATED_SAMPLE_IMAGES[2],
      seed: 104928,
      createdAt: Date.now() - 1000 * 60 * 55
    }
  ]);

  const [previewImage, setPreviewImage] = useState<ImageGenResult>(gallery[0]);

  const activeEngineObj = AI_IMAGE_ENGINES.find(e => e.id === selectedEngine) || AI_IMAGE_ENGINES[0];

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    setTimeout(() => {
      const seed = Math.floor(Math.random() * 9999999);
      const imgIndex = (gallery.length + seed) % CURATED_SAMPLE_IMAGES.length;
      const generatedImageUrl = CURATED_SAMPLE_IMAGES[imgIndex];

      const newImage: ImageGenResult = {
        id: `img-${Date.now()}`,
        prompt: prompt.trim(),
        engine: selectedEngine as any,
        style: selectedStyle,
        aspectRatio: selectedAspectRatio,
        imageUrl: generatedImageUrl,
        seed: seed,
        createdAt: Date.now()
      };

      setGallery(prev => [newImage, ...prev]);
      setPreviewImage(newImage);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Image Generation Studio</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Create high-fidelity visuals with <strong>DALL·E 3, Midjourney v6, Stable Diffusion XL, FLUX.1, Adobe Firefly, Ideogram, & Leonardo AI</strong>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium self-start sm:self-auto transition-all"
        >
          Back to Hub
        </button>
      </div>

      {/* Engine Selection Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Select AI Image Engine
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {AI_IMAGE_ENGINES.map((engine) => {
            const isSelected = selectedEngine === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-pink-500/10 border-pink-500/60 shadow-lg shadow-pink-500/10 text-white'
                    : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{engine.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{engine.company}</div>
                <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-pink-400 inline-block font-mono">
                  {engine.badge.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace: Left Controls + Right Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Generation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
          {/* Prompt Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                Prompt
              </label>
              <button
                onClick={() => {
                  const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
                  setPrompt(random);
                }}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Inspire Me
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your visual concept in detail..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500/60 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Style Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              Artistic Style
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                    selectedStyle === style.id
                      ? 'bg-pink-500/20 border-pink-500/60 text-white font-medium'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <div className="truncate">
                    <div className="truncate font-medium">{style.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
              Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedAspectRatio(ratio.id)}
                  className={`py-2 rounded-xl border text-center text-xs font-mono transition-all ${
                    selectedAspectRatio === ratio.id
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {ratio.preview}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing with {activeEngineObj.name}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-Res Artwork ({activeEngineObj.name})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Canvas & Detail Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {previewImage && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Image Viewport */}
              <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
                <img
                  src={previewImage.imageUrl}
                  alt={previewImage.prompt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyPrompt(previewImage.prompt, previewImage.id)}
                    className="p-2 rounded-xl bg-black/70 backdrop-blur-md text-white hover:bg-black text-xs border border-white/10 flex items-center gap-1.5"
                    title="Copy Prompt"
                  >
                    {copiedId === previewImage.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Prompt</span>
                  </button>

                  <a
                    href={previewImage.imageUrl}
                    download="generated-artwork.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                {/* Engine Tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-pink-300 text-xs font-mono">
                  {AI_IMAGE_ENGINES.find(e => e.id === previewImage.engine)?.name || previewImage.engine}
                </div>
              </div>

              {/* Image Metadata Bar */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 space-y-2">
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {previewImage.prompt}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500 pt-1">
                  <span>Style: <strong className="text-zinc-300">{previewImage.style}</strong></span>
                  <span>Ratio: <strong className="text-zinc-300">{previewImage.aspectRatio}</strong></span>
                  <span>Seed: <strong className="text-pink-400">{previewImage.seed}</strong></span>
                  <span>Status: <strong className="text-emerald-400">Unlimited Tier</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* History Strip */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Studio Gallery ({gallery.length})</span>
              <span className="text-[10px] text-zinc-500 font-mono">Click to preview</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreviewImage(item)}
                  className={`aspect-video rounded-xl overflow-hidden cursor-pointer border relative group transition-all ${
                    previewImage?.id === item.id ? 'border-pink-500 ring-2 ring-pink-500/30' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[9px] text-zinc-200 line-clamp-1">{item.prompt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
