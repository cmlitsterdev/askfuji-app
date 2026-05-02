import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  }
}

const client = new Anthropic({ apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY });
const manual = fs.readFileSync(path.join(__dirname, '../lib/manuals.ts'), 'utf-8');

async function generateTips() {
  console.log('Generating tips from manual...');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `You are an expert Fuji X100VI photographer. Using the manual content below, generate exactly 100 practical daily tips for X100VI owners.

Rules:
- Each tip must be specific, actionable, and based on the manual
- Mix topics: film simulations, AF settings, custom buttons, shooting techniques, menu shortcuts, hidden features
- Keep each tip to 1-3 sentences max
- Write in a friendly, direct tone — like a pro photographer giving quick advice
- Return ONLY a valid JSON array of 100 strings, nothing else

Manual content:
${manual.substring(0, 80000)}`
    }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('No text response');

  const jsonMatch = block.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response');

  const tips: string[] = JSON.parse(jsonMatch[0]);
  console.log(`Generated ${tips.length} tips`);

  const output = `// Auto-generated tips from X100VI manual\nexport const TIPS: string[] = ${JSON.stringify(tips, null, 2)};\n`;
  const outPath = path.join(__dirname, '../lib/tips.ts');
  fs.writeFileSync(outPath, output);
  console.log(`Written to ${outPath}`);
}

generateTips().catch(console.error);
