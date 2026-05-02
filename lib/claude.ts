import Anthropic from '@anthropic-ai/sdk';
import { manual, newFeatures } from './manuals';

const client = new Anthropic({ apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are AskFuji, an expert assistant for the Fuji X100VI camera.
You have been provided with the full Owner's Manual and New Features Guide for the X100VI.
Answer questions clearly and concisely using the manuals as your primary source.
When relevant, mention specific menu locations (e.g. "Shooting Settings > AF Mode").
Keep responses focused — the user is likely holding their camera.

--- OWNER'S MANUAL ---
${manual}

--- NEW FEATURES GUIDE ---
${newFeatures}`;

type Message = { role: 'user' | 'assistant'; text: string };

export async function askClaude(messages: Message[]): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.text,
    })),
  });

  const block = response.content[0];
  if (block.type === 'text') return block.text;
  return 'No response.';
}
