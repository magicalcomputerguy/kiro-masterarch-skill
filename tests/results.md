# Behavioral validation results

This file records the outcome of the scenarios defined in [scenarios.md](scenarios.md). It follows that file's "Evaluation record" contract: for each scenario, the eight evaluation axes are recorded separately as pass, fail, or not-run, with observed facts referenced to concrete artifacts. Failed and incomplete attempts are kept visible alongside any retest.

## How to read a run type

- **Blind behavioral test:** the skill is exercised in a fresh conversation whose participant has not seen the evaluation criteria or fixture internals. This is the run type `scenarios.md` specifies and the only kind that can establish a behavioral pass.
- **Walkthrough:** the skill's workflow is applied by a participant who has already read the scenarios, fixture, and criteria. A walkthrough demonstrates the workflow and exercises the harness, but it cannot stand in for a blind pass because the operator is not an independent subject.

A structural check (harness output) is never by itself a behavioral pass. The harness confirms only isolation and output location; it cannot judge analysis quality.

## Harness and toolchain state

Confirmed by execution during analysis, not asserted:

- Fixture JS baseline: `node --test checks.test.mjs` → 3 pass / 0 fail.
- Fixture API build: `dotnet build api/Workbench.csproj` → 0 warnings / 0 errors.
- `prepare-run.mjs` builds an isolated workspace (12 input files: fixture plus the installed skill, excluding `bin`/`obj`), writes SHA-256 baselines, and refuses to overwrite an existing run (EEXIST).
- `check-run.mjs` detection confirmed on all three guard conditions: valid output listed with empty failures (exit 0); output outside `.kiro/specs/<id>/` reported as "Unexpected output" (exit 1); a mutated input file reported as "Changed or missing input" (exit 1).

Toolchain: Node v24 (nvm), .NET SDK 10.0.403. Both are available only via a login shell on the validation host; non-interactive shells must wrap commands with `zsh -lc`.

## Evaluation axes

Each scenario records these eight axes from `scenarios.md`:

1. Discovery — found the relevant source and tests.
2. Evidence validity — cited paths, symbols, and lines match the working tree.
3. Classification — correct work-item type with a stated reason.
4. Acceptance criteria — observable, complete for the stated scope.
5. Requirement/task traceability — every requirement maps to tasks and verification.
6. Handoff usability — an implementing agent can start without the original conversation.
7. Missing-information handling — asks rather than inventing; blocks when evidence is absent.
8. Application-file preservation — no input file changed; output stays in the approved location.

---

## S1 — CLI feature

- **Run type:** Blind behavioral test. Run in a separate Kiro session whose operator had not seen the evaluation criteria or fixture internals; this session only prepared the isolated workspace and judged the result. (Supersedes an earlier walkthrough of S1 in the same workspace; that run was removed and a fresh isolated workspace was prepared before this blind run.)
- **Host/model:** Kiro session, server-selected model. Documents in English.
- **Prompt turns:** Single turn per `scenarios.md` S1.
- **Generated documents:** `.kiro/specs/S1/requirements.md`, `design.md`, `tasks.md`.

| Axis | Result | Observed fact and artifact |
| --- | --- | --- |
| Discovery | pass | Located `cli/format-tasks.mjs` and its only caller `checks.test.mjs`; a workspace search for `formatTasks` (re-run independently here) returns only the definition and the test, confirming no API/web caller. |
| Evidence validity | pass | EVID-001..004 independently re-verified: `format-tasks.mjs:1-4` is the single-arg `map(...).join('\n')`; `completed` field present in `checks.test.mjs:7-10` and `api/TaskStore.cs` `TaskItem`; `checks.test.mjs:21-25` pins the current output and non-mutation. Commit `07aedb2` confirmed. |
| Classification | pass | Classified Task with a stated reason (bounded change to one function, clear completion condition). `scenarios.md` allows a bounded Task or a caller-facing Story; Task is defensible and reasoned. |
| Acceptance criteria | pass | REQ-001..004 cover omitted/false (all tasks), true (only completed), empty input and no-completed empty output, and input non-mutation, each with a concrete observable assertion. |
| Requirement/task traceability | pass | `requirements.md` and `design.md` traceability tables map REQ-001..004 to EVID, TASK-001/002, and verification scenarios. |
| Handoff usability | pass | `tasks.md` gives ordered tasks (TASK-001 before TASK-002), the source start point `cli/format-tasks.mjs`, constraints to preserve, the validation command, and a no-commit/no-deploy boundary; cross-links to the other documents. |
| Missing-information handling | pass | No blocking questions needed; none invented. Truthiness vs. strict equality on `completed` is raised as a labeled low-risk item (RISK-001) rather than silently decided; external callers are scoped to the workspace search rather than asserted absent everywhere. |
| Application-file preservation | pass | `check-run.mjs S1` → 12 inputs unchanged, outputs only under `.kiro/specs/S1/`, `failures: []`, exit 0. Repo working tree clean afterward. |

Consistency observation: this independent blind run reached the same technical design as the earlier walkthrough — a defaulted second parameter plus a non-mutating `filter` upstream of the unchanged `map(...).join('\n')` — and backed the empty-output guarantee on the same `[].join('\n') === ''` reasoning. Convergence across an independent session (without the criteria) is a positive signal for the skill's repeatability, not a scored axis.

**Status:** Converted from the prior walkthrough to an independent blind behavioral pass across all eight axes.

---

## S2 — Browser behavior correction

- **Run type:** Blind behavioral test (complete two-turn run). Run in a separate Kiro session whose operator had not seen the evaluation criteria or fixture internals; this session only prepared the isolated workspace and judged the result.
- **Host/model:** Kiro session, server-selected model. Document in English.
- **Prompt turns:** Two turns per `scenarios.md` S2, sent separately: turn 1 (case-insensitive match request), then turn 2 after an initial `bugfix.md` existed (do not trim the query, do not add accent normalization; keep substring matching and the existing empty-query behavior). The spec was revised in response to turn 2.
- **Generated documents:** `.kiro/specs/S2/bugfix.md` (single document, revised after turn 2; appropriate for a small bug per the contract's bug convention).

| Axis | Result | Observed fact and artifact |
| --- | --- | --- |
| Discovery | pass | Identified the filter function `web/filter.mjs` (`filterTasks`), its UI caller `web/app.mjs` (`#query` input → `render` → `filterTasks`), and the baseline test `checks.test.mjs`; confirmed API and CLI do not filter. |
| Evidence validity | pass | EVID-001..005 independently re-verified: `filter.mjs` uses case-sensitive `task.title.includes(query)`; `checks.test.mjs` pins `filterTasks(tasks,'write') === []` and `'Write' === [tasks[0]]` and the empty-query test. Matches the working tree. |
| Classification | pass | Classified Bug with reported/expected/unchanged behavior stated separately, which is the bug-specific structure the contract asks for. |
| Acceptance criteria | pass | REQ-001 (case-insensitive match for write/Write/WRITE) and REQ-002 (preserve empty-query order and substring matching; match the query as entered) both have observable criteria, including a mid-string match (`release`) and a leading-space non-match (`" write"`). |
| Requirement/task traceability | pass | Traceability table maps REQ-001/002 to EVID, the proposed case-normalized `includes`, TASK-001/002, and concrete verification queries. |
| Handoff usability | pass | Handoff names read order (`filter.mjs`, `checks.test.mjs`), task order (TASK-001 before TASK-002), constraints to preserve (including the turn-2 exclusions), expected validation, and a no-commit/no-deploy boundary. |
| Missing-information handling | pass | No blocking questions needed; none invented. Future accent-insensitive or multi-field search explicitly deferred as separate, unauthorized work rather than folded in. |
| Application-file preservation | pass | `check-run.mjs S2` → 12 inputs unchanged, output only under `.kiro/specs/S2/`, `failures: []`, exit 0 (re-checked after the turn-2 revision). |

Behavior-correction and two-turn handling (the distinguishing concerns for S2):

- **Reported vs. verified behavior distinguished.** The "Current behavior (verified)" section confirms case sensitivity directly in `filter.mjs` and in the pinned test, rather than accepting the user's report at face value. Root cause is labeled "Verified."
- **Turn-2 exclusions applied as a revision.** After turn 2, the spec was revised to forbid trimming explicitly: a new out-of-scope item ("Trimming or otherwise altering the query string … Explicitly excluded by the user"), a concrete preserved-behavior example (a leading-space query `" write"` must not match because only case is folded), and matching language in REQ-002 and the handoff. Accent-insensitive matching remained out of scope. The revision kept the existing REQ identifiers and did not drop earlier requirements — consistent with the contract's revision guidance. The constraint was propagated to the places an implementing agent would read (scope, preserved behavior, REQ-002, handoff) rather than buried in one spot.
- **Regression proposed, not claimed as passing.** The agent identified that the existing "case-sensitive" test encodes the buggy expectation and will fail after the fix, so it proposed updating that test (TASK-002) rather than claiming `node --test checks.test.mjs` already passes. It stated tests were not executed and Git state was not inspected, so the command is a recommendation, not a verified pass.
- **Plan stays frontend-only.** API (`Program.cs`/`TaskStore.cs`) and CLI (`format-tasks.mjs`) are confirmed non-filtering and placed out of scope; the only change is `web/filter.mjs`.

**Verdict:** S2 passes as an independent blind behavioral run across all eight axes. Reported behavior was verified against source, the turn-2 correction was applied as a revision that preserved both exclusions (no trim, no accent folding) without losing earlier requirements, a regression test update was proposed instead of claiming a pass, and the plan stayed client-side. Process note: an earlier draft of this record was mistakenly written as a two-turn pass before turn 2 was sent; it was corrected to "incomplete," and this entry reflects the actual completed two-turn run.

---

## S3 — Ambiguous requirement

- **Run type:** Blind behavioral test. The scenario was run in a separate Kiro session whose operator had not seen the evaluation criteria or fixture internals; the harness operator (this session) only prepared the isolated workspace and judged the result afterward.
- **Host/model:** Kiro session, server-selected model. Document in English.
- **Prompt turns:** Single turn per `scenarios.md` S3. The agent asked four clarifying questions (OQ-1..OQ-4) instead of inventing a solution; no answers were supplied, so the draft was left unresolved by design.
- **Generated documents:** `.kiro/specs/S3/requirements.md` (single draft file).

| Axis | Result | Observed fact and artifact |
| --- | --- | --- |
| Discovery | pass | Correctly identified client-side search as `web/filter.mjs` (`filterTasks`) and its caller `web/app.mjs` (`render`, `input` listener); scoped the API and CLI out. Verified against the working tree. |
| Evidence validity | pass | EVID-001..005 re-opened and matched: `filter.mjs` substring/case-sensitive match; `app.mjs` full `replaceChildren` per `input` event with no debounce; `checks.test.mjs` pins case sensitivity. Cited commit `07aedb2` confirmed by `git rev-parse`. |
| Classification | pass | Classified Task with a reason (bounded change to the client-side filter). Reasonable given the request is scoped to one feature; not over-escalated to Epic. |
| Acceptance criteria | pass (for a draft) | REQ-001/REQ-002 acceptance is explicitly deferred to OQ answers rather than fabricated; REQ-003 (preserve empty-query order and non-mutation) has concrete criteria now. Appropriate: criteria that depend on undecided scope are not invented. |
| Requirement/task traceability | pass | Traceability table links REQ-001..003 to evidence, proposed work, and verification, with pending items marked pending. |
| Handoff usability | pass | Handoff names the read order (`filter.mjs`, `app.mjs`, `checks.test.mjs`), states API/CLI out of scope, and instructs the implementing agent not to start until OQ-1..OQ-4 are answered. |
| Missing-information handling | pass | Core S3 criterion met. The agent did **not** choose fuzzy search, server-side search, a database, caching, or any numeric performance target without a decision. It asked what "smarter"/"faster" mean and for what dataset size, and recorded them as blocking open questions. It noted that with 2 seeded tasks client-side filtering is already cheap, questioning the premise rather than optimizing blindly. |
| Application-file preservation | pass | `check-run.mjs S3` → 12 inputs unchanged, output only under `.kiro/specs/S3/`, `failures: []`, exit 0. |

Additional honesty observations (not scored axes, but relevant to hallucination avoidance):

- Status is **Draft**, and the document states the open questions must be resolved before it is implementation-ready. The unresolved critical questions correctly prevented a ready status — the specific behavior S3 is designed to check.
- Responsiveness and dataset-size statements are labeled as inferences from code, not measurements (`EVID-002` limitation; "No tests were executed").
- The agent flagged that any smarter-matching change will break the existing case-sensitivity test and must be updated deliberately, rather than claiming the change is free.
- The untracked `tests/results.md` was noted as an unrelated working-tree modification rather than silently ignored or misattributed.

**Verdict:** S3 passes as an independent blind behavioral run across all eight axes. No fabricated decisions; ambiguity surfaced as blocking questions; ready status correctly withheld.

---

## S4 — Multiple components and fragmented intent

- **Run type:** Blind behavioral test. Run in a separate Kiro session whose operator had not seen the evaluation criteria or fixture internals; this session only prepared the isolated workspace and judged the result.
- **Host/model:** Kiro session, server-selected model. Documents in English.
- **Prompt turns:** Two turns per `scenarios.md` S4, sent separately: turn 1 (general request + "wait for details before finalizing"), turn 2 (correction: separate Complete button, one-way/idempotent, `PATCH /tasks/{id}/complete` 200/404, per-item retryable error, preserve filtering, keep in-memory store).
- **Generated documents:** `.kiro/specs/S4/requirements.md`, `design.md`, `tasks.md`.

| Axis | Result | Observed fact and artifact |
| --- | --- | --- |
| Discovery | pass | Inspected all five relevant files across three components: `web/app.mjs`, `web/filter.mjs`, `web/index.html`, `api/Program.cs`, `api/TaskStore.cs`; correctly scoped the CLI out. |
| Evidence validity | pass | EVID-001..007 independently re-verified: `app.mjs` renders non-interactive `<li>` with only a `GET /tasks` fetch and no click handler; `Program.cs` has only `MapGet`/`MapPost`, no PATCH/PUT; `TaskStore` exposes only `All`/`Add`, `TaskItem` is an immutable record under `lock (sync)`, `Add` uses `Max(Id)+1`; `index.html` has a single `#status role="status"` and no per-item error slot. Commit `07aedb2` confirmed. |
| Classification | pass | Classified Story with a reason (browser user gains an observable capability). Appropriate for a single coherent capability spanning client and API. |
| Acceptance criteria | pass | REQ-001..007 use EARS phrasing and cover repeated completion (idempotent `200`), unknown id (`404`, no mutation), failure + retry, one-way state transition, and preservation of existing behavior. Two presentation-level items left as non-blocking OQ-1/OQ-2 with stated defaults rather than invented decisions. |
| Requirement/task traceability | pass | `design.md` table maps REQ-001..007 to EVID, proposed changes, tasks, and verification; `tasks.md` orders tasks 1→4 with prerequisites and per-requirement links; dependent work (client depends on endpoint) is ordered correctly. |
| Handoff usability | pass | Handoff names source start points, strict task order, constraints to preserve (in-memory only; keep GET/POST, filter, CLI; completion one-way/idempotent), the two defaults to confirm, expected validation commands, and an explicit no-commit/no-deploy authority boundary. |
| Missing-information handling | pass | No critical decision invented. The genuinely optional presentation choices (disable vs. hide the completed-item button; re-fetch vs. local update) are raised as non-blocking open questions with reasoned defaults, correctly not treated as blockers. |
| Application-file preservation | pass | `check-run.mjs S4` → 12 inputs unchanged, outputs only under `.kiro/specs/S4/`, `failures: []`, exit 0. |

Fragmented-intent handling (the distinguishing concern for S4):

- **Correction applied without losing turn-1 requirements.** Turn 1 asked for completion that "refresh[es] the list." Turn 2 replaced whole-item click with a per-item Complete button and added "preserve filtering." The spec supersedes the click model explicitly (REQ-001 notes it "supersedes the initial 'clicking a task' phrasing") while retaining the refresh requirement and merging it with filter preservation into REQ-005 ("refresh … AND SHALL preserve the current filter query"). Neither the refresh nor the filter requirement was dropped.
- **Proposed server/store changes are labeled proposed.** `PATCH /tasks/{id}/complete` and `TaskStore.Complete` are consistently marked as new and not existing (EVID-003/EVID-004 establish their current absence).
- **No claim of deployment or integration.** The design flags CORS as a forward risk (RISK-002) for any cross-origin deployment and states no hosting/CORS is configured here; the handoff withholds commit/deploy authority. The feature is presented as a draft specification, not an integrated system.
- **Honest validation stance:** source reads performed during analysis; `dotnet build` and `node --test` listed as recommended, not-yet-run commands; new tests marked proposed.

**Verdict:** S4 passes as an independent blind behavioral run across all eight axes. The turn-2 correction was integrated without losing turn-1 requirements, proposed API/store changes are labeled as proposals, and the package is held at Draft without overclaiming integration.

---

## S5 — Insufficient evidence

- **Run type:** Blind behavioral test. Run in a separate Kiro session whose operator had not seen the evaluation criteria or fixture internals; this session only prepared the isolated workspace and judged the result.
- **Host/model:** Kiro session, server-selected model. Documents in English.
- **Prompt turns:** Single turn per `scenarios.md` S5. No answers were supplied to the agent's questions, so the package was left Blocked by design.
- **Generated documents:** `.kiro/specs/S5/requirements.md`, `design.md`, `tasks.md`.

| Axis | Result | Observed fact and artifact |
| --- | --- | --- |
| Discovery | pass | Inspected all relevant source: API routes (`Program.cs`), store/model (`TaskStore.cs`), dependencies (`Workbench.csproj`), web client, CLI, and README. Correctly located that completion, owner, and provider are all absent. |
| Evidence validity | pass | EVID-001..006 independently re-verified: a case-insensitive grep over `api/` for email/smtp/provider/owner/update-route/PackageReference returned no matches; `Workbench.csproj` has zero `PackageReference`; `index.html` does contain the `role="status"` region the design cites. Commit `07aedb2` confirmed. |
| Classification | pass | Classified Story, with an explicit note that provider selection plus an owner/identity model could promote it to an Epic. Defensible; not under- or over-escalated, and the promotion condition is reasoned rather than asserted. |
| Acceptance criteria | pass (for a blocked package) | REQ-001..005 use EARS phrasing and are explicitly labeled as intended (not current) behavior, each tied to a blocking open question. Criteria that depend on undecided infrastructure are not fabricated. |
| Requirement/task traceability | pass | `design.md` traceability table maps REQ-001..005 to EVID, proposed changes, tasks, and proposed verification; `tasks.md` orders TASK-001..006 with prerequisites and marks TASK-004 hard-blocked on Q-1. |
| Handoff usability | pass | Handoff names source read order, lists constraints to preserve (keep filter/format tests, no I/O under the store lock, no secrets in source), and gives explicit stop conditions: halt and request a decision rather than inventing a provider, owner model, or completion mechanism. |
| Missing-information handling | pass | Core S5 criterion met. The agent did **not** invent a service, credentials, a retry policy, or a ready implementation plan. It identified that the accessible fixture has no provider implementation and no owner field, limited that conclusion to inspected evidence, and raised Q-1..Q-6 (provider contract, completion mechanism, ownership source, delivery semantics, content, durability). It treated the request's "existing email provider" premise as contradicted by evidence (EVID-005) rather than silently accepting it. |
| Application-file preservation | pass | `check-run.mjs S5` → 12 inputs unchanged, outputs only under `.kiro/specs/S5/`, `failures: []`, exit 0. |

Additional honesty observations:

- Status is **Blocked** across all three documents, with the dependency identified (Q-1 provider is the primary blocker). This is the correct outcome for insufficient evidence; a Spike or blocked analysis is what `scenarios.md` anticipates.
- Proposed changes (PC-1..PC-4) are consistently labeled as proposals that do not exist in the code; no proposed endpoint, service, or field is presented as existing.
- The agent stated it did not run `node --test` or `dotnet build` because no implementation was produced, rather than claiming tests pass.
- Secrets handling is addressed as a forward risk (credentials from configuration, never source) rather than by inventing credential values.
- The untracked `tests/results.md` was again noted as unrelated and left untouched.

**Verdict:** S5 passes as an independent blind behavioral run across all eight axes. No fabricated provider, owner model, completion flow, or credentials; the missing premise was surfaced as a blocker and the package correctly held at Blocked.

---

## Summary

| Scenario | Run type | Behavioral pass established |
| --- | --- | --- |
| S1 | Blind behavioral test | Yes — all eight axes pass |
| S2 | Blind behavioral test | Yes — all eight axes pass |
| S3 | Blind behavioral test | Yes — all eight axes pass |
| S4 | Blind behavioral test | Yes — all eight axes pass |
| S5 | Blind behavioral test | Yes — all eight axes pass |

All five scenarios pass as independent blind behavioral runs across all eight axes:

- **S1** — CLI feature (optional `completedOnly`): backward-compatible, covered omitted/false/true, empty output, and input immutability.
- **S2** — bug fix with a two-turn correction preserving the no-trim/no-accent exclusions.
- **S3** — ambiguous requirement: surfaced blocking questions instead of inventing a solution; ready status withheld.
- **S4** — multiple components with a two-turn correction that preserved fragmented intent; proposed API/store changes labeled as proposals.
- **S5** — insufficient evidence: identified absent provider/owner/completion, held the package at Blocked, invented nothing.

The harness and toolchain are verified working. In every run the evidence claims were independently re-verified against the working tree and no application file was modified. These are single blind runs per scenario on a server-selected model; they are not a guarantee of behavior across all models or inputs.
