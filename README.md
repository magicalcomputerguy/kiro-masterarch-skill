# MasterArch

Turn informal software requirements into implementation-ready technical specifications grounded in an existing project.

MasterArch is an Agent Skill intended primarily for Kiro. It is designed for software projects across languages, frameworks, and application types, including projects without a backend.

## Status

The repository currently contains the initial skill definition and operating boundaries. The detailed analysis workflow, reusable output templates, and behavioral validation are not implemented yet. Kiro compatibility has not been tested. The first planned release is v0.1.0.

The intended workflow is to combine requirements shared across messages, investigate the relevant existing implementation, clarify missing decisions, and prepare an analysis and ordered plan that another coding agent can use. MasterArch's responsibility is specification and handoff, not feature implementation.

## Try the initial definition in Kiro

Copy the `masterarch/` folder into either:

- `.kiro/skills/masterarch/` in a target workspace.
- `~/.kiro/skills/masterarch/` for personal use across workspaces.

Then invoke `/masterarch` with the project location and your change request. You can provide the request in several messages. Agree on an output location before asking the agent to write documents.

These locations and invocation follow the [Kiro Skills documentation](https://kiro.dev/docs/skills/); they have not been verified with this skill in a running Kiro session.

## Boundaries

- Inspect the accessible local project before making project-specific recommendations.
- Separate verified findings, assumptions, proposed changes, unresolved questions, and risks.
- Ask about missing decisions rather than silently filling them in.
- Write documents only to an agreed output location; do not modify application source code.
- Do not add external data transfers, integrations, or infrastructure as part of the analysis.

Local-first describes the skill's workflow. The host agent's model processing and data policies still apply.

## Layout

- `masterarch/SKILL.md`: skill metadata, purpose, and initial operating boundaries.
- `LICENSE`: MIT license.

The package follows the [Agent Skills format](https://agentskills.io/specification). Additional references, templates, or scripts will be introduced only when the workflow needs them.

## License

[MIT](LICENSE), copyright 2026 Ramiz K.
