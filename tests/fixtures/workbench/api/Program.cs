using Workbench;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var store = new TaskStore();

app.MapGet("/tasks", () => store.All());
app.MapPost("/tasks", (CreateTask request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest(new { error = "Title is required." });

    var item = store.Add(request.Title.Trim());
    return Results.Created($"/tasks/{item.Id}", item);
});

app.Run();

record CreateTask(string Title);
