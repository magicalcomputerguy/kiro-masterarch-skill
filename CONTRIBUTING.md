# Contributing

Thanks for your interest in MasterArch. It is a small, focused project; contributions that keep it that way are welcome.

## What MasterArch is

MasterArch is an Agent Skill: a `SKILL.md` and reference documents that instruct a coding agent. It is not a standalone program. Most changes are edits to the Markdown instructions in `masterarch/`, or to the validation material in `tests/`.

## Scope

Prefer small, coherent changes. The project favors a minimal structure, so new files, dependencies, or infrastructure should be justified by a concrete need rather than added speculatively. Changes that would add a backend service, a database, or external network calls are out of scope for this project's goals.

## Running the checks

The skill instructions themselves are not executed, but the repository ships a validation fixture and harness.

Prerequisites:

- Node.js 18 or newer (for the harness and the fixture's JavaScript checks).
- .NET SDK 8.0 or newer (only to build the fixture's example API).

Fixture baseline — confirms the sample project behaves as its tests describe:

```
cd tests/fixtures/workbench
node --test checks.test.mjs
dotnet build api/Workbench.csproj
```

Isolation harness — prepares a throwaway copy of the fixture with the skill installed, then checks that a run changed no input file and wrote only to the approved spec location:

```
node tests/prepare-run.mjs S1   # creates .validation/S1/workspace
# (run the skill against that workspace in a separate session)
node tests/check-run.mjs S1     # reports documents produced and any violations
```

`.validation/` is git-ignored. See `tests/scenarios.md` for the behavioral scenarios and `tests/results.md` for recorded results.

## Documentation style

Source code, documentation, and commit messages are written in English. Keep the tone concise and factual. Distinguish verified findings from proposals and assumptions, and do not claim coverage or compatibility that has not actually been exercised.

## Commits

Use short, conventional commit subjects (`feat:`, `fix:`, `docs:`, `test:`, `chore:`). Keep a commit to one logical change. Do not commit generated artifacts or the `.validation/` directory.

## Reporting issues

Open a GitHub issue describing the change you have in mind or the problem you hit. For behavioral problems with the skill, include the request you gave, the project it ran against, and the output you received so it can be reproduced.
