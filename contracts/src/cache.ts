import fs from 'fs/promises';
import { Cache } from 'o1js';
import { Add } from './Add.js';

const cacheDir = '../ui/public/cache';
const listFile = `${cacheDir}/list.json`;

async function cacheCompile() {
  // compile
  const cache = Cache.FileSystem(cacheDir);
  await Add.compile({ cache });

  // write the list of compilation files into a json file
  const files = (await fs.readdir(cacheDir, 'utf8')).filter(
    (file) => !file.endsWith('.header') && !file.endsWith('.json')
  );
  await fs.writeFile(listFile, JSON.stringify({ files }));
  console.log('files:', files);
}

console.log('Compiling circuit...');
console.time('Done');
await cacheCompile().catch((e) => console.error(e));
console.timeEnd('Done');
