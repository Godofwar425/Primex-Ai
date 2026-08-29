import { Message, Plugin, Connector, UserSettings, Attachment } from '../types/index.ts';

export async function streamChat({
  messages,
  thinking,
  webSearch,
  activePlugins,
  activeConnectors,
  customSystemPrompt,
  temperature,
  attachments,
  onChunk,
  onError,
  onDone
}: {
  messages: Message[];
  thinking: boolean;
  webSearch: boolean;
  activePlugins: Plugin[];
  activeConnectors: Connector[];
  customSystemPrompt: string;
  temperature: number;
  attachments?: Attachment[];
  onChunk: (chunk: string, grounding?: any) => void;
  onError: (err: string) => void;
  onDone: () => void;
}) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        thinking,
        webSearch,
        activePlugins,
        activeConnectors,
        customSystemPrompt,
        temperature,
        attachments
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser environment');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              onError(parsed.error);
            } else if (parsed.text !== undefined) {
              onChunk(parsed.text, parsed.grounding);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e, dataStr);
          }
        }
      }
    }
    onDone();
  } catch (error: any) {
    onError(error.message || 'Network error occurred during streaming');
  }
}

export async function executeCodeSandbox(code: string, language: string = 'javascript') {
  const response = await fetch('/api/execute-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return await response.json();
}

export const executeCode = executeCodeSandbox;

export async function runWebSearch(query: string) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
}

export async function testConnector(type: string, config: Record<string, any>) {
  const response = await fetch('/api/connectors/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, config })
  });
  return await response.json();
}

export async function generateWebsiteRapid(prompt: string, theme: string = 'modern-dark') {
  const response = await fetch('/api/generate-website', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, theme })
  });
  return await response.json();
}
