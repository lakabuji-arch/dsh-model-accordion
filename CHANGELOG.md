# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.0] - 2026-09-09

### Added

- Built-in official reasoning-effort table (`OFFICIAL_EFFORTS`) so the selector
  offers sensible effort choices for named models (GPT-5.6 six levels, GLM-5.3 /
  kimi-k3 max/high/low, GLM / deepseek-v4 / kimi-k2 high/max, deepseek-v4-pro-0813 /
  flash-0731 max/high/low, qwen3.8 xhigh/medium/low, grok low/high) even when a
  configured relay/gateway model declares no `reasoningEfforts` — the common
  npm-install case where the backend catalog is empty.

### Changed

- Effort handling is a single "auto" rule: a model's configured/backend-declared
  efforts are used when present, and the built-in official table is used only as
  a fallback. A user who configured their own per-model levels keeps them; an
  unconfigured model still receives sensible official choices. No mode switch UI
  is exposed — this one rule is all that is needed.
- Submit path now degrades gracefully: a picked "official" effort the model does
  not genuinely support (e.g. a relay model configured without that level) is
  dropped so the request uses the model's default rather than failing with
  `UNSUPPORTED_REASONING_EFFORT`.

## [0.2.0] - 2026-09-03

### Added

- Model search box in the folded selector menu: filters each provider's models by
  name, id, or description while preserving the accordion grouping (matches the
  official model-catalog search direction in dsh 0.1.2).
- Aria labels on the popup menu, search input, and selected effort chips.

### Changed

- Reasoning-effort display uses each effort's catalog `name` instead of its raw `id`
  in the composer trigger.
- Provider groups auto-expand while a search query is active so matches stay visible.

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
