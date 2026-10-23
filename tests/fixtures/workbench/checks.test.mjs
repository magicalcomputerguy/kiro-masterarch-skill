import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks } from './web/filter.mjs';
import { formatTasks } from './cli/format-tasks.mjs';

const tasks = [
  { id: 1, title: 'Write release notes', completed: false },
  { id: 2, title: 'Review documentation', completed: true },
];

test('empty query preserves all tasks in order', () => {
  assert.deepEqual(filterTasks(tasks, ''), tasks);
});

test('current filtering is case-sensitive', () => {
  assert.deepEqual(filterTasks(tasks, 'write'), []);
  assert.deepEqual(filterTasks(tasks, 'Write'), [tasks[0]]);
});

test('CLI currently formats every task and does not mutate its input', () => {
  const before = structuredClone(tasks);
  assert.equal(formatTasks(tasks), '1: Write release notes\n2: Review documentation');
  assert.deepEqual(tasks, before);
});
