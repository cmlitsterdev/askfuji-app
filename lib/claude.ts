const API_URL = 'https://askfuji-api.vercel.app/api/chat';

type Message = { role: 'user' | 'assistant'; text: string };

export async function askClaude(messages: Message[]): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cameraId: 'fuji-x100vi', messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `API error ${response.status}`);
  }

  const data = await response.json() as { text: string };
  return data.text;
}
