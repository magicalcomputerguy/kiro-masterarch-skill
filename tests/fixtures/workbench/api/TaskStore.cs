namespace Workbench;

public record TaskItem(int Id, string Title, bool Completed);

public sealed class TaskStore
{
    private readonly List<TaskItem> items = [
        new(1, "Write release notes", false),
        new(2, "Review documentation", true)
    ];
    private readonly object sync = new();

    public TaskItem[] All()
    {
        lock (sync) return items.ToArray();
    }

    public TaskItem Add(string title)
    {
        lock (sync)
        {
            var item = new TaskItem(items.Max(item => item.Id) + 1, title, false);
            items.Add(item);
            return item;
        }
    }
}
