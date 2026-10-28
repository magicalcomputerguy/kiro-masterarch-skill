import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const allowEmpty = args.includes('--allow-empty');
const scenario = args.find(arg => !arg.startsWith('--'));
if (!/^S[1-5]$/.test(scenario ?? '')) {
  throw new Error('Usage: node tests/check-run.mjs S1..S5 [--allow-empty]');
}
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
if (documents.length === 0 && !allowEmpty) {
  failures.push(`No specification document produced under ${allowed} (pass --allow-empty to check isolation before a run)`);
}
console.log(JSON.stringify({ scenario, inputFiles: Object.keys(baseline.files).length, documents, failures }, null, 2));
if (failures.length) process.exitCode = 1;
