import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(name) {
  return JSON.parse(readFileSync(join(root, name), "utf8"));
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
  const client = readFileSync(join(root, "lib", "client.js"), "utf8");
  assert.match(client, /window\.__ModuleLoader__\.load/);
  assert.match(client, /conversation\.input\.model/);
});

test("host entry exports apply and name", () => {
  const index = readFileSync(join(root, "lib", "index.js"), "utf8");
  assert.match(index, /export \{[^}]*apply[^}]*\}/);
  assert.match(index, /export \{[^}]*name[^}]*\}/);
});
