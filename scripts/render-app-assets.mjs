/**
 * Renders the mobile app icons and splash from the section 2.4 brand spec, using the
 * same Source Serif 4 the web self-hosts. Run after changing any of the SVG sources:
 *   node scripts/render-app-assets.mjs
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'apps/mobile/assets');
const fontPath = process.env.SOURCE_SERIF_TTF ?? '/tmp/fonts/SourceSerif4.ttf';

const targets = [
  { svg: 'icon.svg', png: 'icon.png', width: 1024 },
  { svg: 'adaptive-icon.svg', png: 'adaptive-icon.png', width: 1024 },
  { svg: 'splash.svg', png: 'splash.png', width: 1284 },
  { svg: 'icon.svg', png: 'favicon.png', width: 48 },
];

for (const target of targets) {
  const svg = readFileSync(join(assets, target.svg), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: target.width },
    font: { fontFiles: [fontPath], loadSystemFonts: true, defaultFontFamily: 'Source Serif 4' },
  });
  writeFileSync(join(assets, target.png), resvg.render().asPng());
  console.log(`${target.png} at ${target.width}px`);
}
