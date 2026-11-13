window.__ModuleLoader__.load({
  id: "dsh-model-accordion",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");
    const ReactDOM = require("react-dom");
    const h = React.createElement;

    // Dictionary namespace owned by this plugin. Registered through the client
    // `locale` service in apply() and named on the slot registration, so the slot
    // host hands the component a `t()` bound to exactly these keys (the same seat
    // the official ui-model-selection declares with its own "model" namespace).
    const NS = "model-accordion";
    const zh = {
      "provider.account": "DeepSeek 账号",
      "trigger.fallback": "选择模型",
      "trigger.loading": "正在加载模型…",
      "trigger.selectAria": "选择模型",
      "trigger.aria": "选择模型，当前 {model}",
      "trigger.ariaEffort": "选择模型，当前 {model}，推理等级 {effort}",
      "menu.aria": "模型与推理等级",
      "menu.effort": "推理等级",
      "effort.providerDefault": "Default",
      "effort.back": "返回",
      "search.placeholder": "搜索模型…",
      "search.aria": "搜索模型",
      "search.clear": "清除搜索",
      "search.empty": "没有匹配的模型。",
      "empty.models": "暂无可用模型",
      "empty.efforts": "当前模型未提供推理等级。",
      "status.loading": "正在刷新模型列表…",
      "error.action": "模型操作失败：{message}",
      "error.select": "模型切换失败",
      "error.sessionInUse": "当前会话已被占用，可能是其他正在运行的 DSH 导致的（如其他 dsh web、桌面端），请退出其他正在运行的 DSH 后重试。",
      "warning.groupLoad": "{name} 加载失败：{message}",
      "notice.effortFallback": "上游不支持推理挡位「{requested}」，已自动回退到「{actual}」。想长期使用它，请在 DSH 客户端的 reasoningEfforts 声明里修正。",
      "notice.dismiss": "知道了",
      "action.reload": "重新加载"
    };
    const en = {
      "provider.account": "DeepSeek Account",
      "trigger.fallback": "Select model",
      "trigger.loading": "Loading models…",
      "trigger.selectAria": "Select model",
      "trigger.aria": "Select model, current {model}",
      "trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
      "menu.aria": "Model and reasoning effort",
      "menu.effort": "Effort",
      "effort.providerDefault": "Default",
      "effort.back": "Back",
      "search.placeholder": "Search models…",
      "search.aria": "Search models",
      "search.clear": "Clear search",
      "search.empty": "No matching models.",
      "empty.models": "No models available.",
      "empty.efforts": "This model provides no reasoning effort levels.",
      "status.loading": "Refreshing model list…",
      "error.action": "Model operation failed: {message}",
      "error.select": "Model selection failed",
      "error.sessionInUse": "This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.",
      "warning.groupLoad": "{name} failed to load: {message}",
      "notice.effortFallback": "The upstream rejected reasoning effort \"{requested}\" and the turn fell back to \"{actual}\". Fix the reasoningEfforts declaration in the DSH client to keep using it.",
      "notice.dismiss": "Got it",
      "action.reload": "Reload"
    };

    // CSS is self-contained and theme-token driven. The popup is portaled to
    // document.body and positioned with fixed coordinates, so no ancestor
    // overflow/flex context can clip it; the scroll region carries its own
    // max-height so the menu is always height-bounded.
    const CSS = `
.dshma-root{position:relative;min-width:0}
.dshma-trigger{box-sizing:border-box;display:flex;align-items:center;gap:4px;height:28px;max-width:min(360px,45cqw);padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:20px;cursor:pointer;outline:none;min-width:0}
.dshma-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dshma-trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.dshma-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dshma-trigger-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.dshma-trigger-effort{color:var(--dsw-alias-label-caption);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1000;min-width:0}
.dshma-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}
.dshma-chevron-open{transform:rotate(180deg)}
.dshma-spinner{box-sizing:border-box;width:12px;height:12px;flex:none;border-radius:50%;border:1.5px solid var(--dsw-alias-label-caption);border-top-color:transparent;animation:dshma-spin .8s linear infinite}
@keyframes dshma-spin{to{transform:rotate(360deg)}}
.dshma-menu{box-sizing:border-box;position:fixed;z-index:1100;width:max-content;min-width:min(260px,100vw - 24px);max-width:min(440px,100vw - 24px);padding:4px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-specific-menu);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter,blur(40px) saturate(150%));backdrop-filter:var(--dsw-menu-backdrop-filter,blur(40px) saturate(150%));box-shadow:var(--dsw-elevation-prominent,var(--dsw-shadow-lv3));color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;overflow:hidden;isolation:isolate}
.dshma-menu-body{box-sizing:border-box;max-height:min(360px,calc(100vh - 96px));overflow-y:auto;display:flex;flex-direction:column;min-width:0;-webkit-overflow-scrolling:touch}
.dshma-pane{display:flex;flex-direction:column;min-width:0}
.dshma-status,.dshma-empty{color:var(--dsw-alias-label-tertiary);padding:10px;font-size:13px;line-height:20px}
.dshma-error,.dshma-warning{display:flex;align-items:flex-start;gap:6px;border-radius:8px;background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);margin:2px 0 4px;padding:7px 8px;font-size:12px;line-height:18px}
.dshma-error span,.dshma-warning span{flex:1;min-width:0;overflow-wrap:anywhere}
.dshma-retry{flex:none;border:none;border-radius:6px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-decoration:underline;padding:0}
.dshma-cell{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:7px;padding:8px;margin:2px 0;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:18px;text-align:left;cursor:pointer;font-family:inherit}
.dshma-cell:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-cell-label{flex:none;min-width:0}
.dshma-cell-value{flex:1;min-width:0;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-weight:500}
.dshma-cell-chevron{flex:none;transform:rotate(-90deg)}
.dshma-provider{border-radius:10px;overflow:hidden;flex:none}
.dshma-provider-head{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:7px;padding:8px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:18px;text-align:left;cursor:pointer;font-family:inherit}
.dshma-provider-head:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-provider-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshma-count{color:var(--dsw-alias-label-caption);font-size:11px;font-weight:500;flex:none}
.dshma-provider-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}
.dshma-provider-chevron-open{transform:rotate(180deg)}
.dshma-models{padding:0 4px 4px}
.dshma-option{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:8px;padding:7px 8px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;font-family:inherit}
.dshma-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-option-selected{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-option-main{flex:1;min-width:0}
.dshma-option-name{display:block;font-size:13px;font-weight:500;line-height:18px;overflow-wrap:anywhere}
.dshma-option-desc{display:block;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;overflow-wrap:anywhere}
.dshma-option-effort{flex:none;color:var(--dsw-alias-label-caption);font-size:11px;line-height:16px;border:1px solid var(--dsw-alias-border-l3);border-radius:999px;padding:0 6px}
.dshma-check{color:var(--dsw-alias-label-secondary);flex:none;font-size:14px}
.dshma-badge{display:inline-flex;align-items:center;border-radius:4px;padding:0 4px;font-size:10px;line-height:16px;font-weight:600;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);vertical-align:baseline}
.dshma-badged-name{display:inline-flex;align-items:baseline;gap:4px;flex-wrap:wrap;min-width:0}
.dshma-back{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:6px;padding:8px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:18px;text-align:left;cursor:pointer;font-family:inherit}
.dshma-back:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshma-search-wrap{flex:none;padding:4px;position:relative}
.dshma-search{box-sizing:border-box;width:100%;height:28px;padding:0 28px 0 10px;border:1px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;outline:none;font-family:inherit}
.dshma-search:focus-visible{border-color:var(--dsw-alias-border-l3);box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.dshma-search-clear{position:absolute;top:50%;right:7px;transform:translateY(-50%);width:18px;height:18px;border:none;border-radius:50%;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;font-size:13px;line-height:1}
.dshma-search-clear:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}
`;

    // ---------------------------------------------------------------------
    // Pure helpers
    // ---------------------------------------------------------------------

    /** Display order shared with the official pickers: account, official, then catalog order. */
    function orderProviders(groups) {
      const rank = (group) => group.id === "deepseek-account" ? 0 : group.id === "deepseek-official" ? 1 : 2;
      return groups.slice().sort((left, right) => rank(left) - rank(right));
    }

    /** Ordered-subsequence score; lower is better, null means no match. */
    function scoreMatch(text, needle) {
      let cursor = 0;
      let first = -1;
      let gaps = 0;
      let previous = -1;
      for (const character of needle) {
        const at = text.indexOf(character, cursor);
        if (at === -1) return null;
        if (first === -1) first = at;
        else gaps += at - previous - 1;
        previous = at;
        cursor = at + 1;
      }
      return first * 100 + gaps;
    }

    /**
     * Filter and rank one provider's models by display name, preserving catalog order on ties.
     * Descriptions and ids are deliberately excluded: an ordered-subsequence match over prose
     * pulls unrelated models into the list (searching "laude" matched a DeepSeek description).
     */
    function rankModels(models, query) {
      const needle = query.toLowerCase();
      const scored = [];
      for (let index = 0; index < models.length; index += 1) {
        const model = models[index];
        const name = typeof model.name === "string" ? model.name : model.id;
        if (typeof name !== "string") continue;
        const score = scoreMatch(name.toLowerCase(), needle);
        if (score !== null) scored.push({ model, index, score });
      }
      scored.sort((left, right) => left.score === right.score ? left.index - right.index : left.score - right.score);
      return scored.map((entry) => entry.model);
    }

    /** Resolve a reasoning level id to its catalog display name. */
    function effortName(reasoning, effort, fallback) {
      if (effort === undefined) return fallback;
      const level = reasoning.efforts.find((candidate) => candidate.id === effort);
      return level === undefined ? effort : level.name;
    }

    /**
     * Coerce an effort into one the model actually declares. No pinned level means "provider
     * default" (undefined) and stays that way. A pinned level the catalog no longer declares
     * falls back to the model default, then to the first declared level.
     */
    function supportedEffort(reasoning, pinned) {
      if (reasoning === undefined || !Array.isArray(reasoning.efforts)) return undefined;
      const declared = (candidate) => candidate !== undefined && reasoning.efforts.some((level) => level.id === candidate);
      if (pinned === undefined) return declared(reasoning.defaultEffort) ? reasoning.defaultEffort : undefined;
      if (declared(pinned)) return pinned;
      if (declared(reasoning.defaultEffort)) return reasoning.defaultEffort;
      return reasoning.efforts.length > 0 ? reasoning.efforts[0].id : undefined;
    }

    // ---------------------------------------------------------------------
    // Presentational bits
    // ---------------------------------------------------------------------

    function Chevron(props) {
      return h("svg", { className: props.className || "dshma-chevron", width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true" },
        h("path", { d: "M3.5 5.25 7 8.75l3.5-3.5", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
      );
    }

    function Spinner() {
      return h("span", { className: "dshma-spinner", "aria-hidden": "true" });
    }

    function useStore(store) {
      return React.useSyncExternalStore(
        (fn) => store.subscribe(fn),
        () => store.getSnapshot(),
        () => store.getSnapshot()
      );
    }

    let nextInstance = 0;

    // ---------------------------------------------------------------------
    // The composer model seat
    // ---------------------------------------------------------------------

    function ModelAccordion(props) {
      const { directory, load, select, t, renderSlot, resolveText, locked, available } = props;
      const state = useStore(directory);

      const [open, setOpen] = React.useState(false);
      const [pane, setPane] = React.useState("model");
      const [query, setQuery] = React.useState("");
      const [expanded, setExpanded] = React.useState({});
      const [failure, setFailure] = React.useState(null);
      const [submitting, setSubmitting] = React.useState(false);
      const [menuPos, setMenuPos] = React.useState(null);
      const [notice, setNotice] = React.useState(null);

      const rootRef = React.useRef(null);
      const triggerRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const searchRef = React.useRef(null);
      const itemRefs = React.useRef([]);
      const loadedOnce = React.useRef(false);
      const previousQuery = React.useRef("");
      const healedEffort = React.useRef("");
      const submittedEffort = React.useRef(null);
      const id = React.useMemo(() => `dshma-${nextInstance += 1}`, []);

      // Copy comes from the host `t` when present; the built-in dictionary is the
      // fallback so the seat still renders inside an older host.
      const tr = (key, vars, fallback) => {
        let text;
        if (typeof t === "function") {
          try { text = t(key, vars); } catch (error) { text = undefined; }
        }
        if (typeof text !== "string" || text.length === 0 || text === key) {
          text = fallback !== undefined ? fallback : (en[key] !== undefined ? en[key] : key);
        }
        if (vars !== undefined) {
          text = text.replace(/\{(\w+)\}/g, (match, name) => vars[name] === undefined ? match : String(vars[name]));
        }
        return text;
      };

      const groups = React.useMemo(() => orderProviders(Array.isArray(state.groups) ? state.groups : []), [state.groups]);
      const choices = React.useMemo(() => {
        const rows = [];
        for (const group of groups) {
          for (const model of group.models) {
            const selection = { provider: group.id, model: model.id };
            const effort = model.reasoning === undefined ? undefined : model.reasoning.defaultEffort;
            if (effort !== undefined) selection.reasoningEffort = effort;
            rows.push({ group, model, selection });
          }
        }
        return rows;
      }, [groups]);

      const current = state.current === undefined ? null : state.current;
      const currentChoice = current === null
        ? undefined
        : choices.find((choice) => choice.selection.provider === current.provider && choice.selection.model === current.model);
      const reasoning = currentChoice === undefined ? undefined : currentChoice.model.reasoning;
      const effectiveEffort = supportedEffort(reasoning, current === null ? undefined : current.reasoningEffort);
      const effortLabel = currentChoice === undefined
        ? undefined
        : reasoning === undefined
          ? state.retainedEffort
          : effectiveEffort === undefined
            ? tr("effort.providerDefault")
            : effortName(reasoning, effectiveEffort, tr("effort.providerDefault"));
      const pending = state.pending === undefined ? null : state.pending;
      const busy = pending !== null || submitting;
      const loading = state.status === "loading";
      // Search stays available at every catalog size (the 0.2.x behaviour), not
      // only above four models as the official picker does.
      const q = query.trim();
      const visibleGroups = React.useMemo(() => groups
        .map((group) => ({ ...group, models: q === "" ? group.models : rankModels(group.models, q) }))
        .filter((group) => group.models.length > 0), [groups, q]);
      const effortChoices = reasoning === undefined ? [] : [
        ...(reasoning.defaultEffort === undefined ? [{ key: "provider-default", effort: undefined, label: tr("effort.providerDefault") }] : []),
        ...reasoning.efforts.map((level) => ({ key: `effort:${level.id}`, effort: level.id, label: level.name }))
      ];

      const retry = () => {
        try { load(); } catch (error) { void error; }
      };

      const close = (restoreFocus) => {
        setOpen(false);
        setPane("model");
        if (restoreFocus === true) {
          queueMicrotask(() => { if (triggerRef.current !== null) triggerRef.current.focus(); });
        }
      };

      const describeError = (error) => {
        const code = error !== null && typeof error === "object" && typeof error.code === "string" ? error.code : undefined;
        if (code === "session/writer-held") return tr("error.sessionInUse");
        const message = error !== null && typeof error === "object" && typeof error.message === "string"
          ? `${code === undefined ? "" : `${code}: `}${error.message}`
          : tr("error.select");
        return tr("error.action", { message });
      };

      const dispatch = (selection, retrySelection) => {
        setSubmitting(true);
        setFailure(null);
        setNotice(null);
        submittedEffort.current = { provider: selection.provider, model: selection.model, effort: selection.reasoningEffort };
        let request;
        try {
          request = select(selection);
        } catch (error) {
          setFailure(describeError(error));
          setSubmitting(false);
          return;
        }
        let next;
        Promise.resolve(request).then((result) => {
          if (result === undefined) return;
          if (result.ok) { close(true); return; }
          const error = result.error;
          const code = error !== null && typeof error === "object" ? error.code : undefined;
          // A level the host refuses is repaired once with the model's fallback
          // instead of surfacing a dead end.
          if (code === "UNSUPPORTED_REASONING_EFFORT" && retrySelection !== undefined) {
            next = retrySelection;
            return;
          }
          setFailure(describeError(error));
        }).catch((error) => {
          setFailure(describeError(error));
        }).finally(() => {
          setSubmitting(false);
          if (next !== undefined) dispatch(next, undefined);
        });
      };

      const submit = (selection, retrySelection) => {
        if (busy) return;
        dispatch(selection, retrySelection);
      };

      const choose = (group, model) => {
        const sameModel = current !== null && current.provider === group.id && current.model === model.id;
        const defaultEffort = model.reasoning === undefined ? undefined : model.reasoning.defaultEffort;
        const effort = supportedEffort(model.reasoning, sameModel ? (current.reasoningEffort ?? defaultEffort) : defaultEffort);
        if (sameModel && (current.reasoningEffort ?? undefined) === effort) { close(true); return; }
        const selection = { provider: group.id, model: model.id };
        if (effort !== undefined) selection.reasoningEffort = effort;
        const fallback = supportedEffort(model.reasoning, undefined);
        const retrySelection = fallback === effort || fallback === undefined
          ? undefined
          : { provider: group.id, model: model.id, reasoningEffort: fallback };
        submit(selection, retrySelection);
      };

      const chooseEffort = (effort) => {
        if (current === null) return;
        if (effectiveEffort === effort) { close(true); return; }
        const selection = { provider: current.provider, model: current.model };
        if (effort !== undefined) selection.reasoningEffort = effort;
        submit(selection);
      };

      const drill = (next) => {
        setQuery("");
        setPane(next);
      };

      const back = () => setPane("model");

      const show = () => {
        setPane("model");
        setOpen(true);
        retry();
      };

      const focusableItems = () => itemRefs.current.filter((item) => item !== null && item !== undefined && item.disabled !== true);

      const moveFocus = (offset) => {
        const items = focusableItems();
        if (items.length === 0) return;
        const active = items.indexOf(document.activeElement);
        const index = active === -1 ? (offset > 0 ? 0 : items.length - 1) : (active + offset + items.length) % items.length;
        const item = items[index];
        if (item !== undefined && typeof item.focus === "function") item.focus();
      };

      const onKeyDown = (event) => {
        if (event.nativeEvent !== undefined && event.nativeEvent.isComposing === true) return;
        if (event.key === "Escape") {
          if (!open) return;
          event.preventDefault();
          if (pane === "effort" && currentChoice !== undefined) { back(); return; }
          if (query !== "") { setQuery(""); return; }
          close(true);
          return;
        }
        if (!open) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          moveFocus(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Home" || event.key === "End") {
          if (event.target === searchRef.current) return;
          event.preventDefault();
          const items = focusableItems();
          const item = event.key === "Home" ? items[0] : items[items.length - 1];
          if (item !== undefined && typeof item.focus === "function") item.focus();
        }
      };

      const onBlur = (event) => {
        const next = event.relatedTarget;
        if (typeof Node !== "undefined" && next instanceof Node) {
          if (rootRef.current !== null && rootRef.current.contains(next)) return;
          if (menuRef.current !== null && menuRef.current.contains(next)) return;
        }
        close(false);
      };

      // Outside mousedown closes the popup. The menu lives in a portal, so both
      // the trigger root and the menu element are checked.
      React.useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (rootRef.current !== null && rootRef.current.contains(target)) return;
          if (menuRef.current !== null && menuRef.current.contains(target)) return;
          close(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
      }, [open]);

      // Place the portaled menu above the trigger, clamped to the viewport, and
      // keep it there while the page scrolls or resizes.
      React.useLayoutEffect(() => {
        if (!open) { setMenuPos(null); return undefined; }
        const place = () => {
          const trigger = triggerRef.current;
          if (trigger === null) return;
          const rect = trigger.getBoundingClientRect();
          const menu = menuRef.current;
          const width = menu === null ? 0 : menu.offsetWidth;
          const height = menu === null ? 0 : menu.offsetHeight;
          const margin = 12;
          let left = rect.right - width;
          let top = rect.top - 8 - height;
          if (width > 0) left = Math.min(Math.max(left, margin), window.innerWidth - width - margin);
          if (height > 0) top = Math.min(Math.max(top, margin), window.innerHeight - height - margin);
          setMenuPos({ left, top });
        };
        place();
        window.addEventListener("scroll", place, true);
        window.addEventListener("resize", place);
        const observer = typeof ResizeObserver !== "undefined" && menuRef.current !== null ? new ResizeObserver(place) : null;
        if (observer !== null) observer.observe(menuRef.current);
        return () => {
          window.removeEventListener("scroll", place, true);
          window.removeEventListener("resize", place);
          if (observer !== null) observer.disconnect();
        };
      }, [open, pane, q, state]);

      // A fresh open surfaces the provider holding the current model, but only
      // when nothing is expanded yet: re-running on every open would keep every
      // provider the user ever compared open forever.
      React.useEffect(() => {
        if (!open) return;
        if (Object.values(expanded).some(Boolean)) return;
        if (current === null) return;
        if (!groups.some((group) => group.id === current.provider)) return;
        setExpanded((old) => old[current.provider] === true ? old : { ...old, [current.provider]: true });
      }, [open]);

      // Clearing the filter collapses back to the provider holding the current
      // model (selection never writes `expanded`, so this is the only reset).
      React.useEffect(() => {
        const previous = previousQuery.current;
        previousQuery.current = q;
        if (q !== "" || previous === "") return;
        if (current !== null && groups.some((group) => group.id === current.provider)) {
          setExpanded({ [current.provider]: true });
          return;
        }
        setExpanded({});
      }, [q]);

      // One initial directory load, guarded by a ref: `load` is a fresh closure
      // on every host render, so depending on it directly would refetch on each
      // keystroke.
      React.useEffect(() => {
        if (available !== true || loadedOnce.current) return;
        loadedOnce.current = true;
        retry();
      }, [available, load]);

      // A pinned effort the catalog no longer declares can only fail at request
      // time (UNSUPPORTED_REASONING_EFFORT). Repair the stored selection once,
      // to the model default / first declared level, before the next send.
      React.useEffect(() => {
        if (current === null || reasoning === undefined) return;
        if (current.reasoningEffort === undefined) return;
        if (reasoning.efforts.some((level) => level.id === current.reasoningEffort)) return;
        const fallback = supportedEffort(reasoning, undefined);
        if (fallback === current.reasoningEffort) return;
        const key = `${current.provider}\u0000${current.model}\u0000${current.reasoningEffort}\u0000${fallback}`;
        if (healedEffort.current === key) return;
        healedEffort.current = key;
        const selection = { provider: current.provider, model: current.model };
        if (fallback !== undefined) selection.reasoningEffort = fallback;
        Promise.resolve(select(selection)).catch(() => {});
      }, [current, reasoning, select]);

      // The host repairs an upstream-rejected effort by re-selecting the provider
      // default, so the store ends up disagreeing with what this seat submitted.
      // Surface that: the declaration — not the request — is what needs fixing.
      React.useEffect(() => {
        const submitted = submittedEffort.current;
        if (submitted === null || current === null) return;
        if (submitted.provider !== current.provider || submitted.model !== current.model) return;
        submittedEffort.current = null;
        if (submitted.effort === current.reasoningEffort) return;
        setNotice({ requested: submitted.effort, actual: current.reasoningEffort });
      }, [current]);

      // Opening focuses the search field, else the selected row, else the first row.
      React.useEffect(() => {
        if (!open) return;
        if (searchRef.current !== null) { searchRef.current.focus(); return; }
        const selected = menuRef.current === null ? null : menuRef.current.querySelector("[role=\"menuitemradio\"][aria-checked=\"true\"]:not([disabled])");
        if (selected !== null && typeof selected.focus === "function") { selected.focus(); return; }
        const first = focusableItems()[0];
        if (first !== undefined && typeof first.focus === "function") first.focus();
      }, [open]);

      if (available !== true) return null;

      itemRefs.current = [];
      let itemCursor = 0;
      const nextItem = () => {
        const at = itemCursor;
        itemCursor += 1;
        return (node) => { itemRefs.current[at] = node; };
      };

      // 0.2.2 catalogs may carry a badge ({ tone, text }) next to the model name;
      // render it in the same places the official seat does (before the name on
      // the trigger, after it in the menu), and run its text through the host
      // resolver when one is provided.
      const resolveCatalogText = (value) => typeof resolveText === "function" ? resolveText(value) : value;
      const labelFallback = (model, placement) => {
        const badge = model.badge;
        if (badge === null || badge === undefined || typeof badge.text !== "string") return model.name;
        const tag = h("span", { className: "dshma-badge", "data-tone": badge.tone }, resolveCatalogText(badge.text));
        return placement === "trigger"
          ? h("span", { className: "dshma-badged-name" }, tag, " ", h("span", null, model.name))
          : h("span", { className: "dshma-badged-name" }, h("span", null, model.name), " ", tag);
      };

      const renderLabel = (group, model, placement, selected) => h("span", { "data-provider-id": group.id, "data-model-id": model.id },
        typeof renderSlot === "function"
          ? renderSlot("conversation.input.model.label", { provider: group, model, placement, selected }, { fallback: labelFallback(model, placement) })
          : labelFallback(model, placement)
      );

      const triggerAria = currentChoice === undefined
        ? (loading ? tr("trigger.loading") : tr("trigger.selectAria"))
        : effortLabel === undefined
          ? tr("trigger.aria", { model: currentChoice.model.name })
          : tr("trigger.ariaEffort", { model: currentChoice.model.name, effort: effortLabel });

      const renderOption = (group, model) => {
        const selected = current !== null && current.provider === group.id && current.model === model.id;
        const effort = supportedEffort(model.reasoning, selected ? current.reasoningEffort : undefined);
        return h("button", {
          key: model.id,
          type: "button",
          role: "menuitemradio",
          "aria-checked": selected,
          className: `dshma-option${selected ? " dshma-option-selected" : ""}`,
          title: model.name,
          disabled: busy,
          ref: nextItem(),
          onClick: () => choose(group, model)
        },
          h("span", { className: "dshma-option-main" },
            h("span", { className: "dshma-option-name" }, renderLabel(group, model, "option", selected)),
            model.description === undefined ? null : h("span", { className: "dshma-option-desc" }, model.description)
          ),
          model.reasoning === undefined ? null : h("span", { className: "dshma-option-effort" }, effortName(model.reasoning, effort, tr("effort.providerDefault"))),
          selected ? h("span", { className: "dshma-check", "aria-hidden": "true" }, "✓") : null
        );
      };

      const renderProvider = (group) => {
        const isOpen = expanded[group.id] === true || q !== "";
        const providerName = group.id === "deepseek-account" ? tr("provider.account") : (group.name || group.id);
        return h("div", { className: "dshma-provider", key: group.id },
          h("button", {
            type: "button",
            className: "dshma-provider-head",
            "aria-expanded": isOpen,
            onClick: () => setExpanded((old) => ({ ...old, [group.id]: !isOpen }))
          },
            h(Chevron, { className: `dshma-provider-chevron${isOpen ? " dshma-provider-chevron-open" : ""}` }),
            h("span", { className: "dshma-provider-name" }, providerName),
            h("span", { className: "dshma-count" }, String(group.models.length))
          ),
          isOpen ? h("div", { className: "dshma-models", role: "group", "aria-label": providerName }, group.models.map((model) => renderOption(group, model))) : null
        );
      };

      const strips = [
        failure === null ? null : h("div", { className: "dshma-error", role: "alert", key: "failure" }, h("span", null, failure)),
        notice === null ? null : h("div", { className: "dshma-warning", role: "status", key: "effort-notice" },
          h("span", null, tr("notice.effortFallback", {
            requested: notice.requested === undefined ? tr("effort.providerDefault") : notice.requested,
            actual: notice.actual === undefined ? tr("effort.providerDefault") : notice.actual
          })),
          h("button", { type: "button", className: "dshma-retry", onClick: () => setNotice(null) }, tr("notice.dismiss"))
        ),
        state.error === null || state.error === undefined ? null : h("div", { className: "dshma-error", role: "alert", key: "catalog-error" },
          h("span", null, tr("error.action", { message: String(state.error) })),
          h("button", { type: "button", className: "dshma-retry", onClick: retry }, tr("action.reload"))
        ),
        ...(Array.isArray(state.failures) ? state.failures : []).map((item) => h("div", { className: "dshma-warning", role: "status", key: `failure-${item.id}` },
          h("span", null, tr("warning.groupLoad", { name: item.id === "deepseek-account" ? tr("provider.account") : item.name, message: item.message })),
          h("button", { type: "button", className: "dshma-retry", onClick: retry }, tr("action.reload"))
        )),
        loading ? h("div", { className: "dshma-status", key: "loading" }, tr("status.loading")) : null
      ];

      const modelPane = h("div", { className: "dshma-pane", key: "model" },
        reasoning === undefined ? null : h("button", {
          type: "button",
          role: "menuitem",
          className: "dshma-cell",
          onClick: () => drill("effort")
        },
          h("span", { className: "dshma-cell-label" }, tr("menu.effort")),
          h("span", { className: "dshma-cell-value" }, effortLabel === undefined ? tr("effort.providerDefault") : effortLabel),
          h(Chevron, { className: "dshma-cell-chevron" })
        ),
        visibleGroups.map((group) => renderProvider(group)),
        !loading && visibleGroups.length === 0 ? h("div", { className: "dshma-empty" }, q === "" ? tr("empty.models") : tr("search.empty")) : null
      );

      const effortPane = h("div", { className: "dshma-pane", key: "effort" },
        h("button", { type: "button", className: "dshma-back", onClick: back }, `← ${tr("effort.back")}`),
        reasoning === undefined
          ? h("div", { className: "dshma-empty" }, tr("empty.efforts"))
          : effortChoices.map((level) => h("button", {
            key: level.key,
            type: "button",
            role: "menuitemradio",
            "aria-checked": effectiveEffort === level.effort,
            className: `dshma-option${effectiveEffort === level.effort ? " dshma-option-selected" : ""}`,
            disabled: busy,
            ref: nextItem(),
            onClick: () => chooseEffort(level.effort)
          },
            h("span", { className: "dshma-option-main" }, h("span", { className: "dshma-option-name" }, level.label)),
            effectiveEffort === level.effort ? h("span", { className: "dshma-check", "aria-hidden": "true" }, "✓") : null
          ))
      );

      const menu = open && typeof document !== "undefined" ? ReactDOM.createPortal(
        h("div", {
          id: `${id}-menu`,
          ref: menuRef,
          className: "dshma-menu",
          role: "menu",
          "data-menu-material": "",
          "aria-label": tr("menu.aria"),
          "aria-busy": loading || busy,
          style: menuPos === null
            ? { position: "fixed", left: 0, top: 0, visibility: "hidden" }
            : { left: menuPos.left, top: menuPos.top }
        },
          h("div", { className: "dshma-search-wrap" },
            h("input", {
              ref: searchRef,
              type: "text",
              role: "searchbox",
              className: "dshma-search",
              placeholder: tr("search.placeholder"),
              "aria-label": tr("search.aria"),
              "aria-controls": `${id}-menu`,
              value: query,
              readOnly: busy,
              onChange: (event) => setQuery(event.target.value)
            }),
            query === "" ? null : h("button", {
              type: "button",
              className: "dshma-search-clear",
              "aria-label": tr("search.clear"),
              title: tr("search.clear"),
              disabled: busy,
              onClick: () => { setQuery(""); if (searchRef.current !== null) searchRef.current.focus(); }
            }, "✕")
          ),
          h("div", { className: "dshma-menu-body" }, strips, pane === "model" ? modelPane : effortPane)
        ),
        document.body
      ) : null;

      return h("div", { ref: rootRef, className: "dshma-root", onKeyDown, onBlur },
        h("button", {
          ref: triggerRef,
          type: "button",
          className: "dshma-trigger",
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-busy": busy,
          "aria-controls": open ? `${id}-menu` : undefined,
          "aria-label": triggerAria,
          title: triggerAria,
          disabled: locked === true,
          onClick: () => { if (open) close(true); else show(); }
        },
          h("span", { className: "dshma-trigger-label" },
            currentChoice === undefined
              ? (loading ? tr("trigger.loading") : current === null ? tr("trigger.fallback") : `${current.provider}/${current.model}`)
              : renderLabel(currentChoice.group, currentChoice.model, "trigger", true)
          ),
          effortLabel === undefined ? null : h("span", { className: "dshma-trigger-effort" }, effortLabel),
          busy ? h(Spinner, null) : h(Chevron, { className: `dshma-chevron${open ? " dshma-chevron-open" : ""}` })
        ),
        menu
      );
    }

    const inject = ["slots", "modelDirectories", "sessions", "locale"];

    function injectCss() {
      if (typeof document === "undefined") return () => {};
      const previous = document.querySelector("style[data-dshma-css]");
      if (previous !== null) previous.remove();
      const tag = document.createElement("style");
      tag.setAttribute("data-dshma-css", "1");
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return () => tag.remove();
    }

    function apply(ctx) {
      ctx.effect(injectCss, "dsh-model-accordion: styles");
      // Own dictionary, registered on the client locale service; the slot
      // registration below names it so the host binds the component's `t`.
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-model-accordion: dictionaries");
      ctx.slots.inject("conversation.input.model", () => ctx.slots.register({
        name: "conversation.input.model",
        priority: -1,
        locale: NS,
        // Same child seat the official picker declares: plugins that decorate the
        // model label (for example the official 1017 badge) contribute here, and
        // renderSlot() below renders them instead of dropping them.
        children: {
          "conversation.input.model.label": { kind: "single", scope: "session", inline: true }
        },
        inject: (sessionId) => {
          const directory = ctx.modelDirectories.directoryFor(sessionId);
          const available = ctx.sessions.subagentAddress(sessionId) === void 0;
          return {
            available,
            directory: directory.store,
            load: () => { if (available) directory.load().catch(() => {}); },
            select: (selection) => available ? directory.select(selection) : Promise.resolve(void 0)
          };
        }
      }, ModelAccordion));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
