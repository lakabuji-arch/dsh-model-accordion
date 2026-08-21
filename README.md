# dsh-model-accordion

Provider-folded model selector for the DeepSeek Harness Web composer.

## What it does

- Replaces the single composer model seat with a provider-folded selector.
- Keeps provider groups collapsed by default and opens models on demand.
- Reads reasoning-effort choices from each model's resolved catalog metadata instead of maintaining a hard-coded effort list.
- Sends model and reasoning-effort selections through DSH's shared model-directory service.
- Wraps vision-router mirror providers in one collapsed `识图镜像（带图会话）` section when those providers are present.
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

- The selector submits the exact provider, model, and catalog-declared reasoning effort returned by the DSH model directory.
- A selection can still be rejected by the DSH host when the session contains images and the selected model does not declare image input. That is a host/model-capability rule, not a UI override.
- The optional `识图镜像（带图会话）` section is shown when provider names identify vision-router mirror routes. It is kept collapsed to avoid duplicating every provider in the main list.
- The plugin currently uses English fallback status text and a Chinese label for the vision-mirror section; full locale integration is planned for a later release.

## Development checks

```sh
node --check lib/client.js
node --check lib/index.js
npm pack --dry-run --ignore-scripts
```

## License

MIT
