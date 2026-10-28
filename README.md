# MasterArch

Turn informal software requirements into implementation-ready technical specifications grounded in an existing project.

MasterArch is an Agent Skill intended primarily for Kiro. It is designed for software projects across languages, frameworks, and application types, including projects without a backend.

## Status

The repository contains the skill instructions, a repository investigation workflow, and an adaptable specification document contract. These are agent instructions, not a standalone analysis program. The workflow has been exercised through blind behavioral runs against a test fixture (see [`tests/results.md`](tests/results.md)); those are single runs on a server-selected model, not a guarantee across all models or inputs.

Two things were verified separately and should not be conflated: the skill was invoked as a slash command inside a Kiro session and produced the recorded documents, and it has *not* been wired into a native Kiro Spec session (the Spec requirements → design → tasks workflow). The recorded runs establish the former, not the latter. This is the first release line (v0.1.x); see [`CHANGELOG.md`](CHANGELOG.md).

The workflow combines requirements shared across messages, investigates the relevant existing implementation, clarifies missing decisions, and prepares an analysis and ordered plan that another coding agent can use. MasterArch's responsibility is specification and handoff, not feature implementation.

## Try the initial definition in Kiro

Copy the `masterarch/` folder into either:

- `.kiro/skills/masterarch/` in a target workspace.
- `~/.kiro/skills/masterarch/` for personal use across workspaces.

Then invoke `/masterarch` with the project location and your change request. You can provide the request in several messages. Agree on an output location before asking the agent to write documents.

These locations and invocation follow the [Kiro Skills documentation](https://kiro.dev/docs/skills/); they have not been verified with this skill in a running Kiro session.

## What it produces

See [`examples/`](examples/) for a sample specification package. The [case-insensitive-search example](examples/case-insensitive-search/bugfix.md) shows a single-document bug package: the current behavior verified against source, an evidence record, a two-part request consolidated with its correction preserved, ordered tasks, a requirement-to-task-to-verification table, and an agent handoff. Larger work items produce a multi-document package (`requirements.md`, `design.md`, `tasks.md`).

## Development

The skill instructions are not executed, but the repository ships a validation fixture and harness. With Node.js 18+ and the .NET SDK 8.0+:

```
# fixture baseline
cd tests/fixtures/workbench && node --test checks.test.mjs && dotnet build api/Workbench.csproj

# isolation harness (from the repository root)
node tests/prepare-run.mjs S1                 # prepare an isolated run
node tests/check-run.mjs S1 --allow-empty     # before a run: inputs unchanged, output location only
node tests/check-run.mjs S1                   # after a run: also require a specification document
```

These checks run on every push and pull request via [GitHub Actions](.github/workflows/ci.yml).

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details and [`tests/scenarios.md`](tests/scenarios.md) for the behavioral scenarios.

## Boundaries

- Inspect the accessible local project before making project-specific recommendations.
- Separate verified findings, assumptions, proposed changes, unresolved questions, and risks.
- Ask about missing decisions rather than silently filling them in.
- Write documents only to an agreed output location; do not modify application source code.
- Do not add external data transfers, integrations, or infrastructure as part of the analysis.

Local-first describes the skill's workflow. The host agent's model processing and data policies still apply.

## Layout

- `masterarch/SKILL.md`: skill metadata, purpose, and initial operating boundaries.
- `masterarch/references/investigation.md`: discovery, evidence, requirement interpretation, classification, and impact analysis.
- `masterarch/references/document-contract.md`: document sizing, traceability, task planning, verification, and agent handoff.
- `examples/`: a sample specification package produced by the skill.
- `tests/`: the validation fixture, behavioral scenarios, and an isolation harness.
- `.github/workflows/ci.yml`: continuous integration for the fixture and harness checks.
- `CONTRIBUTING.md`: how to run the checks and contribute.
- `CHANGELOG.md`: release history.
- `LICENSE`: MIT license.

The package follows the [Agent Skills format](https://agentskills.io/specification). Additional references, templates, or scripts will be introduced only when the workflow needs them.

## License

[MIT](LICENSE), copyright 2026 Ramiz K.
