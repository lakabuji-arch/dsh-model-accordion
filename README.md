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

## Customizing reasoning effort for a model

DSH persists model/provider configuration in your main `settings.yaml`, and this
plugin reads the same resolved model metadata the backend produces, so
**declared/backend effort configuration always wins over the built-in table**.
The effective priority is:

    model's configured `reasoningEfforts`  >  provider-level default  >  built-in official table

To give a specific model — for one your relay exposes under a name this plugin's
table does not know — your own effort ladder, declare it on that model in
`settings.yaml` and the plugin uses exactly those levels:

    providers:
      my-relay:
        api: openai-completions
        baseURL: https://…
        models:
          - id: my-unknown-model
            api: openai-completions
            contextWindow: 200000
            maxTokens: 32000
            input: [text]
            reasoningEfforts:
              off: null      # optional: lets the user turn thinking off
              low: low
              high: high
              max: max

The exact fields follow `dsh-llm-pi-ai`'s model schema (see that package's
docs); `reasoningEfforts` maps each offered level to its wire spelling, and you
may set a provider-level default with the `reasoning:` key. Because this lives
in your DSH settings file, an agent — or you — can edit it with the file tools
and DSH reloads it on save; the browser never sees your API key or relay URL.

## Behavior and limitations

The selector submits the exact provider, model, and reasoning effort returned by the DSH model directory (configured efforts first, built-in official table as fallback).
- A picked reasoning effort that the model does not support is silently dropped so the request falls back to the model's default (no `UNSUPPORTED_REASONING_EFFORT` error). A relay/gateway model configured without an effort level keeps the model but does not force an unsupported level.
- A selection can still be rejected by the DSH host when the session contains images and the selected model does not declare image input. That is a host/model-capability rule, not a UI override.
- The model search box filters provider lists by name, id, or description while keeping the accordion grouping; a provider group auto-expands while a query is active.
- The built-in official-effort table keys on the model's name/id and is cross-checked against the installed pi-ai catalog and each vendor's API docs. It covers only models whose vendors expose a real effort ladder: GPT-5.6 (full ladder incl. `max`), gpt-5.2+ (`xhigh`), gpt-5.1, gpt-5/mini/nano, o1/o3/o4, gpt-oss, Grok 4.x, GLM-5.3 (`low/high/max`) and GLM-5.2+ (`xhigh/max`), DeepSeek-V4 (`low/high/max`), DeepSeek-V4.1-Flash (`deepseek-flash` / `deepseek-v4.1-*`, `low/high/max`), Kimi K3, Qwen3.8, Gemini 3+ (`low/high`), Claude 4.6+ adaptive, Gemma 4. Families whose native control is not an effort ladder (Gemini 2.5 / Claude ≤4.5 token budgets, GLM ≤5.1 / Kimi K2 / MiniMax / Mistral thinking switches, Qwen open-source, DeepSeek ≤V3) are deliberately excluded. Unmatched models offer only the efforts their configured catalog declares — see "Customizing reasoning effort for a model" to add your own.
- The plugin uses English status and search text; full locale integration is planned for a later release.

## Development checks

```sh
node --check lib/client.js
node --check lib/index.js
npm pack --dry-run --ignore-scripts
```

## License

MIT
