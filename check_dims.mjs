import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './src/assets/masonary';

async function checkDimensions() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const metadata = await sharp(fullPath).metadata();
      console.log(`${file}: ${metadata.width}x${metadata.height}`);
    } catch (e) {
      console.error(e);
    }
  }
}
checkDimensions();
