# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.1] - 2026-09-10

### Added

- Official-effort coverage for DeepSeek V4.1 Flash (`deepseek-flash` /
  `deepseek-v4.1-*`): `low / high / max`, default `high` (sourced from DeepSeek's
  2026-09-10 release notes and Thinking Mode docs). The new canonical
  `deepseek-flash` name was previously unmatched by the table, which keyed only
  on `deepseek-v4`.

## [0.2.0] - 2026-09-09

### Added

- Model search box in the folded selector menu: filters each provider's models by
  name, id, or description while preserving the accordion grouping (matches the
  official model-catalog search direction in dsh 0.1.2).
- Aria labels on the popup menu, search input, and selected effort chips.
- Built-in official reasoning-effort table (`OFFICIAL_EFFORTS`) so the selector
  offers sensible effort choices for named models even when a configured
  relay/gateway model declares no `reasoningEfforts` — the common npm-install case
  where the backend catalog is empty. Expanded and cross-checked against the
  installed pi-ai catalog and vendor API docs (see README): GPT-5.6, gpt-5.2+,
  gpt-5.1, gpt-5/mini/nano, o1/o3/o4, gpt-oss, Grok 4.x, GLM-5.3 / GLM-5.2+,
  DeepSeek-V4, Kimi K3, Qwen3.8, Gemini 3+, Claude 4.6+ adaptive, Gemma 4. Models
  whose vendors expose no real effort ladder (Gemini 2.5 / Claude ≤4.5 / GLM ≤5.1 /
  Kimi K2 / MiniMax / Mistral / Qwen open-source / DeepSeek ≤V3) are deliberately
  excluded so no unsupported ladder is ever surfaced.
- On-open auto-expand of the provider holding the current model, so a fresh open
  is not a fully-collapsed blank list (bounded so it never accumulates during a
  search/test round; manual browse state is preserved).
- Roving arrow-key / Home / End navigation across model rows (mirrors official
  ModelSelect) plus a `✕` clear button on the search field.
- README guide "Customizing reasoning effort for a model": backend-declared
  `reasoningEfforts` win over the built-in table, and users edit them in DSH's
  `settings.yaml` (agent-editable, hot-reloaded).

### Changed

- Reasoning-effort display uses each effort's catalog `name` instead of its raw `id`
  in the composer trigger.
- Provider groups auto-expand while a search query is active so matches stay visible.
- The composer trigger now loads the last-used model on start, removing the
  "Select model" fallback until the menu was first opened (matches official
  ModelSelect's on-available load).
- The `· effort` caption is shown only when an effort is actually pinned, not the
  official default (which read as "already set").
- The search filter is retained across menu opens (was cleared on close) to make
  comparing relays simpler; clear it with `✕` or Escape (Escape clears text first,
  then closes).
- The built-in table dropped kimi-k2, the generic `glm-`, and the separate
  deepseek-v4-pro-0813/flash-0731 entries once they were confirmed not to be
  independent effort ladders (or are subsumed by deepseek-v4).
- Effort handling is a single "auto" rule: a model's configured/backend-declared
  efforts are used when present, and the built-in official table is used only as a
  fallback. A user who configured their own per-model levels keeps them; an
  unconfigured model still receives sensible official choices. No mode switch UI
  is exposed — this one rule is all that is needed.
- Submit path now degrades gracefully: a picked "official" effort the model does
  not genuinely support (e.g. a relay model configured without that level) is
  dropped so the request uses the model's default rather than failing with
  `UNSUPPORTED_REASONING_EFFORT`.

### Removed

- Dead `dsh-vision-router` mirror logic (`isTwin`, `visionGroups`, the collapsed
  `识图镜像（带图会话）` section). Inspecting images now runs through
  `@linxin666/dsh-tool-describe-image`, which creates no mirror groups.

## [0.1.1] - 2026-08-21

### Added

- MIT license file.
- Basic `check` script (`node --check` for `lib/client.js` and `lib/index.js`).
- CI workflow that runs the check script and a manifest test.
- Automated manifest test (`tests/package.test.js`).
- Changelog.

### Changed

- Version bumped from `0.1.0` to `0.1.1`.
- Package description and keywords for the public plugin listing.
- Host entry exports both named (`apply`, `inject`, `name`) and a default export.
- README expanded with install steps, requirements, behavior, and limitations.

### Removed

- Local backup files from the package contents.

## [0.1.0] - 2026-08-20

### Added

- Provider-folded model selector replacing the composer model seat.
- Reasoning-effort controls driven by each model's catalog metadata.
- Height-bounded, internally scrolling popup menu.
- Collapsed `识图镜像（带图会话）` section for vision-router mirror providers.
- DSH semantic theme token usage for light/dark themes.
