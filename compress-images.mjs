import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve('src/assets');

async function optimizeImage(filename, newExt, width) {
  const inputPath = path.join(assetsDir, filename);
  const parsed = path.parse(filename);
  const newName = `${parsed.name}${newExt}`;
  const outputPath = path.join(assetsDir, newName);

  if (!fs.existsSync(inputPath)) {
    console.log(`Not found: ${inputPath}`);
    return;
  }

  try {
    let img = sharp(inputPath).rotate();
    if (width) {
      img = img.resize({ width, withoutEnlargement: true });
    }
    
    if (newExt === '.webp') {
      img = img.webp({ quality: 80 });
    }

    await img.toFile(outputPath);
    console.log(`Optimized: ${filename} -> ${newName}`);
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
  }
}

async function main() {
  await optimizeImage('couple-right-leaf.JPG', '.webp', 1200);
  await optimizeImage('background1.jpeg', '.webp', 1920);
  await optimizeImage('envelope background.jpeg', '.webp', 1200);
  await optimizeImage('floral-border-bg.png', '.webp', null);
}

main();
