/**
 * Section 2.3: hyphens only. Never em dashes or en dashes anywhere, including
 * generated documents and commit messages. This checks the source we ship.
 *
 * SPEC.md is excluded: it is the source document, kept verbatim as delivered.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', '.netlify']);
const SKIP_FILES = new Set(['SPEC.md']);
const EXTENSIONS = ['.ts', '.tsx', '.json', '.css', '.md', '.txt', '.sql', '.mts', '.toml', '.svg', '.yml'];

// Built from code points so this file contains no literal dash of its own.
const FORBIDDEN: Record<string, string> = {
  '\u2012': 'figure dash',
  '\u2013': 'en dash',
  '\u2014': 'em dash',
  '\u2015': 'horizontal bar',
  '\u2212': 'minus sign',
};
const pattern = new RegExp(`[${Object.keys(FORBIDDEN).join('')}]`, 'g');

function walk(dir: string, found: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full, found);
      continue;
    }

    const rel = relative(root, full);
    if (SKIP_FILES.has(rel)) continue;
    if (!EXTENSIONS.some((ext) => entry.endsWith(ext))) continue;

    const lines = readFileSync(full, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const match of line.matchAll(pattern)) {
        found.push(`${rel}:${i + 1}: ${FORBIDDEN[match[0]]} in: ${line.trim().slice(0, 100)}`);
      }
    });
  }
}

const found: string[] = [];
walk(root, found);

if (found.length > 0) {
  console.error('Em or en dashes found. The brand uses hyphens only (section 2.3).\n');
  for (const line of found) console.error(`  ${line}`);
  console.error(`\n${found.length} ${found.length === 1 ? 'occurrence' : 'occurrences'}.`);
  process.exit(1);
}

console.log('Hyphens only. No em or en dashes in shipped copy.');
