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
.dshma-vision{margin-top:4px;border-top:1px solid var(--dsw-alias-border-l3);padding-top:4px}
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
.dshma-search-wrap{flex:none;padding:4px}
.dshma-search{box-sizing:border-box;width:100%;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;outline:none;font-family:inherit}
.dshma-search:focus-visible{border-color:var(--dsw-alias-border-l3);box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
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

    function effortOptions(model) {
      const es = model && model.reasoning && Array.isArray(model.reasoning.efforts) ? model.reasoning.efforts : [];
      return es.filter((e) => e && typeof e.id === "string");
    }

    function effortName(model, id) {
      const es = effortOptions(model);
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

      React.useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
      }, [open]);

      React.useEffect(() => { if (open && props.available) props.load(); }, [open, props.available]);

      const select = (group, model, effort) => {
        if (!props.available || busy) return;
        setBusy(true);
        setFailure(null);
        const sel = { provider: group.id, model: model.id };
        if (effort !== void 0) sel.reasoningEffort = effort;
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
      const curEffort = curModel && current && current.provider === curGroup.id && current.model === curModel.id
        ? (current.reasoningEffort
            ? effortName(curModel, current.reasoningEffort)
            : (curModel.reasoning && curModel.reasoning.defaultEffort != null ? effortName(curModel, curModel.reasoning.defaultEffort) : void 0))
        : void 0;

      // Model search: filter each provider's models by the query while keeping
      // the accordion grouping structure. Matches on name, id, and description.
      const q = query.trim().toLowerCase();
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
            const defEffort = model.reasoning && model.reasoning.defaultEffort;
            // A "provider default" chip clears a pinned effort so the provider's
            // built-in default applies again (mirrors the official provider-default
            // entry in dsh-client-ui-model-selection @315-324).
            const defaultChip = defEffort !== void 0 ? [{ id: "__provider_default__", name: "默认" }] : [];
            const chips = defaultChip.concat(efforts);
            // reason about the currently active effort: a pinned explicit effort
            // wins over the provider's default; otherwise provider default applies.
            const pinnedEffort = selected ? current.reasoningEffort : void 0;
            return React.createElement("div", { className: `dshma-option${selected ? " dshma-option-selected" : ""}`, key: model.id },
              React.createElement("button", { type: "button", className: "dshma-option-row", onClick: () => {
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

      return React.createElement("div", { className: "dshma-root", ref: rootRef },
        React.createElement("button", { type: "button", className: "dshma-trigger", disabled: props.locked || !props.available || busy, onClick: () => setOpen((v) => !v), "aria-expanded": open, "aria-haspopup": "menu" },
          React.createElement("span", { className: "dshma-trigger-label" }, label),
          curEffort ? React.createElement("span", { className: "dshma-trigger-effort" }, `· ${curEffort}`) : null,
          React.createElement(Chevron, { className: `dshma-chevron${open ? " dshma-chevron-open" : ""}` })
        ),
        open ? React.createElement("div", { className: "dshma-menu", role: "menu", "aria-label": "Model selector" },
          React.createElement("div", { className: "dshma-search-wrap" },
            React.createElement("input", { type: "text", className: "dshma-search", placeholder: "Search models…", value: query, onChange: (e) => setQuery(e.target.value), "aria-label": "Search models", autoFocus: true })
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
