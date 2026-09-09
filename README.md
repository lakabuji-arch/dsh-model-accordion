# dsh-model-accordion

Provider-folded model selector for the DeepSeek Harness Web composer.

## What it does

- Replaces the single composer model seat with a provider-folded selector.
- Keeps provider groups collapsed by default and opens models on demand.
- Reads reasoning-effort choices from each model's resolved catalog metadata, with a built-in official-effort table as a fallback. A single automatic rule applies: a model with configured/backend-declared efforts uses them, and an unconfigured model falls back to the built-in official table. A user who configured their own levels keeps them; no per-model effort configuration is needed for the official fallback to work.
- Sends model and reasoning-effort selections through DSH's shared model-directory service; a picked effort the model does not genuinely support is dropped so the request uses the model's default instead of failing with `UNSUPPORTED_REASONING_EFFORT`.
- Keeps the popup height-bounded with an internal scroll area and wraps effort controls below the model name.
- Uses DSH semantic theme tokens for colors and supports light/dark theme changes.

## Requirements

- DeepSeek Harness Web `0.1.0-rc.8` or newer.
- A Web profile with the official model-selection package and model-directory service.
- React 18 supplied by the DSH Web runtime.

This is a Web UI plugin. It does not add a Host service, model provider, vision backend, or model catalog. Provider availability and image-session admission remain controlled by DSH and any installed provider/vision plugins.

## Install from a package or repository

```sh
dsh plugin --profile web add dsh-model-accordion
```

For a local checkout during development:

```sh
dsh plugin --profile web add file:/absolute/path/to/dsh-model-accordion
```

Refresh the Web UI after installation. The package declares a `dsh.bundle` patch and a Web client entry, so it is installed and loaded as a persistent profile bundle rather than a temporary runtime extension.

## Behavior and limitations

- The selector submits the exact provider, model, and reasoning effort returned by the DSH model directory (configured efforts first, built-in official table as fallback).
- A picked reasoning effort that the model does not support is silently dropped so the request falls back to the model's default (no `UNSUPPORTED_REASONING_EFFORT` error). A relay/gateway model configured without an effort level keeps the model but does not force an unsupported level.
- A selection can still be rejected by the DSH host when the session contains images and the selected model does not declare image input. That is a host/model-capability rule, not a UI override.
- The model search box filters provider lists by name, id, or description while keeping the accordion grouping; a provider group auto-expands while a query is active.
- The built-in official-effort table keys on the model's name/id and reflects each vendor's public API docs (GPT-5.6 six levels, GLM-5.3 / kimi-k3 max/high/low, GLM / deepseek-v4 / kimi-k2 high/max, deepseek-v4-pro-0813 / flash-0731 max/high/low, qwen3.8 xhigh/medium/low, grok low/high). Unmatched models offer only the efforts their configured catalog declares.
- The plugin uses English status and search text; full locale integration is planned for a later release.

## Development checks

```sh
node --check lib/client.js
node --check lib/index.js
npm pack --dry-run --ignore-scripts
```

## License

MIT
