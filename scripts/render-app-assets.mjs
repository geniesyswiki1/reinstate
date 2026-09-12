/**
 * Renders the mobile app icons and splash from the section 2.4 brand spec, using the
 * same Source Serif 4 the web self-hosts. Run after changing any of the SVG sources:
 *   node scripts/render-app-assets.mjs
 *
 * Every output is flattened to RGB with no alpha channel. Apple rejects an App Store
 * icon that is transparent or carries an alpha channel, and the upload fails with no
 * useful error, so this is not optional.
 */
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'apps/mobile/assets');
const fontPath = process.env.SOURCE_SERIF_TTF ?? '/tmp/fonts/SourceSerif4.ttf';

const REINSTATED = [0x0e, 0x7a, 0x4f];
const SHEET = [0xf7, 0xf8, 0xfa];

const targets = [
  { svg: 'icon.svg', png: 'icon.png', width: 1024, background: REINSTATED },
  { svg: 'adaptive-icon.svg', png: 'adaptive-icon.png', width: 1024, background: REINSTATED },
  { svg: 'splash.svg', png: 'splash.png', width: 1284, background: SHEET },
  { svg: 'icon.svg', png: 'favicon.png', width: 48, background: REINSTATED },
];

/**
 * Composite RGBA over an opaque background, then encode as RGB, colour type 2.
 * pngjs keeps `data` as RGBA internally whatever the colour type, so the buffer stays
 * 4 bytes per pixel and only the encoder drops the alpha. Writing 3 bytes per pixel
 * here silently corrupts the row stride.
 */
function flatten(pngBuffer, [br, bg, bb]) {
  const src = PNG.sync.read(pngBuffer);
  const out = new PNG({ width: src.width, height: src.height });
  for (let i = 0; i < src.data.length; i += 4) {
    const a = src.data[i + 3] / 255;
    out.data[i] = Math.round(src.data[i] * a + br * (1 - a));
    out.data[i + 1] = Math.round(src.data[i + 1] * a + bg * (1 - a));
    out.data[i + 2] = Math.round(src.data[i + 2] * a + bb * (1 - a));
    out.data[i + 3] = 255;
  }
  return PNG.sync.write(out, { colorType: 2 });
}

for (const target of targets) {
  const svg = readFileSync(join(assets, target.svg), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: target.width },
    font: { fontFiles: [fontPath], loadSystemFonts: true, defaultFontFamily: 'Source Serif 4' },
  });
  const flat = flatten(resvg.render().asPng(), target.background);
  writeFileSync(join(assets, target.png), flat);

  const colorType = flat[25];
  if (colorType !== 2) throw new Error(`${target.png} wrote colour type ${colorType}, expected 2`);
  console.log(`${target.png} at ${target.width}px, RGB with no alpha`);
}
