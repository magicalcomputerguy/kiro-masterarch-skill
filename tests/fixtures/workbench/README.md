# Workbench fixture

A deliberately small software project for specification testing. It contains a .NET task API, a browser client, and an independent JavaScript CLI helper. It uses in-memory task data and has no authentication, database, or notification provider implementation.

The browser client is served separately and calls `/tasks` on its own origin; production hosting and routing are not configured here. Do not infer a deployed system from this fixture.

Run the JavaScript baseline checks with `node --test checks.test.mjs`. Build the API with `dotnet build api/Workbench.csproj`. The build is not an API integration test.

The notification design is incomplete. A previous note says an email provider may be used, but no provider, API contract, or delivery guarantee has been selected.
