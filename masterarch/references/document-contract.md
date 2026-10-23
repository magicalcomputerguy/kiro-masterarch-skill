# Specification document contract

## Choose the package size and destination

Agree on the output directory before creating documents. For Kiro, suggest `.kiro/specs/<work-item-slug>/` when appropriate; do not assume that location is authorized. Inspect existing files before writing and clarify whether the user wants an update or a separate package if that is unclear. Keep generated files inside the agreed directory.

Use the user's requested document language and conventions. Ask when the expected language is unclear and materially affects the deliverable. Prefer existing repository conventions for identifiers and document organization.

For a small Task or Spike, one Markdown document can contain the relevant sections below. For a feature with a meaningful design and implementation sequence, prefer:

- `requirements.md`: consolidated intent, scope, requirements, acceptance criteria, and open questions.
- `design.md`: current implementation evidence, proposed changes, impacts, alternatives, risks, and verification strategy.
- `tasks.md`: ordered, traceable work with completion criteria and handoff instructions.

For a bug, use `bugfix.md` instead of `requirements.md` when following the host's bugfix convention. For an Epic, describe child work items, shared constraints, and dependencies before producing detailed child specifications.

Create `agent-handoff.md` only when a separate handoff materially improves navigation or supplies context that would otherwise be missing. Keep test planning in `design.md` unless its size justifies a separate document. Do not create empty documents or require a manifest for every package.

Use relative links between documents. Preserve existing Kiro spec numbering and task checklist conventions when updating a native spec. These files are intended to work with Kiro's Markdown conventions; writing them does not prove native Spec session integration or automatically start a Spec workflow.

## Required information, wherever it lives

### Context and status

State the work-item title and classification, the consolidated request, in-scope and out-of-scope behavior, project root or portable project label, analyzed commit when available, relevant working-tree modifications, and uninspected areas.

Use a truthful status:

- **Draft:** analysis or specification is incomplete.
- **Blocked:** a missing decision or unavailable evidence prevents an actionable plan; identify the dependency.
- **Ready for implementation review:** critical questions are resolved and the completion checks below pass. This is not user approval or proof of production readiness.

### Requirements and behavior

Assign stable requirement identifiers such as `REQ-001`. Describe observable behavior and acceptance criteria, including main, alternative, and error flows when applicable. Use EARS-style criteria when following a Kiro feature spec; preserve an existing spec's notation.

Include only relevant non-functional requirements. Label user-specified targets and verified existing constraints separately from proposed targets. Link questions to the requirements or tasks they affect.

For bugs, state current, expected, and unchanged behavior. For Spikes, state research questions and exit criteria instead of claiming that an implementation plan is settled.

### Evidence and technical analysis

Include the evidence record or a link to its single maintained location. Reference it when explaining affected components and technical decisions. Keep these categories explicit:

- **Verified finding:** directly supported by inspected evidence.
- **Assumption:** unverified context, never a hidden replacement for a required user decision.
- **Proposed change:** future behavior or structure, not an existing implementation fact.
- **Open question:** missing information or a decision, with its impact.
- **Risk requiring validation:** a possible failure or limitation, with a proposed check or mitigation.

Describe the change in enough detail for a coding agent to act: affected interfaces and components, applicable data or state transitions, compatibility constraints, failure handling, and dependencies. Separate existing paths and symbols from proposed ones. Avoid embedding unnecessary source code or inventing signatures when the design does not yet justify them.

### Implementation tasks and verification

Use the host's task numbering format, or stable identifiers such as `TASK-001` where none exists. Each task needs:

- A concrete outcome and affected existing or proposed locations.
- Prerequisites and links to the requirements it serves.
- A completion condition and a verification scenario or check.

Put shared prerequisites before dependent tasks. Mark tasks as parallel only when their dependencies and shared modifications allow it. Do not pre-check implementation tasks merely because their specification has been written.

Map every requirement to implementation work and verification criteria. Verification scenarios should include the relevant successful behavior, error cases, and regression protection. Cite existing test commands only after inspecting their definitions; mark new commands or test files as proposed. Clearly distinguish checks performed during analysis from tests that the implementation agent should run later.

A compact traceability table is sufficient:

| Requirement | Evidence or new behavior | Tasks | Verification |
| --- | --- | --- | --- |
| REQ-001 | EVID-001 and proposed behavior | TASK-001 | Concrete observable scenario |

### Agent handoff

Tell the implementing agent which documents and source areas to read first, the task order, constraints it must preserve, and the expected validation. Include unresolved dependencies and stop conditions. Do not imply authority to commit, deploy, access external systems, or resolve product questions without the user's instructions.

If a critical dependency remains unresolved, mark the affected work as blocked and tell the implementing agent to obtain the answer before proceeding. The handoff should not require access to the original conversation to understand the approved scope and remaining questions.

## Completion checks

Before reporting the package complete:

1. Check that the consolidated scope accounts for the user's fragments and corrections without introducing unsupported behavior.
2. Reopen important source references to confirm the paths, symbols, and any cited line ranges match the inspected working tree. Report references that could not be checked.
3. Check that existing implementation claims have evidence and proposals are labeled as proposals.
4. Check that requirements have acceptance criteria, tasks, and verification coverage, or clearly stated blockers.
5. Check task ordering, links between documents, naming consistency, and the implementing agent's ability to find the starting points.
6. Check that no sensitive values or unnecessary code excerpts were copied and that all output stays within the agreed destination.
7. Report the actual checks performed, remaining questions, and limitations. Do not describe recommended future tests as passing tests.

These are content review checks. Automated structural checks cannot establish that the analysis or architecture is correct.
