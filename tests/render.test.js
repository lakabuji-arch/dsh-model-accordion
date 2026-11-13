import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = readFileSync(join(root, "lib", "client.js"), "utf8");

// The plugin ships as a pre-built ModuleLoader bundle, so the tests execute that
// bundle against a tiny hook runtime instead of a DOM renderer: enough to catch
// component-body crashes, wrong prop/store handling, and lost wiring.
function createReact() {
  const runtime = { cursor: 0, overrides: new Map() };
  const api = {
    createElement(type, props, ...children) {
      return { type, props: props === null || props === undefined ? {} : props, children };
    },
    useState(initial) {
      const index = runtime.cursor;
      runtime.cursor += 1;
      const value = runtime.overrides.has(index) ? runtime.overrides.get(index) : initial;
      return [value, () => {}];
    },
    useEffect() {},
    useLayoutEffect() {},
    useMemo(factory) {
      return factory();
    },
    useRef(initial) {
      return { current: initial };
    },
    useSyncExternalStore(subscribe, getSnapshot) {
      return getSnapshot();
    }
  };
  return {
    api,
    begin(overrides) {
      runtime.cursor = 0;
      runtime.overrides = new Map(Object.entries(overrides === undefined ? {} : overrides).map(([key, value]) => [Number(key), value]));
    }
  };
}

function installDocument() {
  globalThis.document = {
    querySelector() { return null; },
    createElement() { return { setAttribute() {}, textContent: "", remove() {} }; },
    head: { appendChild() {} },
    body: { nodeType: 1 }
  };
}

function applyWith(snapshot, options = {}) {
  installDocument();
  const react = createReact();
  let spec = null;
  const windowStub = { __ModuleLoader__: { load(next) { spec = next; } } };
  new Function("window", source)(windowStub);
  assert.ok(spec !== null, "the bundle registers through ModuleLoader");
  const exports = spec.factory((id) => {
    if (id === "react") return react.api;
    if (id === "react-dom") return { createPortal(node) { return node; } };
    throw new Error(`unexpected module: ${id}`);
  });

  const registered = { effects: [], locale: null, slot: null, slotName: null };
  const ctx = {
    effect(fn, label) {
      registered.effects.push(label);
      const dispose = fn();
      return typeof dispose === "function" ? dispose : () => {};
    },
    locale: {
      register(namespace, dictionaries) {
        registered.locale = { namespace, dictionaries };
        return () => {};
      }
    },
    slots: {
      inject(name, factory) {
        registered.slotName = name;
        factory();
      },
      register(nextSpec, component) {
        registered.slot = { spec: nextSpec, component };
        return () => {};
      }
    },
    modelDirectories: {
      directoryFor() {
        if (options.directoryThrows === true) throw new Error("resolver exploded");
        return {
          store: { subscribe() {}, getSnapshot() { return snapshot; } },
          load: async () => {},
          select: async () => ({ ok: true })
        };
      }
    },
    sessions: { subagentAddress() { return undefined; } }
  };
  exports.apply(ctx);
  assert.ok(registered.slot !== null, "apply registers the composer seat");
  return { component: registered.slot.component, registered, react };
}

function render(snapshot, options = {}) {
  const { component, registered, react } = applyWith(snapshot);
  const directory = { subscribe() {}, getSnapshot() { return snapshot; } };
  react.begin(options.overrides);
  const tree = component({
    directory,
    load() {},
    select: () => Promise.resolve({ ok: true }),
    t: options.t,
    renderSlot: options.renderSlot,
    locked: options.locked === true,
    available: options.available !== false
  });
  return { tree, registered };
}

function textOf(node, out = []) {
  if (node === null || node === undefined || node === false || node === true) return out;
  if (typeof node === "string" || typeof node === "number") {
    out.push(String(node));
    return out;
  }
  if (Array.isArray(node)) {
    for (const child of node) textOf(child, out);
    return out;
  }
  if (typeof node === "object") textOf(node.children, out);
  return out;
}

function textOfTree(node) {
  return textOf(node).join("\n");
}

function elements(node, predicate, out = []) {
  if (node === null || node === undefined || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    for (const child of node) elements(child, predicate, out);
    return out;
  }
  // Expand the pure presentational components (Chevron, Spinner) the way React would.
  if (typeof node.type === "function") return elements(node.type(node.props), predicate, out);
  if (predicate(node)) out.push(node);
  elements(node.children, predicate, out);
  return out;
}

function baseSnapshot(overrides = {}) {
  return {
    current: null,
    retainedEffort: undefined,
    routable: true,
    groups: [
      { id: "deepseek-account", name: "DeepSeek", models: [{ id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" }] },
      {
        id: "relay",
        name: "Relay",
        models: [
          { id: "gpt-5", name: "GPT-5" },
          { id: "claude", name: "Claude", description: "Anthropic relay" }
        ]
      }
    ],
    failures: [],
    status: "ready",
    pending: null,
    error: null,
    ...overrides
  };
}

const OPEN = 0;
const PANE = 1;
const QUERY = 2;
const EXPANDED = 3;

test("closed seat renders the trigger only", () => {
  const { tree } = render(baseSnapshot());
  const rendered = textOfTree(tree);
  assert.match(rendered, /Select model/);
  assert.doesNotMatch(rendered, /Relay/);
  assert.equal(elements(tree, (node) => node.props.className === "dshma-menu").length, 0);
});

test("an open seat lists providers with their groups collapsed", () => {
  const { tree } = render(baseSnapshot(), { overrides: { [OPEN]: true } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /DeepSeek/);
  assert.match(rendered, /Relay/);
  assert.doesNotMatch(rendered, /GPT-5/);
  assert.doesNotMatch(rendered, /DeepSeek-V4\.1-Flash/);
  assert.equal(elements(tree, (node) => node.props.role === "menuitemradio").length, 0);
  const menu = elements(tree, (node) => node.props.className === "dshma-menu")[0];
  assert.equal(menu.props["data-menu-material"], "");
});

test("an expanded provider exposes its model rows", () => {
  const { tree } = render(baseSnapshot(), { overrides: { [OPEN]: true, [EXPANDED]: { relay: true } } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /GPT-5/);
  assert.match(rendered, /Claude/);
  assert.doesNotMatch(rendered, /DeepSeek-V4\.1-Flash/);
  const rows = elements(tree, (node) => node.props.role === "menuitemradio");
  assert.equal(rows.length, 2);
});

test("the search field filters models and expands matching providers", () => {
  const snapshot = baseSnapshot({
    groups: [
      {
        id: "deepseek-account",
        name: "DeepSeek",
        models: [
          { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" },
          { id: "deepseek-pro", name: "DeepSeek-V4.1-Pro" },
          { id: "deepseek-chat", name: "DeepSeek Chat" }
        ]
      },
      {
        id: "relay",
        name: "Relay",
        models: [
          { id: "gpt-5", name: "GPT-5" },
          { id: "claude", name: "Claude", description: "Anthropic relay" }
        ]
      }
    ]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [QUERY]: "gpt" } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /GPT-5/);
  assert.doesNotMatch(rendered, /Claude/);
  assert.doesNotMatch(rendered, /DeepSeek-V4\.1-Flash/);
});

test("search only matches model names, not descriptions", () => {
  const snapshot = baseSnapshot({
    groups: [{
      id: "relay",
      name: "Relay",
      models: [
        { id: "deepseek-v4-pro", name: "DeepSeek-V4-Pro", description: "large unit data engine" },
        { id: "claude-opus-5", name: "Claude Opus 5" }
      ]
    }]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [QUERY]: "laude" } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /Claude Opus 5/);
  assert.doesNotMatch(rendered, /DeepSeek-V4-Pro/);
});

test("the label child seat is rendered through renderSlot", () => {
  const calls = [];
  const { tree } = render(baseSnapshot({ current: { provider: "relay", model: "gpt-5" } }), {
    overrides: { [OPEN]: true, [EXPANDED]: { relay: true } },
    renderSlot(name, params) {
      calls.push({ name, provider: params.provider, model: params.model, placement: params.placement });
      return `DECORATED:${params.placement}`;
    }
  });
  const rendered = textOfTree(tree);
  assert.match(rendered, /DECORATED:trigger/);
  assert.match(rendered, /DECORATED:option/);
  assert.ok(calls.length >= 3, "trigger and every visible row render the label seat");
  for (const call of calls) assert.equal(call.name, "conversation.input.model.label");
  assert.ok(calls.some((call) => call.placement === "trigger" && call.provider.id === "relay" && call.model.id === "gpt-5"));
});

test("reasoning effort shows on the trigger and in the model rows", () => {
  const model = {
    id: "gpt-5",
    name: "GPT-5",
    reasoning: {
      defaultEffort: "medium",
      efforts: [{ id: "low", name: "Low" }, { id: "medium", name: "Medium" }, { id: "high", name: "High" }]
    }
  };
  const snapshot = baseSnapshot({
    current: { provider: "relay", model: "gpt-5", reasoningEffort: "high" },
    groups: [
      { id: "deepseek-account", name: "DeepSeek", models: [{ id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" }] },
      { id: "relay", name: "Relay", models: [model] }
    ]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [EXPANDED]: { relay: true } } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /High/);
  assert.match(rendered, /Effort/);
});

test("the effort pane lists the current model's levels", () => {
  const model = {
    id: "gpt-5",
    name: "GPT-5",
    reasoning: {
      defaultEffort: "medium",
      efforts: [{ id: "low", name: "Low" }, { id: "medium", name: "Medium" }, { id: "high", name: "High" }]
    }
  };
  const snapshot = baseSnapshot({
    current: { provider: "relay", model: "gpt-5", reasoningEffort: "high" },
    groups: [{ id: "relay", name: "Relay", models: [model] }]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [PANE]: "effort" } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /Low/);
  assert.match(rendered, /Medium/);
  assert.match(rendered, /High/);
  assert.match(rendered, /Back/);
  const levels = elements(tree, (node) => node.props.role === "menuitemradio");
  assert.equal(levels.length, 3);
  assert.equal(levels.filter((node) => node.props["aria-checked"] === true).length, 1);
});

test("provider load failures and catalog errors surface with a retry", () => {
  const { tree } = render(baseSnapshot({
    failures: [{ id: "relay", name: "Relay", message: "boom" }],
    error: "nope"
  }), { overrides: { [OPEN]: true } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /Relay failed to load: boom/);
  assert.match(rendered, /Model operation failed: nope/);
  assert.equal(elements(tree, (node) => node.props.className === "dshma-retry").length, 2);
});

test("pending selection marks the trigger busy and swaps the chevron for a spinner", () => {
  const { tree } = render(baseSnapshot({ pending: { provider: "relay", model: "gpt-5" } }), { overrides: { [OPEN]: true } });
  const trigger = elements(tree, (node) => node.props.className === "dshma-trigger")[0];
  assert.equal(trigger.props["aria-busy"], true);
  assert.equal(elements(tree, (node) => node.props.className === "dshma-spinner").length, 1);
});

test("a locked composer disables the trigger and an unavailable seat renders nothing", () => {
  const locked = render(baseSnapshot(), { locked: true });
  const trigger = elements(locked.tree, (node) => node.props.className === "dshma-trigger")[0];
  assert.equal(trigger.props.disabled, true);

  const unavailable = render(baseSnapshot(), { available: false });
  assert.equal(unavailable.tree, null);
});

test("direction: catalog badges render around the model name", () => {
  const snapshot = baseSnapshot({
    groups: [{
      id: "relay",
      name: "Relay",
      models: [{ id: "gpt-5", name: "GPT-5", badge: { tone: "info", text: "beta" } }]
    }]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [EXPANDED]: { relay: true } } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /beta/);
  assert.match(rendered, /GPT-5/);
  assert.equal(elements(tree, (node) => node.props.className === "dshma-badge").length >= 1, true);
});

test("a pinned effort the catalog dropped falls back to a declared level", () => {
  const model = {
    id: "gpt-5",
    name: "GPT-5",
    reasoning: {
      defaultEffort: "high",
      efforts: [{ id: "low", name: "Low" }, { id: "high", name: "High" }]
    }
  };
  const snapshot = baseSnapshot({
    current: { provider: "relay", model: "gpt-5", reasoningEffort: "medium" },
    groups: [{ id: "relay", name: "Relay", models: [model] }]
  });
  const { tree } = render(snapshot, { overrides: { [OPEN]: true, [PANE]: "effort" } });
  const rendered = textOfTree(tree);
  assert.match(rendered, /High/);
  assert.doesNotMatch(rendered, /medium/);
  const levels = elements(tree, (node) => node.props.role === "menuitemradio");
  assert.equal(levels.filter((node) => node.props["aria-checked"] === true).length, 1);
});

test("a directory failure is tagged and rethrown so the host can fall back", () => {
  const logs = [];
  const original = console.error;
  console.error = (...args) => { logs.push(args); };
  try {
    const { registered } = applyWith(baseSnapshot(), { directoryThrows: true });
    assert.throws(() => registered.slot.spec.inject("session-1"), /resolver exploded/);
    assert.equal(logs.length, 1);
    assert.match(String(logs[0][0]), /dsh-model-accordion: model directory unavailable/);
  } finally {
    console.error = original;
  }
});

test("host translations win over the built-in dictionary", () => {
  const { tree } = render(baseSnapshot(), { t: (key) => `T:${key}` });
  assert.match(textOfTree(tree), /T:trigger\.fallback/);
});

test("apply wires the seat, the dictionaries and the label child seat", () => {
  const { registered } = render(baseSnapshot());
  assert.equal(registered.slotName, "conversation.input.model");
  assert.equal(registered.slot.spec.name, "conversation.input.model");
  assert.equal(registered.slot.spec.priority, -1);
  assert.equal(registered.slot.spec.locale, "model-accordion");
  assert.deepEqual(registered.slot.spec.children, {
    "conversation.input.model.label": { kind: "single", scope: "session", inline: true }
  });
  assert.equal(registered.locale.namespace, "model-accordion");
  assert.equal(registered.locale.dictionaries.zh["menu.effort"], "推理等级");
  assert.equal(registered.locale.dictionaries.en["menu.effort"], "Effort");
  assert.ok(typeof registered.slot.spec.inject === "function");
});
