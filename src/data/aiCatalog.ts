import { AIModelInfo } from '../types/index.ts';

// 1. All Major AI Chatbots & Assistants
export const AI_CHATBOT_MODELS: AIModelInfo[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    family: 'Claude',
    company: 'Anthropic',
    category: 'reasoning',
    badge: 'Artifacts + Hybrid Reasoning',
    accentColor: '#d97706',
    description: 'Premier hybrid reasoning model with instant artifact code preview, long-form synthesis, and full-stack engineering capability.',
    contextWindow: '200K Tokens',
    strengths: ['Interactive Web Artifacts', 'Deep Thinking', 'Complex Code Generation', 'Nuanced Writing'],
    systemPromptPreset: 'You are Claude 3.7 Sonnet, built by Anthropic. You create pristine live web applications, write thoughtful code, and explain complex concepts with unmatched clarity.',
    isFreeUnlimited: true
  },
  {
    id: 'gpt-4o-chatgpt',
    name: 'ChatGPT (GPT-4o / o3-mini)',
    family: 'GPT',
    company: 'OpenAI',
    category: 'chatbot',
    badge: 'OpenAI Flagship',
    accentColor: '#10b981',
    description: 'OpenAI multimodal flagship with high conversational emotional quotient, real-time code synthesis, and structured outputs.',
    contextWindow: '128K Tokens',
    strengths: ['Conversational Flow', 'Code Synthesis', 'Step-by-Step Explanations', 'Task Automation'],
    systemPromptPreset: 'You are ChatGPT powered by OpenAI GPT-4o. You provide accurate, friendly, and structured responses with high developer precision.',
    isFreeUnlimited: true
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro / Flash',
    family: 'Gemini',
    company: 'Google',
    category: 'multimodal',
    badge: 'Google 2M Ultra Context',
    accentColor: '#3b82f6',
    description: 'Next-generation Google model with immense 2M token context, live Google search grounding, and multimodal reasoning.',
    contextWindow: '2,000K Tokens',
    strengths: ['Massive Codebase Ingestion', 'Live Web Search', 'Multimodal Vision', 'Fast Streaming'],
    systemPromptPreset: 'You are Gemini 2.5 by Google DeepMind. You leverage world knowledge, deep multimodal reasoning, and search grounding to provide comprehensive answers.',
    isFreeUnlimited: true
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    family: 'Phi / GPT',
    company: 'Microsoft',
    category: 'chatbot',
    badge: 'Enterprise Productivity',
    accentColor: '#0ea5e9',
    description: 'Microsoft conversational assistant integrated with enterprise workspace skills, web search, and Office productivity intelligence.',
    contextWindow: '128K Tokens',
    strengths: ['Office Workflows', 'Business Strategy', 'Bing Web Grounding', 'Productivity Pipelines'],
    systemPromptPreset: 'You are Microsoft Copilot. You assist users with professional writing, enterprise analytics, technical code, and actionable productivity summaries.',
    isFreeUnlimited: true
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    family: 'Grok',
    company: 'xAI',
    category: 'reasoning',
    badge: 'Uncensored Real-Time',
    accentColor: '#f97316',
    description: 'xAI real-time conversational model with raw candor, deep mathematical reasoning, and live X/Twitter intelligence.',
    contextWindow: '128K Tokens',
    strengths: ['Real-Time Events', 'Mathematical Reasoning', 'Unbiased Logic', 'Scientific Analysis'],
    systemPromptPreset: 'You are Grok 3 by xAI. You provide bold, candid, highly intelligent and witty answers with uncompromising technical truth.',
    isFreeUnlimited: true
  },
  {
    id: 'meta-ai-llama-3-3',
    name: 'Meta AI (Llama 3.3 70B)',
    family: 'Llama',
    company: 'Meta',
    category: 'open_source',
    badge: 'Open Weights Leader',
    accentColor: '#6366f1',
    description: 'Meta premier open weights model matching proprietary frontier capabilities with blazing fast latency.',
    contextWindow: '128K Tokens',
    strengths: ['Open Science', 'Code Generation', 'Summarization', 'Creative Storytelling'],
    systemPromptPreset: 'You are Meta AI powered by Llama 3.3. You are helpful, precise, balanced, and adept at programming and creative ideation.',
    isFreeUnlimited: true
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity AI',
    family: 'Perplexity',
    company: 'Perplexity AI',
    category: 'chatbot',
    badge: 'Search & Deep Citations',
    accentColor: '#14b8a6',
    description: 'Answer engine that queries real-time authoritative web sources, synthesizes facts, and cites clickable academic URLs.',
    contextWindow: '64K Tokens',
    strengths: ['Live Citations', 'Fact Checking', 'Academic Searching', 'Comparative Analysis'],
    systemPromptPreset: 'You are Perplexity AI. Always structure answers with clear inline source citations, authoritative summaries, and proactive follow-up questions.',
    isFreeUnlimited: true
  },
  {
    id: 'mistral-le-chat',
    name: 'Le Chat (Mistral Large 2)',
    family: 'Mistral',
    company: 'Mistral AI',
    category: 'open_source',
    badge: 'European Efficiency',
    accentColor: '#ec4899',
    description: 'Mistral AI flagship with exceptional multilingual mastery, concise reasoning, and supreme coding capabilities.',
    contextWindow: '128K Tokens',
    strengths: ['Multilingual French/German/Spanish', 'Clean Syntactic Code', 'Logical Reasoning', 'Concise Answers'],
    systemPromptPreset: 'You are Le Chat powered by Mistral Large. You deliver precise, elegant, concise, and mathematically sound responses.',
    isFreeUnlimited: true
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 / V3',
    family: 'DeepSeek',
    company: 'DeepSeek',
    category: 'reasoning',
    badge: 'Pure Open Reasoning',
    accentColor: '#8b5cf6',
    description: 'Breakthrough open-weights reasoning model with chain-of-thought verification that rivals top proprietary o-series reasoning models.',
    contextWindow: '128K Tokens',
    strengths: ['Chain-of-Thought Reflection', 'Algorithmic Problem Solving', 'Competitive Math', 'Complex Architecture'],
    systemPromptPreset: 'You are DeepSeek R1. Before answering, reflect systematically with chain-of-thought reasoning, self-correcting any logical inconsistencies.',
    isFreeUnlimited: true
  },
  {
    id: 'qwen-2-5-max',
    name: 'Qwen 2.5 Max',
    family: 'Qwen',
    company: 'Alibaba',
    category: 'open_source',
    badge: 'Asia Premier Frontier',
    accentColor: '#eab308',
    description: 'Alibaba Cloud premier frontier model leading global benchmarks across math, coding, multilingual translation, and reasoning.',
    contextWindow: '128K Tokens',
    strengths: ['Multilingual Translation', 'Mathematics', 'Agentic Workflows', 'Python/Rust Engineering'],
    systemPromptPreset: 'You are Qwen 2.5 Max by Alibaba. You offer state-of-the-art coding, scientific reasoning, and multilingual mastery.',
    isFreeUnlimited: true
  },
  {
    id: 'cohere-command-r-plus',
    name: 'Command R+',
    family: 'Command',
    company: 'Cohere',
    category: 'chatbot',
    badge: 'Enterprise RAG',
    accentColor: '#059669',
    description: 'Enterprise retrieval-augmented generation model optimized for tool use, multi-step workflows, and document reasoning.',
    contextWindow: '128K Tokens',
    strengths: ['RAG Retrieval', 'Structured Tables', 'Enterprise Accuracy', 'Citation Grounding'],
    systemPromptPreset: 'You are Command R+ by Cohere. You specialize in grounded enterprise document reasoning, structured responses, and exact source citations.',
    isFreeUnlimited: true
  },
  {
    id: 'phi-4-microsoft',
    name: 'Phi-4',
    family: 'Phi',
    company: 'Microsoft',
    category: 'open_source',
    badge: 'Compact Powerhouse',
    accentColor: '#0284c7',
    description: 'Microsoft state-of-the-art 14B small language model delivering frontier-class STEM and mathematical reasoning.',
    contextWindow: '16K Tokens',
    strengths: ['STEM Problem Solving', 'Logic Puzzles', 'Fast Local Latency', 'Clean Syntax'],
    systemPromptPreset: 'You are Microsoft Phi-4. You provide ultra-dense, mathematically sound, and logically rigorous answers with zero fluff.',
    isFreeUnlimited: true
  }
];

// 2. AI Image Generation Engines
export const AI_IMAGE_ENGINES = [
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6.1',
    company: 'Midjourney',
    badge: 'Hyper-Realistic Aesthetic',
    description: 'Industry-standard photorealism, cinematic lighting, nuanced textures, and award-winning aesthetic composition.',
    promptModifiers: '8k resolution, cinematic lighting, photorealistic, Unreal Engine 5 render, shot on 35mm lens, f/1.8, bokeh, hyper-detailed'
  },
  {
    id: 'dalle-3',
    name: 'DALL·E 3',
    company: 'OpenAI',
    badge: 'Prompt Adherence',
    description: 'Exceptional semantic understanding, intricate text-in-image rendering, and exact spatial positioning.',
    promptModifiers: 'vibrant color palette, precise details, high contrast, clean typography, masterpiece composition'
  },
  {
    id: 'flux-1-schnell',
    name: 'FLUX.1 [Schnell/Dev]',
    company: 'Black Forest Labs',
    badge: 'Next-Gen Open Diffusion',
    description: 'Next-generation 12B parameter flow-matching transformer with unprecedented anatomical accuracy and typography.',
    promptModifiers: 'sharp focus, subsurface scattering, realistic skin texture, intricate ambient occlusion, studio photography'
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    company: 'Stability AI',
    badge: 'Open Ecosystem',
    description: 'Open ecosystem powerhouse with versatile LoRA stylization, ControlNet support, and high aesthetic flexibility.',
    promptModifiers: 'octane render, artstation trending, volumetric dust, ray tracing reflections, golden hour glow'
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly 3',
    company: 'Adobe',
    badge: 'Commercial Grade',
    description: 'Commercially safe, vector-precise illustration, generative fill, and studio graphic design composition.',
    promptModifiers: 'commercial graphic design, clean vectors, pastel minimalism, perfect geometric alignment'
  },
  {
    id: 'ideogram-2',
    name: 'Ideogram 2.0',
    company: 'Ideogram AI',
    badge: 'Typography & Logos',
    description: 'Unmatched in-image typography, logo lettering, graphic tees, posters, and sticker design generation.',
    promptModifiers: 'clear legible typography, logo emblem design, bold visual branding, vector flat art'
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo AI Phoenix',
    company: 'Leonardo AI',
    badge: 'Game Assets & Concept Art',
    description: 'Custom fine-tuned pipelines for 3D game assets, fantasy concept art, anime, and character modeling.',
    promptModifiers: 'fantasy concept art, AAA game asset, dynamic action pose, neon magic particle effects'
  }
];

// 3. AI Video Generation Engines
export const AI_VIDEO_ENGINES = [
  {
    id: 'sora',
    name: 'Sora',
    company: 'OpenAI',
    badge: 'World Physics Simulation',
    description: 'Generates up to 60-second high-fidelity video scenes with complex camera trajectories, multi-character interactions, and 3D physical consistency.',
    maxDuration: 60,
    resolutions: ['1080p', '4K']
  },
  {
    id: 'runway-gen-3',
    name: 'Runway Gen-3 Alpha',
    company: 'Runway',
    badge: 'Cinematic Motion Control',
    description: 'Precision camera direction, structural motion brush, keyframe interpolation, and photorealistic video synthesis.',
    maxDuration: 10,
    resolutions: ['720p', '1080p']
  },
  {
    id: 'google-veo',
    name: 'Google Veo',
    company: 'Google DeepMind',
    badge: 'Long-Form 1080p',
    description: 'Google state-of-the-art video model understanding cinematic terminology (timelapse, aerial drone shots, dolly zoom) with temporal consistency.',
    maxDuration: 30,
    resolutions: ['1080p']
  },
  {
    id: 'kling-ai',
    name: 'Kling AI 1.5',
    company: 'Kuaishou',
    badge: 'Fluid Physical Motion',
    description: 'High physical simulation accuracy with realistic fluid movements, cloth dynamics, and expressive character animation.',
    maxDuration: 10,
    resolutions: ['1080p']
  },
  {
    id: 'pika-2',
    name: 'Pika 2.0',
    company: 'Pika Labs',
    badge: 'Pikaffects & Stylization',
    description: 'Interactive canvas video modifications, Pikaffects (inflate, melt, crush, explode), lip sync, and sound FX synchronization.',
    maxDuration: 15,
    resolutions: ['1080p']
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    company: 'Luma AI',
    badge: 'Ultra-Fast 3D Camera',
    description: 'High-speed camera tracking, camera motion paths, realistic 3D lighting continuity, and camera dolly movement.',
    maxDuration: 10,
    resolutions: ['1080p']
  },
  {
    id: 'hailuo-ai',
    name: 'Hailuo AI (MiniMax)',
    company: 'MiniMax',
    badge: 'Cinematic Character Drama',
    description: 'Exceptional human facial micro-expressions, emotive cinematic storytelling, and vivid dynamic action scenes.',
    maxDuration: 10,
    resolutions: ['1080p']
  }
];

// 4. AI Coding Tools & IDE Suite
export const AI_CODING_TOOLS = [
  {
    id: 'cursor-composer',
    name: 'Cursor Composer',
    company: 'Anysphere',
    badge: 'Multi-File Agentic IDE',
    description: 'Context-aware full repository editor with multi-file diff generation, intelligent terminal execution, and inline refactor.'
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    company: 'Anthropic',
    badge: 'CLI & Architectural Agent',
    description: 'Autonomous command-line agent for refactoring codebases, running tests, resolving Git conflicts, and generating clean web apps.'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot Workspace',
    company: 'GitHub / Microsoft',
    badge: 'Repo-Level Copilot',
    description: 'Transforms GitHub issues and feature requests into pull-ready implementations with automated test generation.'
  },
  {
    id: 'windsurf',
    name: 'Windsurf Cascade',
    company: 'Codeium',
    badge: 'Flow-State IDE',
    description: 'Combines deep indexing with Cascade collaborative flows for instant symbol navigation and proactive error repairs.'
  },
  {
    id: 'amazon-q-developer',
    name: 'Amazon Q Developer',
    company: 'AWS',
    badge: 'Cloud & Infrastructure',
    description: 'Specialized in AWS cloud architecture, Java/Python transformations, serverless functions, and security vulnerability scanning.'
  },
  {
    id: 'replit-ai',
    name: 'Replit AI Agent',
    company: 'Replit',
    badge: 'Cloud Sandbox Runner',
    description: 'Scaffolds full-stack databases, frontends, APIs, and deploys cloud applications in zero-config containers.'
  },
  {
    id: 'gemini-code-assist',
    name: 'Gemini Code Assist',
    company: 'Google Cloud',
    badge: 'Enterprise Code Assist',
    description: 'Deep full-repo indexing with private enterprise customization, compliance review, and real-time completions.'
  }
];

// 5. AI Music & Audio Suite
export const AI_AUDIO_TOOLS = [
  {
    id: 'suno-v3',
    name: 'Suno v3.5 / v4',
    company: 'Suno AI',
    badge: 'Full Radio Songs',
    type: 'music',
    description: 'Generates complete 4-minute radio-quality songs with full vocals, harmonies, instrumental arrangements, and lyrics across any genre.'
  },
  {
    id: 'udio',
    name: 'Udio 1.5',
    company: 'Udio',
    badge: 'High-Fidelity Audio',
    type: 'music',
    description: 'Studio-grade acoustic realism, genre-blending, complex polyphonic chord structures, and vocal dynamics.'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice AI',
    company: 'ElevenLabs',
    badge: 'Human Speech & Clones',
    type: 'voice',
    description: 'Ultra-realistic human voice synthesis, emotional prosody, accent control, voice cloning, and multilingual translation.'
  },
  {
    id: 'adobe-podcast',
    name: 'Adobe Podcast Enhance',
    company: 'Adobe',
    badge: 'Studio Audio Cleaner',
    type: 'cleaner',
    description: 'AI-powered studio sound cleanup that removes ambient echo, room reverberation, and background noise from voice tracks.'
  },
  {
    id: 'descript',
    name: 'Descript Audio AI',
    company: 'Descript',
    badge: 'Text-Based Audio Editor',
    type: 'cleaner',
    description: 'Edit podcasts and audio recordings by simply editing the text transcript, with Overdub AI voice replacement.'
  },
  {
    id: 'aiva',
    name: 'AIVA Music Composer',
    company: 'AIVA',
    badge: 'Cinematic Orchestral',
    type: 'music',
    description: 'Composes classical, cinematic orchestral soundtracks, ambient game scores, and MIDI composition tracks.'
  }
];

// 6. AI Writing & Productivity Suite
export const AI_WRITING_TOOLS = [
  {
    id: 'grammarly-ai',
    name: 'Grammarly Pro AI',
    company: 'Grammarly',
    badge: 'Tone & Clarity Polisher',
    description: 'Real-time grammatical correctness, executive tone refinement, active voice transformation, and sentence brevity.'
  },
  {
    id: 'jasper-ai',
    name: 'Jasper Enterprise AI',
    company: 'Jasper',
    badge: 'Marketing & Brand Voice',
    description: 'Enterprise brand voice alignment, multichannel ad copy campaigns, high-converting landing page headlines, and email sequences.'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI Workspace',
    company: 'Notion',
    badge: 'Knowledge & Docs',
    description: 'Integrated document summaries, action item extraction, project specifications, and brainstorm outlines.'
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai GTM Engine',
    company: 'Copy.ai',
    badge: 'Sales & Copywriting',
    description: 'Automates sales outreach, LinkedIn thought leadership, cold email templates, and product marketing copy.'
  },
  {
    id: 'writesonic',
    name: 'Writesonic / Chatsonic',
    company: 'Writesonic',
    badge: 'SEO Articles & Blogs',
    description: 'Fact-checked long-form SEO blog posts with keyword research, metadata generator, and competitor content gap analysis.'
  },
  {
    id: 'writer-ai',
    name: 'Writer Enterprise',
    company: 'Writer',
    badge: 'Corporate Governance',
    description: 'Enforces corporate compliance, legal guideline checks, inclusive terminology, and structured business reporting.'
  },
  {
    id: 'canva-ai',
    name: 'Canva Magic Design AI',
    company: 'Canva',
    badge: 'Visual Card & Layouts',
    description: 'Transforms text prompts into branded visual slides, infographics, social media cards, and poster layouts.'
  }
];

// 7. AI Research & Knowledge Lab
export const AI_RESEARCH_TOOLS = [
  {
    id: 'perplexity-deep-research',
    name: 'Perplexity Deep Research',
    company: 'Perplexity AI',
    badge: 'Multi-Step Web Synthesis',
    description: 'Searches dozens of web sources concurrently, cross-validates contradictory claims, and generates detailed cited whitepapers.'
  },
  {
    id: 'google-notebooklm',
    name: 'Google NotebookLM',
    company: 'Google',
    badge: 'Grounding & Audio Overview',
    description: 'Grounds responses strictly in uploaded documents, creates interactive concept notes, and synthesizes 2-host audio podcast discussions.'
  },
  {
    id: 'elicit-ai',
    name: 'Elicit Research',
    company: 'Elicit',
    badge: '200M+ Academic Papers',
    description: 'Automates systematic literature reviews, extracts sample sizes and methodologies, and filters by peer-reviewed status.'
  },
  {
    id: 'consensus-ai',
    name: 'Consensus Search',
    company: 'Consensus',
    badge: 'Scientific Consensus Meter',
    description: 'Extracts findings from scientific papers and calculates a Consensus Meter (% agreement in published research literature).'
  },
  {
    id: 'semantic-scholar',
    name: 'Semantic Scholar',
    company: 'Allen Institute for AI',
    badge: 'Citation Graph Explorer',
    description: 'AI-driven scientific literature graph highlighting influential citations, methodological lineage, and TLDR summaries.'
  },
  {
    id: 'scispace',
    name: 'SciSpace (Typeset)',
    company: 'SciSpace',
    badge: 'Interactive Paper Explainer',
    description: 'Explain complex formulas, decode confusing paragraphs in academic papers, and query mathematical models in plain English.'
  }
];

// 8. Major AI Model Families & Benchmarks
export const AI_MODEL_FAMILIES = [
  {
    id: 'family-gpt',
    name: 'GPT & o-Series',
    company: 'OpenAI',
    models: ['GPT-4.5', 'GPT-4o', 'o1', 'o3-mini', 'GPT-4o mini'],
    description: 'Pioneering frontier models excelling at conversational fluency, structured JSON, tool calling, and chain-of-thought math reasoning.',
    benchmarks: { mmlu: '91.8%', math: '96.4%', coding: '92.4%' },
    color: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'family-claude',
    name: 'Claude 3.7 & 3.5 Series',
    company: 'Anthropic',
    models: ['Claude 3.7 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
    description: 'World-leading coding and agentic reasoning architectures with live web artifacts, 200k context, and constitutional safety.',
    benchmarks: { mmlu: '92.2%', math: '96.8%', coding: '93.7%' },
    color: 'from-amber-600 to-amber-400'
  },
  {
    id: 'family-gemini',
    name: 'Gemini 2.5 & 2.0 Series',
    company: 'Google DeepMind',
    models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Gemini 2.0 Flash Thinking'],
    description: 'Native multimodal models with breakthrough 2 Million token context windows and real-time live Google Search grounding.',
    benchmarks: { mmlu: '91.4%', math: '95.2%', coding: '91.8%' },
    color: 'from-blue-600 to-cyan-400'
  },
  {
    id: 'family-llama',
    name: 'Llama 3.3 & 3.1 Series',
    company: 'Meta',
    models: ['Llama 3.3 70B', 'Llama 3.1 405B', 'Llama 3.1 8B'],
    description: 'Open-weights standard with immense community ecosystem, high inference efficiency, and unconstrained fine-tuning capabilities.',
    benchmarks: { mmlu: '88.6%', math: '89.0%', coding: '89.4%' },
    color: 'from-indigo-600 to-violet-500'
  },
  {
    id: 'family-deepseek',
    name: 'DeepSeek R1 & V3',
    company: 'DeepSeek',
    models: ['DeepSeek R1', 'DeepSeek V3', 'DeepSeek Coder V2'],
    description: 'Open-weights reasoning powerhouse using Multi-Head Latent Attention (MLA) and DeepSeekMoE to match frontier reasoning at 1/10th the cost.',
    benchmarks: { mmlu: '90.8%', math: '97.3%', coding: '92.8%' },
    color: 'from-purple-600 to-pink-500'
  },
  {
    id: 'family-mistral',
    name: 'Mistral & Le Chat Series',
    company: 'Mistral AI',
    models: ['Mistral Large 2', 'Codestral 2501', 'Mistral NeMo', 'Pixtral Large'],
    description: 'European frontier intelligence with top-tier multilingual performance, ultra-fast latency, and permissive licenses.',
    benchmarks: { mmlu: '89.2%', math: '91.2%', coding: '90.5%' },
    color: 'from-rose-600 to-orange-400'
  },
  {
    id: 'family-qwen',
    name: 'Qwen 2.5 Series',
    company: 'Alibaba',
    models: ['Qwen 2.5 Max', 'Qwen 2.5 72B', 'Qwen 2.5 Coder', 'Qwen 2.5 Math'],
    description: 'Dominant open-weights suite across coding and mathematics with native 128k context and support for 29+ languages.',
    benchmarks: { mmlu: '90.4%', math: '96.2%', coding: '93.1%' },
    color: 'from-yellow-600 to-amber-500'
  },
  {
    id: 'family-grok',
    name: 'Grok 3 & 2 Series',
    company: 'xAI',
    models: ['Grok 3', 'Grok 3 Mini', 'Grok 2 Vision'],
    description: 'Built on the Colossus 100k H100 GPU cluster with unfiltered truth-seeking objectives and real-time social knowledge.',
    benchmarks: { mmlu: '91.2%', math: '94.8%', coding: '91.5%' },
    color: 'from-orange-600 to-red-500'
  },
  {
    id: 'family-gemma',
    name: 'Gemma 2 Series',
    company: 'Google',
    models: ['Gemma 2 27B', 'Gemma 2 9B', 'Gemma 2 2B'],
    description: 'Lightweight, state-of-the-art open models built from the same research and technology used to create the Gemini models.',
    benchmarks: { mmlu: '75.6%', math: '78.4%', coding: '74.2%' },
    color: 'from-sky-600 to-blue-400'
  },
  {
    id: 'family-command',
    name: 'Command R+ Series',
    company: 'Cohere',
    models: ['Command R+', 'Command R', 'Embed v3'],
    description: 'Optimized specifically for high-accuracy RAG (retrieval-augmented generation), multi-step tool use, and enterprise workflows.',
    benchmarks: { mmlu: '85.4%', math: '81.2%', coding: '84.0%' },
    color: 'from-emerald-700 to-teal-600'
  },
  {
    id: 'family-phi',
    name: 'Phi-4 & Phi-3 Series',
    company: 'Microsoft',
    models: ['Phi-4 14B', 'Phi-3.5 MoE', 'Phi-3 Vision'],
    description: 'State-of-the-art small language models (SLMs) trained on highly curated synthetic educational textbooks.',
    benchmarks: { mmlu: '84.8%', math: '88.5%', coding: '86.2%' },
    color: 'from-cyan-600 to-blue-500'
  },
  {
    id: 'family-reasoning',
    name: 'o-Series Reasoning Models',
    company: 'OpenAI',
    models: ['o1', 'o1-preview', 'o3-mini (High)', 'o3-mini (Medium)'],
    description: 'Reinforcement-learning trained reasoning models that think through steps before responding, excelling in math, physics, and competitive programming.',
    benchmarks: { mmlu: '92.3%', math: '98.2%', coding: '94.6%' },
    color: 'from-emerald-500 to-green-600'
  }
];
