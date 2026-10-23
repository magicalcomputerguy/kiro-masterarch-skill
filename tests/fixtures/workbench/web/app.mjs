import { filterTasks } from './filter.mjs';

const input = document.querySelector('#query');
const list = document.querySelector('#tasks');
const status = document.querySelector('#status');
let tasks = [];

function render() {
  list.replaceChildren(...filterTasks(tasks, input.value).map(task => {
    const item = document.createElement('li');
    item.textContent = `${task.title}${task.completed ? ' (completed)' : ''}`;
    return item;
  }));
}

input.addEventListener('input', render);

try {
  const response = await fetch('/tasks');
  if (!response.ok) throw new Error('Task request failed');
  tasks = await response.json();
  render();
} catch {
  status.textContent = 'Tasks could not be loaded.';
}
