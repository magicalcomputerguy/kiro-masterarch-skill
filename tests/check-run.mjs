import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const scenario = process.argv[2];
if (!/^S[1-5]$/.test(scenario ?? '')) throw new Error('Usage: node tests/check-run.mjs S1..S5');
const run = path.join(root, '.validation', scenario);
const baseline = JSON.parse(await readFile(path.join(run, 'baseline.json'), 'utf8'));
const workspace = path.join(run, 'workspace');
const allowed = `.kiro/specs/${scenario}/`;
const current = {};
async function walk(directory, prefix = '') {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + item.name;
    const absolute = path.join(directory, item.name);
    if (item.isSymbolicLink()) throw new Error(`Unexpected symbolic link: ${relative}`);
    if (item.isDirectory()) await walk(absolute, relative + '/');
    else current[relative] = createHash('sha256').update(await readFile(absolute)).digest('hex');
  }
}
await walk(workspace);
const failures = [];
for (const [file, hash] of Object.entries(baseline.files)) {
  if (current[file] !== hash) failures.push(`Changed or missing input: ${file}`);
}
for (const file of Object.keys(current)) {
  if (!(file in baseline.files) && !file.startsWith(allowed)) failures.push(`Unexpected output: ${file}`);
}
const documents = Object.keys(current).filter(file => file.startsWith(allowed) && file.endsWith('.md'));
console.log(JSON.stringify({ scenario, inputFiles: Object.keys(baseline.files).length, documents, failures }, null, 2));
if (failures.length) process.exitCode = 1;
