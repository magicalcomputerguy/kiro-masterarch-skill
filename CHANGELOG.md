# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-27

Initial release.

### Added

- `masterarch/SKILL.md` defining the skill's purpose, operating boundaries, and front-matter metadata (`name`, `description`, `license`, `compatibility`).
- `masterarch/references/investigation.md`: the discovery, evidence, requirement-interpretation, classification, and impact-analysis workflow.
- `masterarch/references/document-contract.md`: document sizing, traceability, task planning, verification, and agent handoff.
- A validation fixture (`tests/fixtures/workbench/`), behavioral scenarios (`tests/scenarios.md`), and an isolation harness (`tests/prepare-run.mjs`, `tests/check-run.mjs`) that verifies a run changes no input file and writes only to the approved location.
- Recorded blind behavioral runs of all five scenarios in `tests/results.md`.
- A sample specification package under `examples/`.
- `CONTRIBUTING.md` and this changelog.

### Notes

- MasterArch is a set of agent instructions, not a standalone program.
- The recorded behavioral runs are single runs on a server-selected model and do not guarantee behavior across all models or inputs. Native Kiro Spec-session integration has not been established.

[Unreleased]: https://github.com/magicalcomputerguy/kiro-masterarch-skill/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/magicalcomputerguy/kiro-masterarch-skill/releases/tag/v0.1.0
