import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.join(process.cwd(), 'src', 'assets');

const optimizeImages = async (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await optimizeImages(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
        const tempPath = fullPath + '.tmp';
        try {
          let image = sharp(fullPath).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true });
          
          if (ext === '.jpg' || ext === '.jpeg') {
            image = image.jpeg({ quality: 75, progressive: true });
          } else if (ext === '.png') {
            image = image.png({ quality: 75, compressionLevel: 8 });
          } else if (ext === '.webp') {
            image = image.webp({ quality: 75 });
          } else if (ext === '.avif') {
            image = image.avif({ quality: 75 });
          }
          
          await image.toFile(tempPath);
          const oldSize = stat.size;
          const newSize = fs.statSync(tempPath).size;
          
          if (newSize < oldSize) {
            fs.renameSync(tempPath, fullPath);
            console.log(`Optimized: ${file} (${(oldSize/1024/1024).toFixed(2)}MB -> ${(newSize/1024/1024).toFixed(2)}MB)`);
          } else {
            fs.unlinkSync(tempPath);
            console.log(`Skipped (already optimized): ${file}`);
          }
        } catch(e) {
          console.error(`Failed: ${fullPath}`, e.message);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
};

optimizeImages(assetsDir).then(() => console.log('Optimization complete!'));
