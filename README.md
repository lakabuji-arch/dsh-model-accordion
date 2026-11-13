# dsh-model-accordion

Provider-folded model selector for the DeepSeek Harness (dsh) Web composer.

## What it does

- Replaces the composer model seat (`conversation.input.model`) with a provider-folded selector:
  provider groups stay collapsed until opened, and the provider holding the current model opens
  on a fresh menu.
- Keeps the `0.2.1` seat contract: same seat name, same `inject` face
  (`available` / `directory` / `load` / `select`), same raw `RemoteResult` handling.
- **Reasoning effort.** Picking a model submits its catalog-declared default effort; the trigger
  and every model row show the active level; a cell in the menu drills into the levels the model
  actually declares. There is no client-owned effort table, so an undeclared level is never offered.
- **Label child seat.** The seat declares `conversation.input.model.label` and renders it through
  `renderSlot()`, so the official `1017` badge — and any other plugin that decorates model names —
  keeps working instead of being bypassed.
- The popup is portaled to `document.body` and positioned with fixed coordinates clamped to the
  viewport, so composer overflow cannot clip it; it follows page scroll and resize.
- Directory `failures` are listed per provider with a retry action, and the catalog error is shown
  as `模型操作失败：…`; a `session/writer-held` rejection gets the dedicated "session already in use"
  message instead of a raw error.
- Search is available at every catalog size (the `0.2.x` behaviour) and ranks by ordered-subsequence
  match on the model **name** only — descriptions and ids are excluded so prose cannot drag
  unrelated models into the result list.
- Uses DSH semantic theme tokens (light/dark) and a built-in `model-accordion` locale dictionary
  (`zh` + `en`) registered on the client locale service and named on the seat.
- Honours a catalog model's `badge` (`{ tone, text }`) the way the official seat does — before the
  name on the trigger, after it in the menu — and localizes its text through `resolveText` when the
  seat injects one.

## Requirements

- DeepSeek Harness Web `0.2.x` (verified against `0.2.2-rc.1`; the seat shape is unchanged from
  `0.2.1-rc.2`).
- A Web profile with the official model-selection package and model-directory service.
- React 18 supplied by the DSH Web runtime.

This is a Web UI plugin. It does not add a Host service, model provider, vision backend, or model
catalog. Provider availability and image-session admission remain controlled by DSH and any
installed provider/vision plugins.

## Install from a package or repository

```sh
dsh plugin --profile web add dsh-model-accordion
```

For a local checkout during development:

```sh
dsh plugin --profile web add file:/absolute/path/to/dsh-model-accordion
```

Refresh the Web UI after installation. The package declares a `dsh.bundle` patch and a Web client
entry, so it is installed and loaded as a persistent profile bundle rather than a temporary runtime
extension.

## Configuring reasoning levels

The selector never invents levels: it renders exactly what the model's catalog entry declares, and
that declaration lives in the **DSH profile config**, not in this plugin.

For `llm-pi-ai` (relay / custom) models the declaration is `reasoningEfforts` in the profile patch:

```yaml
- id: llm-pi-ai
  config:
    providers:
      company:
        models:
          - id: deepseek-flash
            reasoningEfforts:
              low: low
              high: high
              max: ultra        # key = DSH level, value = wire value sent upstream
```

Rules:

- The **key** must be one of DSH's thinking levels: `off`, `minimal`, `low`, `medium`, `high`,
  `xhigh`, `max`. Any other key fails the whole `llm-pi-ai` schema validation, and **every provider
  under that plugin disappears from the picker** (a `turbo:` key does exactly that).
- The **value** is the string sent upstream and may be anything the gateway accepts — including a
  level DSH has no name for. `max: ultra` shows **Max** in the picker and sends `ultra`.
- Mapping works the other way too: `off: none` turns DSH's **Off** into the gateway's `none`.
- A level you omit is pinned to *unsupported* (pi-ai receives `null`), so the picker will not offer
  it; `reasoningEfforts: false` declares a non-reasoning model.
- The default shown by the picker comes from the adapter's `defaultEffort`. When the adapter declares
  none, the picker shows `Default` and the request carries no effort (the provider decides).

### 中文说明

选择器里的挡位**不是插件写死的**，而是读 DSH 配置里模型声明的 `reasoningEfforts`：

- **键**必须是 DSH 认识的七个之一：`off / minimal / low / medium / high / xhigh / max`。
  写成别的（比如 `turbo`）会让整个 `llm-pi-ai` 配置校验失败，**该插件下所有 provider 会一起消失**。
- **值**是真正发给上游的字符串，随便写。上游有、DSH 没有的挡位就用「映射」：
  `max: ultra` —— UI 上显示 **Max**，实际发 `ultra`。
- 反过来也行：`off: none` —— UI 上的 **Off** 发 `none`。
- 没写的挡位会被标成「不支持」，选择器不会显示；`reasoningEfforts: false` 表示这个模型不支持推理。
- 默认挡位来自适配器的 `defaultEffort`；适配器没声明时显示 `Default`，请求里不带挡位（由网关决定）。

## Behavior and limitations

- The seat registers with `priority: -1` so it sits in front of the official picker instead of
  rendering next to it.
- The seat factory declares `remote` / `remote.session` next to the services it uses, and a
  directory-resolver failure is tagged (`dsh-model-accordion: model directory unavailable …`) before
  it is rethrown, so the slot host still falls back to the official picker while the console keeps a
  searchable reason instead of a bare "slot entry crashed".
- A subagent-addressed session renders nothing (the official seat does the same); a locked composer
  disables the trigger.
- Selection rejections render as an in-menu strip rather than the shared composer toast, so the
  plugin stays dependency-free on DSH UI primitives.
- Effort is only offered where the catalog declares it: a relay model without `reasoning` metadata
  shows no effort control, and the request keeps the provider default (shown as `Default`).
- An effort the model no longer declares is never sent blindly: the seat shows — and once
  re-selects — the model default (falling back to the first declared level), and a selection the
  host rejects with `UNSUPPORTED_REASONING_EFFORT` is retried once with that fallback.
- If the **upstream** rejects the effort (the catalog declaration is a client-side promise, not a
  gateway guarantee), the host half hooks `agent/request-error`, drops the pinned effort to the
  provider default for the same provider/model, and replaces the raw gateway body with an error
  that says what happened and which `reasoningEfforts` declaration to fix; the seat shows the same
  notice. The turn is not resent on its own: the loop retries with the selection frozen at step
  start, so a mid-turn switch cannot reach the wire — resend the message after the switch.
- Search input is retained across menu opens; clearing it collapses the accordion back to the
  provider holding the current model.

## Development checks

```sh
node --check lib/client.js
node --check lib/index.js
node --test tests/package.test.js tests/render.test.js
npm pack --dry-run --ignore-scripts
```

`tests/render.test.js` executes the shipped bundle against a small hook runtime, so the component
body, store handling, child-seat rendering and menu structure are covered without a browser.

## License

MIT
