import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx'), publicDir: path.resolve('public') });
const composition = await selectComposition({ serveUrl, id: 'Flow', browserExecutable });
const mode = process.argv[2];
if (mode === 'stills') {
  for (const f of [30, 75, 140, 200, 262, 300]) {
    await renderStill({ serveUrl, composition, frame: f, output: `stills/f${f}.png`, browserExecutable });
  }
} else {
  var r; r = await renderMedia({ onProgress: ({ progress }) => { if (Math.round(progress*100) % 25 === 0) console.log('progress', progress.toFixed(2)); }, serveUrl, composition, codec: 'h264', crf: 20, outputLocation: path.resolve('out/flow.tmp.mp4'), browserExecutable, concurrency: 2 });
}
console.log('done', typeof r === 'undefined' ? '' : Object.keys(r||{}));
