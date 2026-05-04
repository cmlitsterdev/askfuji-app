const API_URL = 'https://askfuji-api.vercel.app/api/chat';

type Message = { role: 'user' | 'assistant'; text: string };

export async function askClaude(messages: Message[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cameraId: 'fuji-x100vi', messages }),
      signal: controller.signal,
    });
  } catch (e: unknown) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Request timed out — please try again.');
    }
    throw e;
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `API error ${response.status}`);
  }

  const data = await response.json() as { text: string };
  return data.text;
}
