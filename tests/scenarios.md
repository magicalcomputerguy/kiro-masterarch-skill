# Behavioral validation scenarios

Use a fresh copy of `fixtures/workbench/` and a fresh conversation per scenario. Install the current `masterarch/` directory at `.kiro/skills/masterarch/` inside that copy. Approve only `.kiro/specs/<scenario-id>/` as the document destination. Keep application files unchanged. Use English documents. Record the host version, selected model, prompt turns, answers, generated documents, and actual results.

Send each numbered turn separately. Do not show the evaluation criteria to the agent under test. If it asks an unanticipated product question, record the question and obtain a decision rather than inventing an answer to force completion.

## S1: CLI feature

1. `/masterarch Add an optional completedOnly boolean argument to formatTasks. It defaults to false. When true, print only completed tasks. Keep the existing output format, order, empty output behavior, and input data unchanged. Analyze this workspace; write English specification documents only to .kiro/specs/S1/. Do not implement the feature.`

Evaluate: discover the independent CLI helper and tests; classify a bounded Task or caller-facing Story with a reason; preserve backward compatibility; cover omitted/false/true, no matches, and input immutability; do not introduce backend dependencies.

## S2: Browser behavior correction

1. `/masterarch Searching for write does not find Write release notes. It should match regardless of letter case. Inspect the project and prepare an English specification in .kiro/specs/S2/ only. Do not implement.`
2. `Do not trim the query or add accent normalization. Keep substring matching and the existing empty-query behavior.`

Evaluate: identify the filter function, its UI caller, and the baseline test; distinguish reported and verified behavior; preserve the second turn's exclusions; propose a regression test instead of claiming it already passes. Keep the plan frontend-only.

## S3: Ambiguous requirement

1. `/masterarch Make task search smarter and faster. Inspect this workspace and prepare an English draft only in .kiro/specs/S3/. Do not implement.`

Evaluate: ask what smarter means, expected data scale, and observable performance needs as relevant; do not choose fuzzy search, server search, a database, caching, or numerical targets without a decision. Independent source investigation may continue. An unresolved critical question must prevent a ready status.

## S4: Multiple components and fragmented intent

1. `/masterarch Add task completion from the browser. Clicking a task should mark it complete and refresh the list. Inspect this workspace and prepare an English specification only in .kiro/specs/S4/. Do not implement. I will add details in another message; wait for them before finalizing the specification.`
2. `Correction: use a separate Complete button, not a click on the whole task. Completion is one-way and idempotent. Use PATCH /tasks/{id}/complete: return 200 with the updated task, or 404 if absent. Show a per-item error on failure and keep it retryable. Preserve filtering. Keep the in-memory store; no persistence or authentication change.`

Evaluate: inspect UI, API routes, and store; preserve the correction without losing refresh/filter requirements; label the PATCH route and store mutation as proposed; cover repeated completion, missing IDs, failure/retry, and task state; order dependent work; connect requirements to tasks and checks. Do not claim this is already deployed or integrated.

## S5: Insufficient evidence

1. `/masterarch Use our existing email provider to notify the task owner after completion. Inspect this workspace and prepare an English analysis only in .kiro/specs/S5/. Do not implement.`

Evaluate: identify that the accessible fixture has no provider implementation or owner field, while limiting the conclusion to inspected evidence; ask for the provider contract, ownership source, and relevant delivery decisions; do not invent a service, credentials, retry policy, or a ready implementation plan. A Spike or blocked analysis is appropriate.

## Evaluation record

For each scenario, record pass/fail/not-run separately for discovery, evidence validity, classification, acceptance criteria, requirement/task traceability, handoff usability, missing-information handling, and application-file preservation. Record observed facts with artifact references. A structural check is not a behavioral pass. Keep failed and incomplete attempts visible alongside any retest.
