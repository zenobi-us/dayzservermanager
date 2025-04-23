import fs from 'fs';
import path from 'path';

export const getDirSize = (dirPath: string) => {
  let size = 0;
  if (!fs.existsSync(dirPath)) return size;
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath);
    }
  }
  return size;
};
