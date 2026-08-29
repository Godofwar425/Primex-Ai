import { Artifact } from '../types/index.ts';

/**
 * Extracts Claude artifacts from message content.
 * Handles both Claude's native <antArtifact ...> syntax
 * and standard markdown code fences (```html ... ```, ```jsx ... ```, etc.)
 */
export function extractArtifacts(content: string): { artifacts: Artifact[]; cleanContent: string } {
  const artifacts: Artifact[] = [];
  let cleanContent = content;

  // 1. Match native Claude <antArtifact identifier="..." type="..." language="..." title="...">...</antArtifact>
  const antArtifactRegex = /<antArtifact\s+identifier="([^"]*)"\s+type="([^"]*)"(?:\s+language="([^"]*)")?(?:\s+title="([^"]*)")?>([\s\S]*?)<\/antArtifact>/gi;
  let match: RegExpExecArray | null;

  while ((match = antArtifactRegex.exec(content)) !== null) {
    const identifier = match[1] || `artifact-${Date.now()}-${artifacts.length}`;
    const typeAttr = match[2] || 'application/vnd.ant.code';
    const language = match[3] || (typeAttr.includes('html') ? 'html' : 'code');
    const title = match[4] || 'Generated Artifact';
    const innerContent = match[5].trim();

    let normalizedType: Artifact['type'] = 'code';
    if (language === 'html' || innerContent.includes('<!DOCTYPE html>') || innerContent.includes('<html')) {
      normalizedType = 'html';
    } else if (language === 'svg' || innerContent.startsWith('<svg')) {
      normalizedType = 'svg';
    } else if (language === 'react' || language === 'jsx' || language === 'tsx') {
      normalizedType = 'react';
    } else if (language === 'javascript' || language === 'js') {
      normalizedType = 'javascript';
    } else if (language === 'python' || language === 'py') {
      normalizedType = 'python';
    } else if (typeAttr.includes('markdown')) {
      normalizedType = 'markdown';
    }

    artifacts.push({
      id: identifier,
      identifier,
      title,
      type: normalizedType,
      language: language || 'html',
      content: innerContent,
      createdAt: Date.now(),
      version: 1
    });
  }

  // 2. Also check for large standalone HTML / React code blocks if no <antArtifact> was found
  if (artifacts.length === 0) {
    const codeBlockRegex = /```(html|jsx|tsx|react|svg|javascript|typescript)\n([\s\S]*?)```/gi;
    let blockMatch: RegExpExecArray | null;

    while ((blockMatch = codeBlockRegex.exec(content)) !== null) {
      const lang = blockMatch[1].toLowerCase();
      const code = blockMatch[2].trim();

      // Only treat substantial code blocks (>10 lines or complete HTML) as standalone artifacts
      if (code.split('\n').length > 8 || code.includes('<!DOCTYPE') || code.includes('<html')) {
        let type: Artifact['type'] = 'code';
        let title = 'Code Artifact';

        if (lang === 'html' || code.includes('<!DOCTYPE') || code.includes('<html')) {
          type = 'html';
          title = 'Interactive Web Application';
        } else if (lang === 'svg' || code.startsWith('<svg')) {
          type = 'svg';
          title = 'Vector Graphic / SVG';
        } else if (['jsx', 'tsx', 'react'].includes(lang)) {
          type = 'react';
          title = 'React Component';
        } else if (['javascript', 'typescript'].includes(lang)) {
          type = 'javascript';
          title = 'Interactive Script';
        }

        artifacts.push({
          id: `block-${Date.now()}-${artifacts.length}`,
          identifier: `block-${Date.now()}`,
          title,
          type,
          language: lang,
          content: code,
          createdAt: Date.now(),
          version: 1
        });
      }
    }
  }

  return { artifacts, cleanContent };
}

/**
 * Wraps raw HTML/JS/CSS code in a self-contained sandbox bundle
 * with Tailwind CSS, Lucide Icons, and error trapping for live iframe preview.
 */
export function buildSandboxHtml(rawContent: string, language: string = 'html'): string {
  if (language === 'svg' || rawContent.trim().startsWith('<svg')) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #09090b; }
    svg { max-width: 90vw; max-height: 90vh; }
  </style>
</head>
<body>
  ${rawContent}
</body>
</html>`;
  }

  if (rawContent.includes('<!DOCTYPE html>') || rawContent.includes('<html')) {
    // Inject scripts if not present
    let result = rawContent;
    if (!result.includes('tailwindcss')) {
      result = result.replace('<head>', '<head>\n  <script src="https://cdn.tailwindcss.com"></script>');
    }
    if (!result.includes('lucide') && !result.includes('lucide.createIcons')) {
      result = result.replace('</body>', '  <script src="https://unpkg.com/lucide@latest"></script>\n  <script>if(window.lucide) { lucide.createIcons(); }</script>\n</body>');
    }
    return result;
  }

  // If it's a snippet or React/JS/HTML fragment, construct a clean wrapper
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen">
  <div id="root" class="w-full min-h-screen">
    ${rawContent}
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  </script>
</body>
</html>`;
}
