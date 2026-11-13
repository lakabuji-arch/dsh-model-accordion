/**
 * Host half of dsh-model-accordion.
 *
 * The client seat declares effort levels from the catalog, but the catalog is a
 * DSH-client declaration, not necessarily what the upstream gateway accepts. When
 * a request is rejected because of the reasoning effort, the loop offers plugins
 * the `agent/request-error` recovery waterfall: drop the unpinned effort back to
 * the provider default, change the session selection, and let the loop re-issue
 * the same request once. The client seat observes the resulting selection change
 * and tells the user which declaration to fix.
 */

const name = "dsh-model-accordion";

/** No services are required: the waterfall is a plain event. */
const inject = [];

/** "unsupported reasoning effort" in either order, as gateways word it. */
const EFFORT_REJECTION = /(reasoning|effort|thinking)[\s\S]{0,48}(unsupport|not support|invalid|unknown|unrecognized|illegal)|(unsupport|not support|invalid|unknown|unrecognized|illegal)[\s\S]{0,48}(reasoning|effort|thinking)/i;

/** Flatten a request failure into "CODE message" for matching. */
function failureText(failure) {
  if (failure === null || typeof failure !== "object") return "";
  const code = typeof failure.code === "string" ? failure.code : "";
  const message = typeof failure.message === "string" ? failure.message : "";
  return `${code} ${message}`;
}

/**
 * Whether this failure is about the reasoning effort, for a selection that actually pins one.
 * A model running on the provider default (no `reasoningEffort`) is never rewritten.
 */
function isEffortRejection(failure, selection) {
  if (selection === undefined || selection.reasoningEffort === undefined) return false;
  const text = failureText(failure);
  if (text.includes("UNSUPPORTED_REASONING_EFFORT")) return true;
  if (EFFORT_REJECTION.test(text)) return true;
  // OpenAI-style bodies name the offending value without the word "effort":
  // "Unsupported value: 'turbo' is not supported with this model".
  const mentionsLevel = text.toLowerCase().includes(String(selection.reasoningEffort).toLowerCase());
  return mentionsLevel && /(unsupport|not support|invalid|unknown|unrecognized|illegal|bad request|400)/i.test(text);
}

/**
 * Install the effort-rejection recovery.
 *
 * The agent loop retries a failed request with the selection captured when the
 * step started (`prepareRequest(turn, step, decision.selection)`), and the
 * `agent/request` waterfall refuses to change it. So a mid-turn retry on another
 * effort cannot actually change what is sent. What this hook can do — and does —
 * is move the session off the rejected effort and replace the raw upstream body
 * with a message that says what happened and what to fix.
 *
 * @param ctx - host plugin context.
 */
function apply(ctx) {
  /** Per-agent set of turns already repaired. */
  const repaired = new WeakMap();

  const dispose = ctx.on("agent/request-error", (payload, next) => {
    let selection;
    try {
      const { agent, failure, turn } = payload;
      if (agent === undefined || agent.model === undefined || typeof agent.model.current !== "function" || typeof agent.model.select !== "function") return next();
      selection = agent.model.current();
      if (selection === undefined || !isEffortRejection(failure, selection)) return next();

      let turns = repaired.get(agent);
      if (turns === undefined) {
        turns = new Set();
        repaired.set(agent, turns);
      }
      if (turns.has(turn)) return next();
      turns.add(turn);

      // Provider default: the selection keeps provider/model and drops the pinned
      // effort, which is the one value every adapter accepts.
      agent.model.select({ provider: selection.provider, model: selection.model });
      if (ctx.logger !== undefined && typeof ctx.logger.warn === "function") {
        ctx.logger.warn(`model-accordion: upstream rejected reasoning effort "${selection.reasoningEffort}" for ${selection.provider}/${selection.model}; the session now runs on the provider default`);
      }
    } catch (error) {
      if (ctx.logger !== undefined && typeof ctx.logger.warn === "function") {
        ctx.logger.warn(`model-accordion: effort fallback skipped: ${String(error)}`);
      }
      return next();
    }

    // Replace the gateway body with something actionable. The loop retries with
    // the step's frozen selection, so asking for another retry would just burn a
    // request and fail identically.
    throw new Error(
      `The upstream rejected reasoning effort "${selection.reasoningEffort}" for ${selection.provider}/${selection.model}. `
      + "The session was switched to the provider default (resend the message, or pick another level). "
      + "To keep using that level, fix the reasoningEfforts declaration in the DSH client."
    );
  });

  ctx.effect(() => dispose, "model-accordion: effort fallback listener");
}

export { apply, inject, name };
export default { apply, inject, name };
