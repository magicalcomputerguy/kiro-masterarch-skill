export function formatTasks(tasks) {
  return tasks.map(task => `${task.id}: ${task.title}`).join('\n');
}
