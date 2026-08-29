import { Plugin, Connector, UserSettings } from '../types/index.ts';

export const DEFAULT_PLUGINS: Plugin[] = [
  {
    id: 'web-search',
    name: 'Web Search & Grounding',
    description: 'Live real-time Google search grounding with citation links and real-time facts',
    category: 'search',
    icon: 'Globe',
    enabled: true,
    featured: true
  },
  {
    id: 'code-interpreter',
    name: 'Code Sandbox & Runner',
    description: 'Execute JavaScript/TypeScript in a safe runtime environment with console inspector',
    category: 'code',
    icon: 'Terminal',
    enabled: true,
    featured: true
  },
  {
    id: 'website-builder',
    name: 'Website & Artifact Studio',
    description: 'Generate full standalone responsive web applications, single-page sites, and interactive prototypes',
    category: 'web',
    icon: 'Layout',
    enabled: true,
    featured: true
  },
  {
    id: 'data-visualizer',
    name: 'Data & Chart Engine',
    description: 'Synthesize raw datasets into interactive visual charts, tables, and analytics components',
    category: 'analytics',
    icon: 'BarChart3',
    enabled: true
  },
  {
    id: 'api-tester',
    name: 'REST API & Webhook Runner',
    description: 'Fetch and parse live external JSON APIs, test webhooks, and analyze response payloads',
    category: 'api',
    icon: 'Webhook',
    enabled: true
  },
  {
    id: 'multimodal-vision',
    name: 'Multimodal Vision & Asset Studio',
    description: 'Analyze uploaded UI mockups, architectural diagrams, screenshots, and visual assets',
    category: 'vision',
    icon: 'Sparkles',
    enabled: true
  }
];

export const DEFAULT_CONNECTORS: Connector[] = [
  {
    id: 'conn-github-1',
    name: 'GitHub Repository',
    type: 'github',
    description: 'Linked to main workspace repo (owner/app-core)',
    status: 'connected',
    config: {
      repo: 'acme-corp/quantum-web',
      branch: 'main'
    },
    contextData: {
      repository: 'acme-corp/quantum-web',
      branch: 'main',
      files: ['src/App.tsx', 'src/components/Dashboard.tsx', 'package.json', 'README.md'],
      openIssues: 3,
      stars: 1840
    },
    lastSynced: Date.now() - 1000 * 60 * 15
  },
  {
    id: 'conn-postgres-1',
    name: 'PostgreSQL Database',
    type: 'postgres',
    description: 'Production Analytics & User Database',
    status: 'connected',
    config: {
      database: 'prod_cloud_db',
      host: 'db.internal.cloud',
      port: 5432
    },
    contextData: {
      tables: [
        'users (id, email, role, created_at)',
        'projects (id, user_id, title, status, budget)',
        'metrics (id, project_id, daily_active_users, revenue)'
      ],
      totalRows: 142500
    },
    lastSynced: Date.now() - 1000 * 60 * 45
  },
  {
    id: 'conn-rest-1',
    name: 'Stripe & Billing API',
    type: 'rest_api',
    description: 'External payment and subscription endpoints',
    status: 'connected',
    config: {
      endpoint: 'https://api.stripe.com/v1',
      authType: 'Bearer Token'
    },
    contextData: {
      availableEndpoints: ['/v1/customers', '/v1/subscriptions', '/v1/invoices', '/v1/payment_intents'],
      status: 'active'
    },
    lastSynced: Date.now() - 1000 * 60 * 120
  },
  {
    id: 'conn-notion-1',
    name: 'Product & Tech Specs (Notion)',
    type: 'notion',
    description: 'Team documentation, RFCs, design principles',
    status: 'connected',
    config: {
      workspace: 'Engineering Knowledge Base'
    },
    contextData: {
      indexedDocs: ['Design System 2.0', 'API Architecture RFC', 'Q3 Launch Roadmap']
    },
    lastSynced: Date.now() - 1000 * 60 * 300
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  model: 'gemini-3.7-flash',
  thinkingMode: true,
  thinkingLevel: 'HIGH',
  temperature: 0.7,
  customSystemPrompt: 'You have full technical capability. Provide complete code without truncation. Always use modern, responsive UI design.',
  unlimitedMode: true,
  defaultTheme: 'claude'
};

export const WEBSITE_TEMPLATES = [
  {
    id: 'saas-landing',
    title: 'SaaS Product Landing Page',
    category: 'Landing Page',
    description: 'High-converting dark modern SaaS homepage with interactive pricing slider, feature grid, and live demo widget.',
    prompt: 'Build a stunning, modern dark-themed SaaS landing page for an AI automation platform called "AuraAI". Include a sticky glassmorphic navbar, hero section with interactive preview card, 3D metric counters, interactive monthly/annual pricing calculator with feature checkmarks, customer testimonials carousel, and FAQ accordion with smooth open/close interactions.'
  },
  {
    id: 'crypto-dashboard',
    title: 'Financial & Crypto Analytics Dashboard',
    category: 'Dashboard',
    description: 'Real-time multi-asset financial dashboard with live simulated price charts, portfolio balances, and transaction history.',
    prompt: 'Build a sleek, high-contrast dark financial analytics dashboard called "Nexus Wealth". Include an interactive portfolio balance chart (HTML5 canvas / SVG), 24h gain/loss badges, a searchable live cryptocurrency/stock ticker with filter tabs (All, Crypto, Tech, Forex), an interactive Buy/Sell order form with instant balance calculation, and recent activity logs with status tags.'
  },
  {
    id: 'kanban-board',
    title: 'Interactive Agile Kanban Board',
    category: 'Productivity Tool',
    description: 'Fully functional drag-and-drop or click-to-move project board with column management and task creator.',
    prompt: 'Build a complete interactive Kanban task management web app called "TaskSprint". Include columns: Backlog, In Progress, Review, and Done. Features: Add new task with modal (title, description, priority badge, due date, assignee avatar), move tasks between columns with 1-click arrow buttons, search & tag filters, column task counter, and local storage state persistence.'
  },
  {
    id: 'arcade-game',
    title: 'Neon Cyberpunk Space Arcade Game',
    category: 'Interactive Game',
    description: 'Playable retro neon arcade game in HTML5 Canvas with keyboard/touch controls, score tracking, and sound effects.',
    prompt: 'Build a fully playable, polished retro neon space arcade game in HTML5 Canvas called "CyberDefender". Features: player ship controlled with Arrow Keys / WASD or Mouse, smooth laser shooting (Spacebar), descending waves of neon alien invaders with particle explosions, health bar, score & multiplier display, power-up drops (Shield, Triple Laser), and Game Over / Restart screen with High Score tracker.'
  },
  {
    id: 'ecommerce-store',
    title: 'Minimalist Artisan E-Commerce Store',
    category: 'E-Commerce',
    description: 'Elegant product catalog with category filters, product detail drawer, shopping cart slide-over, and instant checkout flow.',
    prompt: 'Build an elegant, luxury minimalist e-commerce web app called "Atelier Form". Include a curated catalog of 6 design objects (Ceramics, Lamp, Watch, Chair) with image placeholders, price, and rating. Features: category filters (All, Home, Wear, Furniture), slide-over slide-in Cart drawer with item counter, quantity +/- incrementors, subtotal + tax calculator, and a realistic Checkout modal with payment confirmation confetti.'
  },
  {
    id: 'markdown-docs',
    title: 'Developer Documentation Portal',
    category: 'Documentation',
    description: 'Clean developer docs site with sidebar navigation, search bar, code block copy buttons, and interactive API explorer.',
    prompt: 'Build a sleek developer documentation portal for a REST API called "CloudPulse". Include a collapsible left sidebar with categorized sections (Getting Started, Authentication, Webhooks, Errors), a top search bar that highlights matching topics, interactive API endpoint tester where users can click "Send Request" to see real-time simulated JSON responses, and code blocks with 1-click copy functionality.'
  }
];
