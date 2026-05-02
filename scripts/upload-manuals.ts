import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  }
}

const client = new Anthropic({ apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY });

const MANUALS = [
  {
    name: 'X100VI Owner\'s Manual',
    path: '/Users/chris.litster/Downloads/x100vi_manual_en_s_f.pdf',
    key: 'MANUAL',
  },
  {
    name: 'X100VI New Features Guide',
    path: '/Users/chris.litster/Downloads/x100vi_nfg_en_s_f.pdf',
    key: 'NEW_FEATURES',
  },
];

async function uploadManuals() {
  const fileIds: Record<string, string> = {};

  for (const manual of MANUALS) {
    console.log(`Uploading ${manual.name}...`);
    const file = fs.createReadStream(manual.path);
    const response = await client.beta.files.upload({
      file: new File([fs.readFileSync(manual.path)], path.basename(manual.path), { type: 'application/pdf' }),
    });
    fileIds[manual.key] = response.id;
    console.log(`✓ ${manual.name}: ${response.id}`);
  }

  const output = Object.entries(fileIds)
    .map(([key, id]) => `EXPO_PUBLIC_${key}_FILE_ID=${id}`)
    .join('\n');

  console.log('\nAdd these to your .env.local:\n');
  console.log(output);
}

uploadManuals().catch(console.error);
