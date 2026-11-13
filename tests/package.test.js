import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(name) {
  return JSON.parse(readFileSync(join(root, name), "utf8"));
}

function clientSource() {
  return readFileSync(join(root, "lib", "client.js"), "utf8");
}

function dictionaryKeys(client, name) {
  const start = client.indexOf(`const ${name} = {`);
  assert.ok(start !== -1, `${name} dictionary is declared`);
  const end = client.indexOf("\n    };", start);
  assert.ok(end !== -1, `${name} dictionary is terminated`);
  return [...client.slice(start, end).matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
}

test("package manifest declares a dsh bundle patch", () => {
  const pkg = readJson("package.json");
  assert.equal(pkg.dsh.bundle.patch, "./cordis.patch.yml");
});

test("package manifest declares a web client entry", () => {
  const pkg = readJson("package.json");
  assert.equal(pkg.dsh.client.platform, "web");
  assert.ok(pkg.exports["./client"]);
});

test("cordis patch inserts one bundle row", () => {
  const patch = readFileSync(join(root, "cordis.patch.yml"), "utf8");
  assert.match(patch, /id: ui-model-accordion/);
  assert.match(patch, /name: dsh-model-accordion/);
});

test("client entry loads as a ModuleLoader bundle", () => {
  const client = clientSource();
  assert.match(client, /window\.__ModuleLoader__\.load/);
  assert.match(client, /conversation\.input\.model/);
});

test("host entry exports apply and name", () => {
  const index = readFileSync(join(root, "lib", "index.js"), "utf8");
  assert.match(index, /export \{[^}]*apply[^}]*\}/);
  assert.match(index, /export \{[^}]*name[^}]*\}/);
});

test("client registers its locale namespace and names it on the seat", () => {
  const client = clientSource();
  assert.match(client, /ctx\.locale\.register\(NS, \{ zh, en \}\)/);
  assert.match(client, /locale: NS/);
  assert.match(client, /const inject = \[[^\]]*"locale"/);
});

test("both locales declare the same keys, covering every tr() call", () => {
  const client = clientSource();
  const zh = dictionaryKeys(client, "zh");
  const en = dictionaryKeys(client, "en");
  assert.ok(zh.length >= 20, `zh declares the full key set (got ${zh.length})`);
  assert.deepEqual(en.slice().sort(), zh.slice().sort(), "en mirrors zh key-for-key");
  const used = [...new Set([...client.matchAll(/tr\("([^"]+)"/g)].map((match) => match[1]))];
  assert.ok(used.length > 0, "the component translates its copy");
  for (const key of used) assert.ok(zh.includes(key), `tr("${key}") is declared in the dictionary`);
});

test("seat keeps the priority override and declares the label child seat", () => {
  const client = clientSource();
  assert.match(client, /priority: -1/);
  assert.match(client, /children: \{\s*"conversation\.input\.model\.label": \{ kind: "single", scope: "session", inline: true \}/);
  assert.match(client, /renderSlot\("conversation\.input\.model\.label", \{ provider: group, model, placement, selected \}/);
});

test("popup is portaled and positioned against the viewport", () => {
  const client = clientSource();
  assert.match(client, /ReactDOM\.createPortal\(/);
  assert.match(client, /\.dshma-menu\{[^}]*position:fixed/);
  assert.match(client, /z-index:1100/);
  assert.match(client, /getBoundingClientRect\(\)/);
  assert.match(client, /addEventListener\("scroll", place, true\)/);
});

test("popup uses the DSH menu material so skins keep working", () => {
  const client = clientSource();
  assert.match(client, /"data-menu-material": ""/);
  assert.match(client, /backdrop-filter:var\(--dsw-menu-backdrop-filter/);
  assert.match(client, /background:var\(--dsw-specific-menu\)/);
});

test("selection rides the RemoteResult contract and maps writer-held errors", () => {
  const client = clientSource();
  assert.match(client, /result\.ok/);
  assert.match(client, /result\.error/);
  assert.match(client, /session\/writer-held/);
  assert.match(client, /error\.sessionInUse/);
});

test("store state consumed by the 0.2.x directory: pending, failures, retainedEffort", () => {
  const client = clientSource();
  assert.match(client, /state\.pending/);
  assert.match(client, /state\.failures/);
  assert.match(client, /state\.retainedEffort/);
  assert.match(client, /reasoningEffort/);
});

test("directory load is invoked once per mount, not on every render", () => {
  const client = clientSource();
  assert.match(client, /loadedOnce\.current/);
  assert.match(client, /\[available, load\]/);
  assert.doesNotMatch(client, /\[props\.available, props\.load\]/);
});

test("provider order matches the official pickers", () => {
  const client = clientSource();
  assert.match(client, /group\.id === "deepseek-account" \? 0 : group\.id === "deepseek-official" \? 1 : 2/);
});
