import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'src/assets/rsvpbg.JPG';
const outputPath = 'src/assets/rsvpbg.webp';

async function optimize() {
  try {
    await sharp(inputPath)
      .rotate() // Auto-rotates based on EXIF orientation data
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log('Successfully optimized to', outputPath);
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimize();
