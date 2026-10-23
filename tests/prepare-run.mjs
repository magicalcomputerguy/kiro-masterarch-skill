import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const scenario = process.argv[2];
if (!/^S[1-5]$/.test(scenario ?? '')) throw new Error('Usage: node tests/prepare-run.mjs S1..S5');
const run = path.join(root, '.validation', scenario);
await mkdir(path.dirname(run), { recursive: true });
await mkdir(run); // Refuse to overwrite an earlier run and its evidence.
const workspace = path.join(run, 'workspace');
await cp(path.join(root, 'tests/fixtures/workbench'), workspace, {
  recursive: true,
  filter: source => !['bin', 'obj'].includes(path.basename(source)),
});
await mkdir(path.join(workspace, '.kiro/skills'), { recursive: true });
await cp(path.join(root, 'masterarch'), path.join(workspace, '.kiro/skills/masterarch'), { recursive: true });

async function snapshot(directory, prefix = '') {
  const entries = {};
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + item.name;
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) Object.assign(entries, await snapshot(absolute, relative + '/'));
    else entries[relative] = createHash('sha256').update(await readFile(absolute)).digest('hex');
  }
  return entries;
}

await writeFile(path.join(run, 'baseline.json'), JSON.stringify({
  scenario, files: await snapshot(workspace),
}, null, 2) + '\n');
console.log(workspace);
