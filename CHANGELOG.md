# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.4.0] - 2026-11-13

Rewritten against the `0.2.x` seat contract (verified against the desktop runtime bundle
`@deepseek-ai/dsh-client-ui-model-selection@0.2.2-rc.1`; the earlier `0.2.1-rc.2` shape was read
first and is still covered). Follows the unreleased `0.3.0`; npm's previous release was `0.2.1`.
Stays on `0.x` because the plugin's compatibility contract is the DSH seat, and DSH itself is
`0.x`.

### Added

- Reasoning-effort support, driven only by the catalog: the trigger and each model row show the
  active level, an effort cell drills into the levels the current model declares, and a pick
  submits `{ provider, model, reasoningEffort }` with the model's default effort. No client-owned
  effort table is shipped, so an undeclared level is never offered.
- `conversation.input.model.label` child seat: the registration declares it and the trigger, rows
  and effort pane render it through `renderSlot()`, so the official `1017` badge and any other
  label decorator survive.
- Popup portaled to `document.body`, fixed-positioned above the trigger and clamped to the
  viewport, re-placed on scroll, resize and menu-size changes.
- Per-provider directory `failures` with a retry action and the catalog `error` strip; a
  `session/writer-held` rejection maps to the dedicated "session already in use" copy.
- Spinner while a selection is `pending`, plus `aria-busy`, `aria-checked`, `role="menuitemradio"`
  and `aria-controls` on the seat.
- Unsupported efforts degrade instead of failing: a pinned level the catalog no longer declares is
  repaired once to the model default (then the first declared level), and a selection the host
  rejects with `UNSUPPORTED_REASONING_EFFORT` is retried once with that fallback.
- Host half now recovers an upstream effort rejection: on `agent/request-error` (the loop's
  recovery waterfall) it drops the pinned effort to the provider default for the same
  provider/model and replaces the raw gateway body with an actionable error naming the
  `reasoningEfforts` declaration that needs fixing. The turn is **not** resent automatically:
  the loop retries with the selection frozen when the step started, and the `agent/request`
  waterfall refuses to change it, so a mid-turn effort switch could never reach the wire.
  The client seat notices the selection change and shows the same notice.
- A directory-resolver failure inside the seat factory is tagged
  (`dsh-model-accordion: model directory unavailable …`) and rethrown, keeping the slot host's
  fallback to the official picker while making a vanished seat searchable in the console. The seat
  also declares `remote` / `remote.session` as inject dependencies, which is the access a resolver
  touching the caller context would need.
- Provider order matching the official pickers: `deepseek-account`, `deepseek-official`, then
  catalog order.
- `0.2.2` catalog parity: a model's `badge` (`{ tone, text }`) renders before the name on the
  trigger and after it in the menu, and its text goes through the host `resolveText` when the seat
  provides one.

### Changed

- README documents where effort levels come from and how to map a gateway level DSH has no name for
  (`max: ultra`, `off: none`), including the failure mode of an invalid key (the whole `llm-pi-ai`
  provider block fails schema validation and every provider disappears from the picker).
- Selection submits `{ provider, model, reasoningEffort? }` and still honours the raw
  `RemoteResult` (`result.ok` / `result.error`) of the seat face.
- Search stays available at every catalog size (the `0.2.x` behaviour, not the official >4 threshold)
  and ranks by ordered-subsequence match on the model name only; descriptions and ids no longer
  drag unrelated models into the list (searching "laude" used to surface a DeepSeek entry through
  its description).
- Menu structure rebuilt: an effort cell sits above the folded provider list, and the effort pane
  returns to the model list with Escape or the back row.
- Locale dictionary grown to cover the whole surface (provider name, effort, failures, retry,
  aria labels) in `zh` and `en`.

### Fixed

- Initial directory load re-ran on every render whenever the host rebuilt `load` (one catalog
  refetch per keystroke in the search box); it now runs once per mount, guarded by a ref.
- The model label bypassed the label child seat, which dropped the official `1017` badge and any
  other decoration.
- The absolute-positioned menu could be clipped by composer overflow; it is portaled now.
- The menu painted only the translucent fill token, with no DSH menu material behind it, so it read
  as a washed-out see-through panel. It now carries `data-menu-material` and the
  `--dsw-menu-backdrop-filter` blur, matching the official menus and following any skin that
  overrides those tokens.

## [0.3.0] - 2026-09-22

### Changed

- Reasoning-effort machinery removed: selection now submits only `{ provider, model }`. DSH's official catalogs already declare each model's effort levels, so the plugin no longer overrides the official styles with its own effort chips or `· effort` captions.
- Selection now honours the raw `RemoteResult` contract of the slot face: the seat checks `result.ok` and surfaces `result.error` instead of coercing a rejection to `false`.

### Removed

- Built-in official-effort table and its helpers (`officialEffortsFor`, `resolveEfforts`, `resolveDefaultEffort`, `effortSupported`, `effortOptions`, `effortName`), effort CSS, effort chips, and the `· effort` caption on the trigger.
- `reasoning-effort` keyword from the package manifest, and the matching README sections.

## [0.2.2] - 2026-09-20

### Added

- Own locale dictionary (`model-accordion` namespace: `zh` + `en`) registered on
  the client locale service, and named on the seat's slot registration so the slot
  host binds the component's translator. Every user-visible string (trigger
  fallback, search placeholder/aria, status, empty states, error, default-effort
  chip, blocked reason) now resolves through it, with the previous English copy as
  the built-in fallback when `t` is absent.
- Explicit composer-block explanation: the seat reports the reason when the
  conversation locks it, instead of only greying out.

### Changed

- Availability now also reads the directory's `routable` flag (`state.routable ===
  false`), so a selection the backend would reject is refused up front even before
  the host's `locked` signal arrives.
- Verified against dsh `0.1.6-alpha.2`: the seat contract this plugin shadows
  (`conversation.input.model` single slot, `priority: -1`, `slots.inject` /
  `slots.register`, `modelDirectories.directoryFor(...).store/load/select`,
  `sessions.subagentAddress`, store `current`/`groups`/`routable`/`status`) is
  unchanged from the 0.1.2-era API it was written against.

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
