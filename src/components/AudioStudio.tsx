import React, { useState, useEffect, useRef } from 'react';
import { AI_AUDIO_TOOLS } from '../data/aiCatalog.ts';
import { AudioGenResult } from '../types/index.ts';
import { 
  Music, 
  Mic, 
  Play, 
  Pause, 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  Sliders, 
  Wand2, 
  Check, 
  Download, 
  Radio, 
  Headphones, 
  Disc3
} from 'lucide-react';

interface AudioStudioProps {
  onClose: () => void;
}

const VOICES = [
  { id: 'adam-narrator', name: 'Adam (Deep Narrator)', lang: 'US English', desc: 'Authoritative, calm, cinematic documentary' },
  { id: 'rachel-conversational', name: 'Rachel (Warm & Engaging)', lang: 'US English', desc: 'Friendly, natural, conversational assistant' },
  { id: 'antoni-storyteller', name: 'Antoni (Dynamic Drama)', lang: 'UK English', desc: 'Expressive, storytelling, audiobooks' },
  { id: 'bella-clarity', name: 'Bella (Crystal Crisp)', lang: 'US English', desc: 'Energetic, modern, product walkthroughs' }
];

const GENRES = [
  { id: 'synthwave', name: '80s Synthwave / Cyberpunk', bpm: 128, mood: 'Nostalgic & Energetic' },
  { id: 'lofi-chill', name: 'Lo-Fi Chill Hop', bpm: 85, mood: 'Relaxed & Melancholic' },
  { id: 'cinematic-orchestra', name: 'Epic Cinematic Orchestra', bpm: 110, mood: 'Heroic & Grandiose' },
  { id: 'pop-dance', name: 'Modern Electropop', bpm: 124, mood: 'Upbeat & Catchy' },
  { id: 'ambient-piano', name: 'Atmospheric Ambient Piano', bpm: 72, mood: 'Dreamy & Peaceful' }
];

export function AudioStudio({ onClose }: AudioStudioProps) {
  const [selectedTool, setSelectedTool] = useState('suno-v3');
  const [studioMode, setStudioMode] = useState<'music' | 'voice' | 'cleaner'>('music');
  const [prompt, setPrompt] = useState('A soaring synthwave anthem with pulsating analog basslines, dreamy vocal hooks, and neon 80s arpeggios');
  const [selectedGenre, setSelectedGenre] = useState('synthwave');
  const [selectedVoice, setSelectedVoice] = useState('adam-narrator');
  const [voiceSpeechText, setVoiceSpeechText] = useState('Welcome to OmniAI Studio. All major frontier AI models, voice synthesizers, and creative engines are unified here for free with unlimited access.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioItem, setActiveAudioItem] = useState<AudioGenResult | null>(null);

  const [tracks, setTracks] = useState<AudioGenResult[]>([
    {
      id: 'audio-1',
      title: 'Neon Odyssey (Synthwave Anthem)',
      engine: 'suno-v3',
      type: 'music',
      genre: 'Synthwave',
      prompt: 'Pulsating analog basslines with dreamy neon arpeggios',
      duration: '3:24',
      waveform: [35, 60, 80, 45, 90, 100, 75, 40, 65, 85, 95, 60, 40, 70, 85, 50, 60, 90, 100, 75],
      createdAt: Date.now() - 1000 * 60 * 15
    },
    {
      id: 'audio-2',
      title: 'Quantum Field Master Narration',
      engine: 'elevenlabs',
      type: 'voice',
      voiceName: 'Adam (Deep Narrator)',
      prompt: 'Deep cinematic documentary narration on theoretical astrophysics',
      duration: '1:12',
      waveform: [20, 40, 55, 70, 60, 45, 80, 75, 50, 65, 40, 30, 70, 85, 60, 40, 50, 65, 40, 25],
      createdAt: Date.now() - 1000 * 60 * 35
    },
    {
      id: 'audio-3',
      title: 'Celestial Dreamscape No. 7',
      engine: 'udio',
      type: 'music',
      genre: 'Lo-Fi Chill Hop',
      prompt: 'Warm vinyl crackle, lush Rhodes piano chords, and soothing bass',
      duration: '2:45',
      waveform: [30, 45, 50, 65, 70, 60, 55, 65, 75, 60, 50, 45, 60, 70, 65, 50, 45, 55, 60, 40],
      createdAt: Date.now() - 1000 * 60 * 70
    }
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Web Audio API Synthesizer loop for preview
  const playSynthesizedMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);
      osc.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 1.6);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
      oscillatorRef.current = osc;

      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2600);
    } catch (e) {
      console.warn('Web Audio synthesis not allowed yet without user gesture');
    }
  };

  // Browser Speech Synthesis for ElevenLabs preview
  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceSpeechText);
      utterance.rate = 0.95;
      utterance.pitch = selectedVoice.includes('adam') ? 0.8 : 1.1;
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const newTrack: AudioGenResult = {
        id: `audio-${Date.now()}`,
        title: studioMode === 'music' 
          ? `${prompt.slice(0, 24)} (Full Track)` 
          : `${selectedVoice.split('-')[0].toUpperCase()} Voice Synthesis`,
        engine: selectedTool as any,
        type: studioMode,
        genre: studioMode === 'music' ? selectedGenre : undefined,
        voiceName: studioMode === 'voice' ? selectedVoice : undefined,
        prompt: studioMode === 'music' ? prompt : voiceSpeechText,
        duration: studioMode === 'music' ? '3:15' : '0:45',
        waveform: Array.from({ length: 20 }, () => Math.floor(Math.random() * 70 + 30)),
        createdAt: Date.now()
      };

      setTracks(prev => [newTrack, ...prev]);
      setActiveAudioItem(newTrack);
      setIsGenerating(false);

      if (studioMode === 'voice') {
        handlePlayVoice();
      } else {
        playSynthesizedMelody();
      }
    }, 1500);
  };

  const activeToolObj = AI_AUDIO_TOOLS.find(t => t.id === selectedTool) || AI_AUDIO_TOOLS[0];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Music className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Music & Audio Studio</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-medium">
              Free & No Limits
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Combine <strong>Suno v3, Udio, ElevenLabs Voice AI, Adobe Podcast, Descript, & AIVA</strong> in one unified workstation.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium self-start sm:self-auto transition-all"
        >
          Back to Hub
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setStudioMode('music');
            setSelectedTool('suno-v3');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            studioMode === 'music'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          Music Generation (Suno / Udio / AIVA)
        </button>

        <button
          onClick={() => {
            setStudioMode('voice');
            setSelectedTool('elevenlabs');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            studioMode === 'voice'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          Voice Cloning & Speech (ElevenLabs)
        </button>

        <button
          onClick={() => {
            setStudioMode('cleaner');
            setSelectedTool('adobe-podcast');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            studioMode === 'cleaner'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Headphones className="w-4 h-4" />
          Studio Audio Cleaner (Adobe Podcast / Descript)
        </button>
      </div>

      {/* Engine Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {AI_AUDIO_TOOLS.map((tool) => {
          const isSelected = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-purple-500/10 border-purple-500/60 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="text-xs font-bold truncate">{tool.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{tool.company}</div>
              <div className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-purple-400 font-mono">
                {tool.badge.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Controls + Synthesizer Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
          {studioMode === 'music' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  Musical Style & Instrumentation Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe instruments, tempo, vocal style, key signature, mood..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-purple-400" />
                  Genre & Production Preset
                </label>
                <div className="space-y-1.5">
                  {GENRES.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => setSelectedGenre(genre.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        selectedGenre === genre.id
                          ? 'bg-purple-500/20 border-purple-500/60 text-white font-medium'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-semibold text-zinc-200">{genre.name}</div>
                      <span className="font-mono text-[10px] text-purple-400">{genre.bpm} BPM</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : studioMode === 'voice' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  Script Text for Speech Synthesis
                </label>
                <textarea
                  value={voiceSpeechText}
                  onChange={(e) => setVoiceSpeechText(e.target.value)}
                  rows={4}
                  placeholder="Enter text to synthesize with human-realistic voice..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  Select ElevenLabs Voice Profile
                </label>
                <div className="space-y-1.5">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex flex-col gap-0.5 text-xs transition-all ${
                        selectedVoice === v.id
                          ? 'bg-purple-500/20 border-purple-500/60 text-white font-medium'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-semibold text-zinc-200">{v.name}</div>
                      <div className="text-[10px] text-zinc-500">{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-purple-400" />
                  Studio Sound Enhancement
                </div>
                <p className="text-xs text-zinc-400">
                  Upload audio or test with synthetic samples to remove background chatter, air conditioning rumble, and room echo.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Speech Isolation:</span>
                  <span className="text-purple-400 font-bold">100% (Lossless)</span>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Synthesizing Audio Waveforms...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Synthesize with {activeToolObj.name} (Free)
              </>
            )}
          </button>
        </div>

        {/* Right Audio Deck & Waveform (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="font-semibold text-zinc-200">
                  {activeAudioItem ? activeAudioItem.title : tracks[0].title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-purple-400">
                {(activeAudioItem || tracks[0]).engine.toUpperCase()}
              </span>
            </div>

            {/* Live Audio Visualizer Spectrum */}
            <div className="my-6 p-6 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-center gap-1.5 h-36">
              {(activeAudioItem || tracks[0]).waveform.map((height, i) => (
                <div
                  key={i}
                  className={`w-2.5 rounded-full transition-all duration-150 ${
                    isPlayingAudio ? 'bg-gradient-to-t from-purple-600 to-pink-400' : 'bg-zinc-700'
                  }`}
                  style={{
                    height: isPlayingAudio ? `${Math.max(15, (height * (Math.sin(Date.now() / 200 + i) * 0.4 + 0.8)))}%` : `${height}%`
                  }}
                />
              ))}
            </div>

            {/* Audio Control Deck */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (studioMode === 'voice') {
                      handlePlayVoice();
                    } else {
                      playSynthesizedMelody();
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center transition-all shadow-md shadow-purple-500/30"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    {isPlayingAudio ? 'Playing Live Audio Synthesizer...' : 'Ready to Play'}
                  </div>
                  <div className="text-[10px] text-zinc-500">Duration: {(activeAudioItem || tracks[0]).duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  WAV / MP3
                </button>
              </div>
            </div>
          </div>

          {/* Audio Library List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Generated Audio Tracks ({tracks.length})
            </div>
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => setActiveAudioItem(track)}
                  className={`p-3 rounded-xl border cursor-pointer bg-zinc-900/60 flex items-center justify-between transition-all ${
                    (activeAudioItem || tracks[0]).id === track.id
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-purple-400">
                      {track.type === 'music' ? <Music className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-200">{track.title}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {track.engine.toUpperCase()} • {track.genre || track.voiceName || 'Enhanced Audio'}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-400">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
