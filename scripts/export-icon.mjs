import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, '../assets');
const SVG_PATH = path.join(ASSETS, 'icon.svg');
const svgBuffer = fs.readFileSync(SVG_PATH);

async function exportIcons() {
  // Main icon 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile(path.join(ASSETS, 'icon.png'));
  console.log('✓ icon.png (1024x1024)');

  // Adaptive icon 432x432
  await sharp(svgBuffer).resize(432, 432).png().toFile(path.join(ASSETS, 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png (432x432)');

  // Splash icon — icon centered on green background
  const iconBuffer = await sharp(svgBuffer).resize(288, 288).png().toBuffer();
  await sharp({
    create: { width: 1284, height: 2778, channels: 4, background: { r: 26, g: 58, b: 42, alpha: 1 } }
  })
    .composite([{ input: iconBuffer, left: 498, top: 1245 }])
    .png()
    .toFile(path.join(ASSETS, 'splash-icon.png'));
  console.log('✓ splash-icon.png (1284x2778)');

  console.log('\nAll icons exported.');
}

exportIcons().catch(console.error);
