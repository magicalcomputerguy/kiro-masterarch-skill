# Examples

Each example is a specification package MasterArch produces from an informal request and an inspected project. They show the output a developer or another coding agent receives — not the application code itself.

The examples are adapted from MasterArch runs against the test fixture in `tests/fixtures/workbench/`, with fixture-specific paths generalized so the documents read as standalone samples. They illustrate the shape and quality of the output; the exact wording from any single run will differ.

## case-insensitive-search

A small bug: a task filter matches titles case-sensitively, so searching `write` misses "Write release notes". The request also arrived in two parts — the initial report, then a correction adding two exclusions (do not trim the query, do not add accent normalization).

[`case-insensitive-search/bugfix.md`](case-insensitive-search/bugfix.md) is a single-document package, appropriate for a small, bounded bug. It shows:

- The current behavior verified against source before proposing a fix, kept separate from the user's report.
- An evidence record that scopes the defect to the client and rules the API and CLI out.
- The two-part request consolidated, with the correction's exclusions preserved as explicit constraints.
- Ordered tasks, a requirement-to-task-to-verification table, and an agent handoff.
- An honest status: a regression test is proposed rather than claimed as passing, and no tests were run while writing the specification.

Larger work items produce a multi-document package (`requirements.md`, `design.md`, `tasks.md`) instead of a single file. See [the document contract](../masterarch/references/document-contract.md) for how the package size is chosen.
