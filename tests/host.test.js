import { test } from "node:test";
import assert from "node:assert/strict";
import { apply, inject, name } from "../lib/index.js";

function harness(selection) {
  const calls = [];
  let listener = null;
  const ctx = {
    logger: { warn() {} },
    on(event, fn) {
      assert.equal(event, "agent/request-error");
      listener = fn;
      return () => {};
    },
    effect(fn) {
      return fn();
    }
  };
  const agent = {
    model: {
      current: () => selection,
      select: (next) => calls.push(next)
    }
  };
  apply(ctx);
  assert.ok(typeof listener === "function", "apply installs the request-error listener");
  const next = () => Promise.resolve(undefined);
  return { calls, fire: (failure, turn = 1) => listener({ agent, turn, step: 1, provider: selection?.provider, failure }, next) };
}

test("host entry exports the plugin surface", () => {
  assert.equal(name, "dsh-model-accordion");
  assert.deepEqual(inject, []);
  assert.equal(typeof apply, "function");
});

test("a selection without a pinned effort is never rewritten", async () => {
  const { calls, fire } = harness({ provider: "company", model: "deepseek-flash" });
  const result = await fire({ code: "UNSUPPORTED_REASONING_EFFORT", message: "nope" });
  assert.equal(result, undefined);
  assert.equal(calls.length, 0);
});

test("an effort rejection switches to the provider default and explains itself", async () => {
  const { calls, fire } = harness({ provider: "company", model: "deepseek-flash", reasoningEffort: "max" });
  let thrown;
  try {
    await fire({ code: "UNSUPPORTED_REASONING_EFFORT", message: "unsupported" }, 7);
  } catch (error) {
    thrown = error;
  }
  assert.ok(thrown instanceof Error, "the raw gateway body is replaced by a readable error");
  assert.match(thrown.message, /reasoning effort "max"/);
  assert.match(thrown.message, /provider default/);
  assert.match(thrown.message, /reasoningEfforts declaration/);
  assert.deepEqual(calls, [{ provider: "company", model: "deepseek-flash" }]);

  // The same turn is only repaired once.
  const again = await fire({ code: "UNSUPPORTED_REASONING_EFFORT", message: "unsupported" }, 7);
  assert.equal(again, undefined);
  assert.equal(calls.length, 1);
});

test("a gateway that words the rejection differently is still caught", async () => {
  const { calls, fire } = harness({ provider: "company", model: "deepseek-flash", reasoningEffort: "low" });
  await assert.rejects(async () => fire({ code: "provider/http-400", message: "invalid reasoning effort: low" }, 3), /provider default/);
  assert.equal(calls.length, 1);
});

test("an OpenAI-style rejection that only names the value is still caught", async () => {
  const { calls, fire } = harness({ provider: "company", model: "deepseek-flash", reasoningEffort: "turbo" });
  await assert.rejects(async () => fire({ code: "provider/http-400", message: "Unsupported value: 'turbo' is not supported with this model." }, 5), /provider default/);
  assert.equal(calls.length, 1);
});

test("unrelated request failures stay untouched", async () => {
  const { calls, fire } = harness({ provider: "company", model: "deepseek-flash", reasoningEffort: "low" });
  const result = await fire({ code: "provider/overloaded", message: "server is busy" }, 4);
  assert.equal(result, undefined);
  assert.equal(calls.length, 0);
});
