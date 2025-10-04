# Review: `agent_creator.py`

## Summary
- The current pipeline runs end-to-end but has a few defensive gaps that can surface as soon as you plug in alternative planners/tools.
- Tighten timeout handling and planner fallbacks so the agent can degrade gracefully instead of crashing.
- Clarify a couple of policy/evaluation behaviours to make them safer and easier to maintain.

## Findings & Recommendations

### 1. Missing guard when the planner returns no tasks *(correctness, medium)*
`Agent.run_goal` assumes that `Planner.plan` always returns at least one task. If a custom planner decides to skip execution (e.g. no-op goals, or failure to assemble a DAG), the final call to `self.evaluator.check(tasks[-1], summary, goal)` will raise an `IndexError`. Add a guard to short-circuit when `tasks` is empty and return an explicit failure summary instead of crashing.

### 2. Timeout exits without updating remaining tasks *(reliability, medium)*
When the runtime exceeds `policy.max_runtime_s`, the loop breaks immediately. Any remaining tasks keep their default `pending` status and no log entries are emitted, leaving downstream diagnostics without context. After emitting the timeout event, mark the unfinished tasks as `skipped` (or a dedicated `timeout` status) and persist a log entry per task so that orchestrators can reason about the partial execution.

### 3. Policy checks do not cover tool/network permissions *(safety, medium)*
`Policy.check` only inspects the optional `category` and the token budget, yet the policy object advertises knobs such as `allow_network`. As soon as you register a tool that requires network access, the policy layer should enforce that constraint (e.g. block tools flagged as networked when `allow_network` is `False`). Consider extending the policy interface to receive the `Tool` metadata (or annotate `Task`/`context`) so the agent will refuse disallowed operations consistently.

### 4. Evaluator criteria rely on string containment *(maintainability, low)*
The evaluator flattens the entire `summary` object into JSON and uses substring checks for rules that start with `contains:`. This is brittle (case sensitivity aside) and may pass even if the structure is wrong—for example, a value of `"not_artifact_type"` satisfies `contains:artifact_type`. Replace this with structured checks (e.g. look up keys inside `summary["artifacts"]`) to avoid false positives.

## Nice-to-haves
- Remove the unused `mime` local in `Policy.check` or implement the intended MIME filtering.
- Promote the string literals for task statuses (`"pending"`, `"running"`, …) to an `Enum` so you avoid typos when the surface expands.
