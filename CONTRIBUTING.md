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
node tests/prepare-run.mjs S1                 # creates .validation/S1/workspace
node tests/check-run.mjs S1 --allow-empty     # before a run: isolation and output location only
# (run the skill against that workspace in a separate session)
node tests/check-run.mjs S1                   # after a run: also require at least one spec document
```

By default `check-run.mjs` fails when no Markdown document was written under `.kiro/specs/<id>/`, so an empty run cannot pass silently. Use `--allow-empty` to check isolation before the skill has run. `.validation/` is git-ignored. See `tests/scenarios.md` for the behavioral scenarios and `tests/results.md` for recorded results.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs the fixture JavaScript baseline, the fixture API build, and the isolation harness guards on every push and pull request to `main`. CI confirms the harness and fixture toolchain, not the semantic quality of a generated specification — that still requires the blind behavioral review described in `tests/scenarios.md`.

## Documentation style

Source code, documentation, and commit messages are written in English. Keep the tone concise and factual. Distinguish verified findings from proposals and assumptions, and do not claim coverage or compatibility that has not actually been exercised.

## Commits

Use short, conventional commit subjects (`feat:`, `fix:`, `docs:`, `test:`, `chore:`). Keep a commit to one logical change. Do not commit generated artifacts or the `.validation/` directory.

## Reporting issues

Open a GitHub issue describing the change you have in mind or the problem you hit. For behavioral problems with the skill, include the request you gave, the project it ran against, and the output you received so it can be reproduced.
