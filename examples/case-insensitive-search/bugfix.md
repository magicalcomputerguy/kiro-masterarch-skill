# Bugfix: Case-insensitive task title filtering

## Context and status

- **Title:** Task filter does not match titles regardless of letter case
- **Classification:** Bug
- **Status:** Ready for implementation review
- **Project root:** Example project — a small browser client with a task list filter, served alongside a task API and a CLI helper
- **Analyzed working tree:** inspected as present on disk; Git state not checked
- **Relevant working-tree modifications:** none observed during inspection
- **Uninspected areas:** none material to this bug. The API and the CLI helper were inspected and confirmed not to perform title filtering.

### Consolidated request

Searching for `write` does not find the task "Write release notes". The filter should match task titles regardless of letter case, so a lowercase query such as `write` returns the "Write release notes" task.

The user later added two constraints: do not trim the query, and do not add accent normalization. Keep substring matching and the existing empty-query behavior.

### Scope

**In scope**
- Make the browser client's task-title filtering case-insensitive.

**Out of scope**
- Server-side filtering or new query parameters on the task endpoint (the API returns all tasks and does no filtering — EVID-003).
- CLI output behavior (the CLI helper does not filter — EVID-004).
- Accent/diacritic-insensitive matching, fuzzy/substring ranking, or multi-field search. Not requested.
- Trimming or otherwise altering the query string (e.g. stripping leading/trailing whitespace). The query must be compared as entered, differing only by letter case. Explicitly excluded by the user.

## Bug behavior

### Current behavior (verified)
The query `write` returns no results, while `Write` returns the "Write release notes" task. Matching is case-sensitive.

### Expected behavior
A query matches a task title when the query text appears in the title ignoring letter case. For example, `write`, `Write`, and `WRITE` all return "Write release notes".

### Behavior that must remain unchanged
- An empty query returns all tasks in their original order.
- Substring matching semantics are preserved: a non-empty query still matches when it occurs anywhere within the title (just case-insensitively).
- Result ordering continues to follow the input task order.
- The query is not trimmed and no accent normalization is applied: a query of `" write"` (with a leading space) must not match "Write release notes", because that space is part of the query and only case is folded.

## Evidence record

- **EVID-001 — Verified finding.** The filter uses case-sensitive substring matching. The filter function compares the raw title against the raw query with `String.prototype.includes`, which is case-sensitive, so `"Write release notes".includes("write")` is `false`. This is the root cause.
- **EVID-002 — Verified finding.** The filter is the only task-title search path in the browser client. The search input's `input` event drives a re-render that calls the filter; no other case handling is applied before or after.
- **EVID-003 — Verified finding.** The API does not filter titles. The list endpoint returns every item; no query handling exists server-side, confirming the defect is client-side only.
- **EVID-004 — Verified finding.** The CLI helper does not filter; it maps every task to a line with no search logic.
- **EVID-005 — Verified finding.** Existing tests pin the current behavior, including the case-sensitive expectation (a test asserts the lowercase query returns no results) and the empty-query behavior that must be preserved.
  - **Limitation / risk requiring validation:** the case-sensitive test encodes the buggy expectation and will fail after the fix. It must be updated as part of the change (see TASK-002). Not updating it will break the test run.

## Root cause

Verified. The filter compares the raw title against the raw query with a case-sensitive substring check (EVID-001). No case normalization is applied to the query or the title before comparison (EVID-002).

## Proposed change

- **Proposed change (filter function):** normalize only letter case on both operands before the substring check — for example lowercase the title and the query and compare with `includes`. Do not trim the query or apply accent/diacritic normalization; the only transformation permitted is case folding. This preserves substring semantics and the empty-query behavior (an empty string is a substring of any string, so all tasks still pass).
- No API, CLI, markup, or wiring changes are required (EVID-002, EVID-003, EVID-004).

Concerns the change does not touch (no action needed): persistence, authentication, accessibility of the existing markup, performance, deployment.

## Implementation tasks

- **TASK-001 — Make the filter case-insensitive.**
  - Location: the filter function (existing).
  - Change: compare the title and query with matched case (e.g. lowercase both) while keeping substring matching.
  - Prerequisites: none.
  - Serves: REQ-001.
  - Completion condition: a lowercase query such as `write` returns the "Write release notes" task; an empty query still returns all tasks in order.

- **TASK-002 — Update the pinned test to assert case-insensitive behavior.**
  - Location: the existing test that currently asserts case-sensitive filtering.
  - Change: replace the case-sensitive expectation with a case-insensitive one — both `write` and `Write` return the "Write release notes" task. Keep the empty-query test unchanged.
  - Prerequisites: TASK-001.
  - Serves: REQ-001, REQ-002.
  - Completion condition: the test run passes.

## Requirements and traceability

- **REQ-001:** The task filter matches a task title when the query text occurs in the title ignoring letter case.
- **REQ-002:** Pre-existing preserved behavior — an empty query returns all tasks in original order, substring matching is retained, and the query is matched as entered (no trimming, no accent normalization; only case is folded).

| Requirement | Evidence or new behavior | Tasks | Verification |
| --- | --- | --- | --- |
| REQ-001 | EVID-001 root cause; proposed case-normalized `includes` | TASK-001, TASK-002 | `write`, `Write`, and `WRITE` each return the "Write release notes" task |
| REQ-002 | EVID-005 existing empty-query test | TASK-001, TASK-002 | empty query returns all tasks in order; a mid-word substring such as `release` still matches; a leading-space query `" write"` does not match |

## Verification strategy

Run the project's existing test command after both tasks; it should pass once the pinned test is updated (TASK-002). Recommended checks for the implementing agent to run:

- Success: query `write` returns "Write release notes"; queries `Write` and `WRITE` return the same.
- Preserved: empty query returns all tasks in order; `release` (mid-string) still matches; `" write"` (leading space) does not match.
- Regression: run the test suite and confirm all tests pass.

These are recommended checks; no tests were executed as part of preparing this specification.

## Agent handoff

- Read first: this document, then the filter function and its test.
- Order: TASK-001 before TASK-002.
- Constraints to preserve: empty-query-returns-all-in-order and substring matching (REQ-002). Case folding is the only transformation allowed — do not trim the query and do not add accent normalization. Do not add server-side or CLI filtering; both are confirmed out of scope.
- Expected validation: the test suite passes after both tasks.
- Stop conditions / open questions: none blocking. If product later wants accent-insensitive or multi-field search, that is a separate work item and is not authorized here.
- No authority to commit, push, deploy, or start unrelated changes is implied by this specification.
