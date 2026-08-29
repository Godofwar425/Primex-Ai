import React, { useState, useEffect, useRef } from 'react';
import { AI_VIDEO_ENGINES } from '../data/aiCatalog.ts';
import { VideoGenResult } from '../types/index.ts';
import { 
  Film, 
  Play, 
  Pause, 
  Sparkles, 
  RefreshCw, 
  Camera, 
  Clock, 
  Layers, 
  Download, 
  Share2, 
  SlidersHorizontal,
  Video as VideoIcon
} from 'lucide-react';

interface VideoStudioProps {
  onClose: () => void;
}

const CAMERA_MOTIONS = [
  { id: 'cinematic-orbit', name: '360° Orbit', icon: '🔄', desc: 'Smooth rotational camera sweep' },
  { id: 'fpv-drone', name: 'FPV Drone Dive', icon: '🦅', desc: 'High-speed dynamic flythrough' },
  { id: 'dolly-zoom', name: 'Vertigo Dolly Zoom', icon: '🔍', desc: 'Dramatic optical perspective shift' },
  { id: 'pan-tilt', name: 'Smooth Pan & Tilt', icon: '📐', desc: 'Horizontal landscape tracking' },
  { id: 'static-tripod', name: 'Cinematic Static', icon: '🎥', desc: 'Locked-off high-detail frame' }
];

export function VideoStudio({ onClose }: VideoStudioProps) {
  const [prompt, setPrompt] = useState('An ultra-cinematic slow motion aerial shot of a bioluminescent waterfall cascading into a glowing alien lagoon at twilight, 4K HDR');
  const [selectedEngine, setSelectedEngine] = useState('sora');
  const [selectedMotion, setSelectedMotion] = useState('cinematic-orbit');
  const [duration, setDuration] = useState(6);
  const [motionStrength, setMotionStrength] = useState(75);
  const [fps, setFps] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [videoHistory, setVideoHistory] = useState<VideoGenResult[]>([
    {
      id: 'vid-1',
      prompt: 'Aerial bioluminescent waterfall cascading into an alien lagoon at twilight',
      engine: 'sora',
      cameraMotion: 'cinematic-orbit',
      durationSeconds: 6,
      fps: 60,
      videoPreviewUrl: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      createdAt: Date.now() - 1000 * 60 * 20
    },
    {
      id: 'vid-2',
      prompt: 'Hypercar racing through a futuristic neon cyber-city under heavy thunderstorm rain',
      engine: 'runway-gen-3',
      cameraMotion: 'fpv-drone',
      durationSeconds: 5,
      fps: 60,
      videoPreviewUrl: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      createdAt: Date.now() - 1000 * 60 * 45
    },
    {
      id: 'vid-3',
      prompt: 'Majestic celestial eagle made of solar flare plasma soaring past Saturn rings',
      engine: 'google-veo',
      cameraMotion: 'dolly-zoom',
      durationSeconds: 10,
      fps: 60,
      videoPreviewUrl: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      createdAt: Date.now() - 1000 * 60 * 90
    }
  ]);

  const [activeVideo, setActiveVideo] = useState<VideoGenResult>(videoHistory[0]);

  // Live Canvas Particle Video Simulation Engine
  useEffect(() => {
    let animId: number;
    let time = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Draw background gradient based on active engine
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (activeVideo.engine === 'sora') {
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#020617');
      } else if (activeVideo.engine === 'runway-gen-3') {
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(0.5, '#431407');
        grad.addColorStop(1, '#09090b');
      } else {
        grad.addColorStop(0, '#042f2e');
        grad.addColorStop(0.5, '#064e3b');
        grad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) {
        time += 0.02;
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 0.3));
      }

      // Draw animated particle nebulae/waves representing physical fluid scene motion
      const numRings = 16;
      for (let i = 0; i < numRings; i++) {
        const radius = (i * 22 + Math.sin(time + i * 0.4) * 20) % (w / 1.6);
        ctx.beginPath();
        ctx.arc(w / 2 + Math.sin(time * 0.8) * 30, h / 2 + Math.cos(time * 0.7) * 20, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(i * 20 + time * 30) % 360}, 80%, 65%, ${0.15 + Math.sin(time + i) * 0.08})`;
        ctx.lineWidth = 2 + Math.sin(time + i) * 1.5;
        ctx.stroke();
      }

      // Flowing luminous particles
      for (let j = 0; j < 40; j++) {
        const px = (Math.sin(j * 99 + time * 1.2) * 0.5 + 0.5) * w;
        const py = (Math.cos(j * 43 + time * 0.9) * 0.5 + 0.5) * h;
        const size = 2 + (j % 4);

        ctx.fillStyle = `hsla(${(j * 35 + time * 50) % 360}, 90%, 75%, 0.8)`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Camera HUD overlay
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`REC [${activeVideo.engine.toUpperCase()}] • ${activeVideo.durationSeconds}s • ${fps} FPS`, 16, 24);
      ctx.fillText(`CAMERA: ${activeVideo.cameraMotion.toUpperCase()}`, 16, 40);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeVideo, fps]);

  const handleGenerateVideo = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newVid: VideoGenResult = {
        id: `vid-${Date.now()}`,
        prompt: prompt.trim(),
        engine: selectedEngine as any,
        cameraMotion: selectedMotion,
        durationSeconds: duration,
        fps: fps,
        videoPreviewUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        createdAt: Date.now()
      };

      setVideoHistory(prev => [newVid, ...prev]);
      setActiveVideo(newVid);
      setIsGenerating(false);
      setPlaybackProgress(0);
    }, 1800);
  };

  const activeEngineObj = AI_VIDEO_ENGINES.find(e => e.id === selectedEngine) || AI_VIDEO_ENGINES[0];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Film className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Video Generation Studio</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Create high-framerate cinematic videos with <strong>Sora, Runway Gen-3, Google Veo, Kling AI, Pika 2.0, Luma Dream Machine, & Hailuo AI</strong>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium self-start sm:self-auto transition-all"
        >
          Back to Hub
        </button>
      </div>

      {/* Engine Carousel */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Select AI Video Engine
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {AI_VIDEO_ENGINES.map((engine) => {
            const isSelected = selectedEngine === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{engine.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{engine.company}</div>
                <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-cyan-400 font-mono">
                  {engine.badge.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio: Controls + Live Video Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Video Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <VideoIcon className="w-3.5 h-3.5 text-cyan-400" />
              Scene & Motion Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe motion dynamics, camera movement, lighting, and scene action..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Camera Motion */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              Camera Trajectory
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAMERA_MOTIONS.map((motion) => (
                <button
                  key={motion.id}
                  onClick={() => setSelectedMotion(motion.id)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                    selectedMotion === motion.id
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-white font-medium'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base">{motion.icon}</span>
                  <div className="truncate">
                    <div className="font-semibold text-[11px] truncate">{motion.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Duration & Motion Strength */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Scene Duration
                </span>
                <span className="font-mono text-zinc-200">{duration} Seconds</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 cursor-pointer h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span className="flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                  Motion Fluidity Strength
                </span>
                <span className="font-mono text-zinc-200">{motionStrength}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={motionStrength}
                onChange={(e) => setMotionStrength(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 cursor-pointer h-1.5 rounded"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:brightness-110 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                Rendering Frames with {activeEngineObj.name}...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                Generate Scene with {activeEngineObj.name} (Free)
              </>
            )}
          </button>
        </div>

        {/* Right Video Canvas & Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-semibold text-zinc-200">{activeVideo.prompt.slice(0, 45)}...</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-cyan-400">
                {activeVideo.engine.toUpperCase()} • {activeVideo.durationSeconds}s
              </span>
            </div>

            {/* Video Canvas Stage */}
            <div className="my-3 relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-spin">
                    <Film className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">Rendering Temporal Consistency...</div>
                  <div className="text-xs text-zinc-500">Calculating 3D camera trajectory</div>
                </div>
              ) : (
                <>
                  <canvas ref={canvasRef} width={640} height={360} className="w-full h-full object-cover" />
                  {/* Overlay play button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </>
              )}
            </div>

            {/* Timeline Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-100"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-zinc-200 hover:text-cyan-400 font-medium"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {((playbackProgress / 100) * activeVideo.durationSeconds).toFixed(1)}s / {activeVideo.durationSeconds}.0s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video History Gallery */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Rendered Clips ({videoHistory.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {videoHistory.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`p-3 rounded-xl border cursor-pointer bg-zinc-900/60 transition-all ${
                    activeVideo.id === vid.id
                      ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1.5">
                    <span>{vid.engine.toUpperCase()}</span>
                    <span>{vid.durationSeconds}s</span>
                  </div>
                  <p className="text-xs text-zinc-200 line-clamp-2">{vid.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
