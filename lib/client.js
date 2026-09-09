window.__ModuleLoader__.load({
  id: "dsh-model-accordion",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");

    // CSS is self-contained and theme-token driven (mirrors the shipped
    // model-selection geometry). The popup scroll region carries its own
    // max-height so the menu is ALWAYS height-bounded and scrolls internally,
    // independent of any ancestor flex/layout context.
    const CSS = `
.dshma-root{position:relative;min-width:0}
.dshma-trigger{box-sizing:border-box;display:flex;align-items:center;gap:4px;height:28px;max-width:min(360px,45cqw);padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:20px;cursor:pointer;outline:none;min-width:0}
.dshma-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dshma-trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.dshma-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dshma-trigger-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.dshma-trigger-effort{color:var(--dsw-alias-label-caption);flex:none}
.dshma-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}
.dshma-chevron-open{transform:rotate(180deg)}
.dshma-menu{box-sizing:border-box;z-index:50;position:absolute;bottom:calc(100% + 8px);right:0;width:max-content;min-width:min(240px,100vw - 32px);max-width:min(420px,100vw - 32px);padding:4px;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-specific-menu);border-radius:12px;box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;overflow:hidden}
.dshma-menu-scroll{box-sizing:border-box;max-height:min(340px,calc(100vh - 120px));overflow-y:auto;display:flex;flex-direction:column;min-width:0;-webkit-overflow-scrolling:touch}
.dshma-status,.dshma-empty{color:var(--dsw-alias-label-tertiary);padding:10px;font-size:13px;line-height:20px}
.dshma-error{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:8px;margin-bottom:4px;padding:7px 8px;font-size:12px;line-height:18px}
.dshma-provider{border-radius:10px;overflow:hidden;flex:none}
.dshma-provider-head{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:7px;padding:8px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:18px;text-align:left;cursor:pointer;font-family:inherit}
.dshma-provider-head:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-provider-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshma-count{color:var(--dsw-alias-label-caption);font-size:11px;font-weight:500;flex:none}
.dshma-provider-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}
.dshma-provider-chevron-open{transform:rotate(180deg)}
.dshma-models{padding:0 4px 4px}
.dshma-option{box-sizing:border-box;width:100%;padding:7px 8px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;display:block}
.dshma-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-option-selected{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-option-row{display:flex;align-items:center;gap:8px;min-width:0;width:100%;border:none;background:transparent;padding:0;color:inherit;cursor:pointer;font-family:inherit;text-align:left}
.dshma-option-main{flex:1;min-width:0}
.dshma-option-name{font-size:13px;font-weight:500;line-height:18px;overflow-wrap:anywhere;display:block}
.dshma-option-desc{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;overflow-wrap:anywhere;display:block}
.dshma-check{color:var(--dsw-alias-label-secondary);flex:none;font-size:14px}
.dshma-efforts{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;padding-left:0}
.dshma-effort{box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l3);border-radius:8px;padding:2px 7px;font-size:11px;line-height:16px;font-family:inherit}
.dshma-effort:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}
.dshma-effort-selected{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-secondary)}
.dshma-failure{color:var(--dsw-alias-label-tertiary);border-radius:8px;padding:7px 8px;font-size:12px;line-height:18px}
.dshma-search-wrap{flex:none;padding:4px;position:relative}
.dshma-search{box-sizing:border-box;width:100%;height:28px;padding:0 28px 0 10px;border:1px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;outline:none;font-family:inherit}
.dshma-search:focus-visible{border-color:var(--dsw-alias-border-l3);box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.dshma-search-clear{position:absolute;top:50%;right:7px;transform:translateY(-50%);width:18px;height:18px;border:none;border-radius:50%;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;font-size:13px;line-height:1}
.dshma-search-clear:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}
`;

    function Chevron(props) {
      return React.createElement("svg", { className: props.className || "dshma-chevron", width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true" },
        React.createElement("path", { d: "M3.5 5.25 7 8.75l3.5-3.5", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    }

    function useStore(store) {
      return React.useSyncExternalStore(
        (fn) => store.subscribe(fn),
        () => store.getSnapshot(),
        () => store.getSnapshot()
      );
    }

    //#region Official reasoning-effort divisions
    // Built-in, provider-independent reasoning-effort divisions keyed on the
    // model's name/id. This is what lets the selector offer sensible effort
    // choices even when a model's configured catalog (or a third-party relay /
    // gateway) declares no `reasoningEfforts` — the common npm-install case.
    // The divisions below are sourced from each vendor's public API docs, cross-
    // checked against the installed pi-ai catalog (providers/data/*.json) and the
    // vendor docs listed in the plugin changelog. Levels are the canonical pi-ai
    // ids (off/minimal/low/medium/high/xhigh/max — see THINKING_LEVELS in
    // dsh-llm-pi-ai); `default` is the official default and is used only when the
    // backend leaves it unset.
    //
    // IMPORTANT — only models whose vendors expose a real reasoning-effort ladder
    // are listed. Families whose native control is NOT an effort ladder (Claude
    // ≤4.5 & Gemini 2.5 token budgets, GLM ≤5.1 / Kimi K2 / MiniMax / Mistral
    // two-state thinking, Qwen open-source enable_thinking, DeepSeek ≤V3 / R1) are
    // deliberately excluded so we never surface a ladder the API would reject.
    // Official-family models are normally covered by the installed pi-ai catalog
    // (backend first layer) anyway; this table only backs up manually-declared /
    // relay models the backend leaves unconfigured.
    //
    // Entries are checked top-down; the first match wins.
    //   gpt-5.6 (Sol/Terra/Luna): full ladder incl. max            (default high ⚠ TBD)
    //   gpt-5.2+ / 5.3-codex:      low/medium/high/xhigh            (default high ⚠ TBD)
    //   gpt-5.1:                   minimal/low/medium/high          (default low)
    //   gpt-5 / mini / nano:       minimal/low/medium/high          (default medium)
    //   o1/o3/o4 families:         low/medium/high                  (default medium)
    //   gpt-oss:                   low/medium/high                  (default medium)
    //   grok 4.x (responses):      low/medium/high                  (default high)
    //   glm-5.3 / 5.3-FLASH:       low/high/max (thinking un-offable)(default max)
    //   glm-5.2+:                  low/medium/high/xhigh/max        (default max)
    //   deepseek-v4:               low/high/max                     (default high)
    //   kimi-k3:                   low/high/max                     (default max)
    //   qwen3.8:                   xhigh/medium/low                 (default xhigh)
    //   gemini-3+ (Pro/Flash):     low/high (always on)             (default high)
    //   claude 4.6+ adaptive:      low/medium/high                  (default high)
    //   gemma-4:                   minimal/high                     (default high)
    const OFFICIAL_EFFORTS = [
      { test: /gpt-5\.6/i, efforts: ["minimal", "low", "medium", "high", "xhigh", "max"], def: "high" },
      { test: /gpt-5\.2[^0-9]|gpt-5\.[3-9]|gpt-5\.2\b/i, efforts: ["low", "medium", "high", "xhigh"], def: "high" },
      { test: /gpt-5\.1/i, efforts: ["minimal", "low", "medium", "high"], def: "low" },
      { test: /gpt-5(?:-mini|-nano)?\b/i, efforts: ["minimal", "low", "medium", "high"], def: "medium" },
      { test: /o[134](-mini|-pro)?\b/i, efforts: ["low", "medium", "high"], def: "medium" },
      { test: /gpt-oss/i, efforts: ["low", "medium", "high"], def: "medium" },
      { test: /grok/i, efforts: ["low", "medium", "high"], def: "high" },
      { test: /glm-5\.3/i, efforts: ["low", "high", "max"], def: "max" },
      { test: /glm-5(?:\.[2-9]|\.\d+)/i, efforts: ["low", "medium", "high", "xhigh", "max"], def: "max" },
      { test: /deepseek-v4/i, efforts: ["low", "high", "max"], def: "high" },
      { test: /kimi-k3/i, efforts: ["low", "high", "max"], def: "max" },
      { test: /qwen3\.8/i, efforts: ["xhigh", "medium", "low"], def: "xhigh" },
      { test: /gemini-3/i, efforts: ["low", "high"], def: "high" },
      { test: /claude-(opus|sonnet|haiku|fable)-(4\.[6-9]|5)\b/i, efforts: ["low", "medium", "high"], def: "high" },
      { test: /gemma-4/i, efforts: ["minimal", "high"], def: "high" }
    ];

    function officialEffortsFor(model) {
      if (!model) return void 0;
      const hay = `${model.name || ""} ${model.id || ""}`;
      for (const entry of OFFICIAL_EFFORTS) {
        if (entry.test.test(hay)) return entry;
      }
      return void 0;
    }

    // Reason offered for a model: the backend/configured-catalog efforts when the
    // model has them, otherwise the built-in official table as a fallback. This
    // single "auto" rule is all there is — a user who configured their own levels
    // keeps them, and an unconfigured model still gets sensible official choices.
    function resolveEfforts(model) {
      const backend = model && model.reasoning && Array.isArray(model.reasoning.efforts)
        ? model.reasoning.efforts.filter((e) => e && typeof e.id === "string")
        : [];
      if (backend.length > 0) return backend;
      const official = officialEffortsFor(model);
      if (!official) return [];
      return official.efforts.map((id) => ({ id, name: `${id.charAt(0).toUpperCase()}${id.slice(1)}` }));
    }
    // The default effort id to surface for a model (trigger caption + default
    // chip highlight): the backend-declared default wins, and the official table's
    // default is used only when the backend left it unset.
    function resolveDefaultEffort(model) {
      const backendDefault = model && model.reasoning && model.reasoning.defaultEffort != null
        ? model.reasoning.defaultEffort
        : void 0;
      if (backendDefault !== void 0) return backendDefault;
      const official = officialEffortsFor(model);
      return official ? official.def : void 0;
    }
    // Whether an effort id is genuinely supported by the model — used by the
    // submit path to decide whether to send reasoningEffort.
    function effortSupported(model, id) {
      return resolveEfforts(model).some((e) => e.id === id);
    }

    function effortOptions(model) {
      return resolveEfforts(model);
    }

    function effortName(model, id) {
      const es = resolveEfforts(model);
      const hit = es.find((e) => e.id === id);
      return hit && hit.name ? hit.name : id;
    }

    function Accordion(props) {
      const state = useStore(props.directory);
      const [open, setOpen] = React.useState(false);
      const [expanded, setExpanded] = React.useState({});
      const [busy, setBusy] = React.useState(false);
      const [failure, setFailure] = React.useState(null);
      const groups = Array.isArray(state.groups) ? state.groups : [];
      const rootRef = React.useRef(null);
      const [query, setQuery] = React.useState("");
      // Roving focus registry: every visible model-row button registers itself here
      // (keyed by group+model), so arrow/Home/End navigate in accordion order.
      const itemKeys = React.useRef({});
      const registerItem = (key, el) => { if (el) itemKeys.current[key] = el; else delete itemKeys.current[key]; };
      const searchRef = React.useRef(null);

      // When the menu opens with NO provider expanded yet, surface the provider
      // holding the current model so a fresh open is not a blank, fully-collapsed
      // list. Crucially this only fires while `expanded` is empty: re-running it on
      // every open (selecting a model closes the menu, so compare-testing reopens
      // repeatedly) would otherwise accumulate every tested provider into
      // `expanded`, leaving them all open once the search filter is cleared. When
      // the user has already opened providers (browse state) we leave them alone.
      React.useEffect(() => {
        if (!open) return;
        if (Object.values(expanded).some(Boolean)) return;
        const g = groups.find((gg) => gg.id === state.current?.provider);
        if (g) setExpanded((old) => ({ ...old, [g.id]: true }));
      }, [open]);

      React.useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
      }, [open]);

      // Populate store.current as soon as the model slot becomes available
      // (mount/startup), so the trigger shows the last-used model instead of
      // falling back to "Select model" until the user opens the menu.
      React.useEffect(() => { if (props.available) props.load(); }, [props.available, props.load]);
      // Refresh the store whenever the menu is opened (mirrors official reload).
      React.useEffect(() => { if (open && props.available) props.load(); }, [open, props.available]);

      const select = (group, model, effort) => {
        if (!props.available || busy) return;
        setBusy(true);
        setFailure(null);
        const sel = { provider: group.id, model: model.id };
        // Submit-degradation: only send reasoningEffort when the picked level is
        // one the model genuinely supports. When the backend catalog declares
        // efforts, an "official" level it does not list is dropped so the request
        // falls back to the model's default instead of failing with
        // UNSUPPORTED_REASONING_EFFORT. NOTE: when the backend declares no efforts
        // at all the official table is the sole authority, so any official level is
        // sent as-is — an under-configured relay may still reject it.
        if (effort !== void 0 && effortSupported(model, effort)) sel.reasoningEffort = effort;
        props.select(sel).then((ok) => {
          if (!ok) throw new Error("model selection failed");
          setOpen(false);
        }).catch((e) => {
          setFailure(e && e.message ? e.message : "model selection failed");
        }).finally(() => setBusy(false));
      };

      const current = state.current;
      const curGroup = groups.find((g) => g.id === current?.provider);
      const curModel = curGroup ? curGroup.models.find((m) => m.id === current?.model) : void 0;
      const label = curModel ? curModel.name : (current ? `${current.provider}/${current.model}` : "Select model");
      // Show a `· effort` caption ONLY when a reasoning effort is actually pinned
      // on the current selection (persisted in `current.reasoningEffort`). The
      // official default is deliberately NOT surfaced here: showing it before the
      // user pins anything reads as "already set", which is misleading.
      const curEffort = curModel && current && current.provider === curGroup.id && current.model === curModel.id && current.reasoningEffort
        ? effortName(curModel, current.reasoningEffort)
        : void 0;

      // Model search: filter each provider's models by the query while keeping
      // the accordion grouping structure. Matches on name, id, and description.
      const q = query.trim().toLowerCase();
      // When the filter is cleared (✕ / Escape / manual delete), collapse the
      // accordion to the provider holding the CURRENT model. Selecting a model
      // never writes `expanded`, so without this the menu would fall back to
      // whatever was expanded before the search — not the model you just picked.
      // Because selection does not accumulate into `expanded`, this stays focused
      // on one group and never re-introduces the "everything open" problem.
      const prevQuery = React.useRef("");
      React.useEffect(() => {
        const prev = prevQuery.current;
        prevQuery.current = q;
        if (q === "" && prev !== "") {
          const cur = state.current;
          setExpanded(cur && groups.some((g) => g.id === cur.provider) ? { [cur.provider]: true } : {});
        }
      }, [q]);
      const matches = (m) => q === "" || [m.name, m.id, m.description].some((s) => typeof s === "string" && s.toLowerCase().includes(q));
      const visibleGroups = q === ""
        ? groups
        : groups.map((g) => ({ ...g, models: g.models.filter(matches) })).filter((g) => g.models.length > 0);
      const hasAnyModel = visibleGroups.some((g) => g.models.length > 0);

      const renderGroup = (group) => {
        const isOpen = expanded[group.id] === true || q !== "";
        if (!group.models.length) return null;
        return React.createElement("div", { className: "dshma-provider", key: group.id },
          React.createElement("button", { type: "button", className: "dshma-provider-head", onClick: () => setExpanded((old) => ({ ...old, [group.id]: !isOpen })), "aria-expanded": isOpen },
            React.createElement(Chevron, { className: `dshma-provider-chevron${isOpen ? " dshma-provider-chevron-open" : ""}` }),
            React.createElement("span", { className: "dshma-provider-name" }, group.name || group.id),
            React.createElement("span", { className: "dshma-count" }, `${group.models.length}`)
          ),
          isOpen ? React.createElement("div", { className: "dshma-models" }, group.models.map((model) => {
            const selected = current && current.provider === group.id && current.model === model.id;
            const efforts = effortOptions(model);
            const defEffort = resolveDefaultEffort(model);
            // A "default" chip clears a pinned effort so the model's effective
            // default applies again (mirrors the official provider-default entry
            // in dsh-client-ui-model-selection @315-324). It appears only when a
            // default effort is known (backend-declared or official-table).
            const defaultChip = defEffort !== void 0 ? [{ id: "__provider_default__", name: "默认" }] : [];
            const chips = defaultChip.concat(efforts);
            const pinnedEffort = selected ? current.reasoningEffort : void 0;
            return React.createElement("div", { className: `dshma-option${selected ? " dshma-option-selected" : ""}`, key: model.id },
              React.createElement("button", { type: "button", className: "dshma-option-row", ref: (el) => registerItem(`${group.id}\u0000${model.id}`, el), onClick: () => {
                // Re-clicking the already-selected model must NOT re-submit and
                // thereby wipe a custom (pinned) effort — just close the menu.
                // Mirrors dsh-client-ui-model-selection @397-400 / @718.
                if (selected) { setOpen(false); return; }
                select(group, model, defEffort);
              }, disabled: busy },
                React.createElement("span", { className: "dshma-option-main" },
                  React.createElement("span", { className: "dshma-option-name" }, model.name || model.id),
                  model.description ? React.createElement("span", { className: "dshma-option-desc" }, model.description) : null
                ),
                selected ? React.createElement("span", { className: "dshma-check", "aria-label": "selected" }, "✓") : null
              ),
              chips.length ? React.createElement("div", { className: "dshma-efforts", "aria-label": "Reasoning effort" }, chips.map((it) => React.createElement("button", { type: "button", key: it.id, className: `dshma-effort${selected && (it.id === "__provider_default__" ? !current.reasoningEffort : pinnedEffort === it.id) ? " dshma-effort-selected" : ""}`, onClick: () => select(group, model, it.id === "__provider_default__" ? void 0 : it.id), disabled: busy }, it.name || it.id))) : null
            );
          })) : null
        );
      };

      // Roving arrow-key navigation across the rendered model rows (mirrors the
      // official ModelSelect moveFocus). Enter/Space activate the focused row
      // natively; Arrow keys / Home / End move between rows. ArrowDown from the
      // search field lands on the first row.
      const onMenuKey = (e) => {
        // Escape: first press with text clears the search (keeping focus), second
        // press closes. stopPropagation prevents the document-level handler from
        // closing the menu while we are only clearing.
        if (e.key === "Escape" && query !== "") {
          e.preventDefault(); e.stopPropagation(); setQuery(""); searchRef.current && searchRef.current.focus(); return;
        }
        const els = Object.values(itemKeys.current)
          .filter((el) => el && el.offsetParent !== null);
        if (!els.length) return;
        const idx = els.indexOf(document.activeElement);
        let next = null;
        if (e.key === "ArrowDown") { e.preventDefault(); next = idx === -1 ? els[0] : els[(idx + 1) % els.length]; }
        else if (e.key === "ArrowUp") { e.preventDefault(); next = idx === -1 ? els[els.length - 1] : els[(idx - 1 + els.length) % els.length]; }
        else if (e.key === "Home") { e.preventDefault(); next = els[0]; }
        else if (e.key === "End") { e.preventDefault(); next = els[els.length - 1]; }
        if (next) next.focus();
      };

      return React.createElement("div", { className: "dshma-root", ref: rootRef },
        React.createElement("button", { type: "button", className: "dshma-trigger", disabled: props.locked || !props.available || busy, onClick: () => setOpen((v) => !v), "aria-expanded": open, "aria-haspopup": "menu" },
          React.createElement("span", { className: "dshma-trigger-label" }, label),
          curEffort ? React.createElement("span", { className: "dshma-trigger-effort" }, `· ${curEffort}`) : null,
          React.createElement(Chevron, { className: `dshma-chevron${open ? " dshma-chevron-open" : ""}` })
        ),
        open ? React.createElement("div", { className: "dshma-menu", role: "menu", "aria-label": "Model selector", onKeyDown: onMenuKey },
          React.createElement("div", { className: "dshma-search-wrap" },
            React.createElement("input", { type: "text", className: "dshma-search", placeholder: "Search models…", value: query, onChange: (e) => setQuery(e.target.value), "aria-label": "Search models", autoFocus: true, ref: searchRef }),
            query !== "" ? React.createElement("button", { type: "button", className: "dshma-search-clear", onClick: () => { setQuery(""); searchRef.current && searchRef.current.focus(); }, "aria-label": "Clear search", title: "Clear search" }, "✕") : null
          ),
          React.createElement("div", { className: "dshma-menu-scroll" },
            failure ? React.createElement("div", { className: "dshma-error" }, failure) : null,
            state.error ? React.createElement("div", { className: "dshma-error" }, state.error) : null,
            state.status === "loading" ? React.createElement("div", { className: "dshma-status" }, "Loading models…") : null,
            (state.status === "selecting" || busy) ? React.createElement("div", { className: "dshma-status" }, "Selecting…") : null,
            state.status !== "loading" && !hasAnyModel && q === "" ? React.createElement("div", { className: "dshma-empty" }, "No models available") : null,
            q !== "" && !hasAnyModel ? React.createElement("div", { className: "dshma-empty" }, "No matches") : null,
            visibleGroups.map(renderGroup)
          )
        ) : null
      );
    }

    const inject = ["slots", "modelDirectories", "sessions"];

    function injectCss() {
      if (typeof document === "undefined") return () => {};
      const prev = document.querySelector('style[data-dshma-css]');
      if (prev) prev.remove();
      const tag = document.createElement("style");
      tag.setAttribute("data-dshma-css", "1");
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return () => tag.remove();
    }

    function apply(ctx) {
      const cssDispose = ctx.effect(injectCss, "dsh-model-accordion: styles");
      ctx.slots.inject("conversation.input.model", () => ctx.slots.register({
        name: "conversation.input.model",
        priority: -1,
        inject: (sessionId) => {
          const directory = ctx.modelDirectories.directoryFor(sessionId);
          const available = ctx.sessions.subagentAddress(sessionId) === void 0;
          return {
            available,
            directory: directory.store,
            load: () => { if (available) directory.load().catch(() => {}); },
            select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
          };
        }
      }, Accordion));
      return cssDispose;
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
