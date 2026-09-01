import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const masonryDir = path.resolve('src/assets/masonary');

async function optimizeImages() {
  const files = fs.readdirSync(masonryDir);
  for (const file of files) {
    if (file.endsWith('.webp')) continue; // skip already optimized
    const inputPath = path.join(masonryDir, file);
    const parsed = path.parse(file);
    const newName = `${parsed.name}.webp`;
    const outputPath = path.join(masonryDir, newName);

    try {
      let img = sharp(inputPath).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 });
      await img.toFile(outputPath);
      console.log(`Optimized: ${file} -> ${newName}`);
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error);
    }
  }
}

optimizeImages();
