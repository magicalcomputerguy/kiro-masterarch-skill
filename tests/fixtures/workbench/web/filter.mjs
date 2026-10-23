export function filterTasks(tasks, query) {
  return tasks.filter(task => task.title.includes(query));
}
