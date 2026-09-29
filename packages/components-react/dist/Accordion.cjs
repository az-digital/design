"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/Accordion/index.ts
var Accordion_exports = {};
__export(Accordion_exports, {
  Accordion: () => Accordion
});
module.exports = __toCommonJS(Accordion_exports);

// src/components/Accordion/Accordion.tsx
var import_react = require("react");
var import_react_bootstrap = require("react-bootstrap");
var import_jsx_runtime = require("react/jsx-runtime");
var COPY_FEEDBACK_MS = 3e3;
var COLLAPSE_TRANSITION_MS = 350;
function headingId(baseId, index) {
  return `${baseId}-heading-${index}`;
}
function CopyLinkControl({ headingId: targetHeadingId }) {
  const [copied, setCopied] = (0, import_react.useState)(false);
  const anchorRef = (0, import_react.useRef)(null);
  const timeoutRef = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => () => clearTimeout(timeoutRef.current), []);
  const handleClick = (event) => {
    event.preventDefault();
    if (!navigator.clipboard) {
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${targetHeadingId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    }).catch(() => {
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { ref: anchorRef, className: "az-accordion-anchor icon-link", href: `#${targetHeadingId}`, onClick: handleClick, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-rounded", "aria-hidden": "true", children: copied ? "check" : "link" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy link" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Overlay, { target: anchorRef.current, show: copied, placement: "top", children: (overlayProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Tooltip, { ...overlayProps, children: "Copied!" }) })
  ] });
}
var Accordion = (0, import_react.forwardRef)(function Accordion2(props, ref) {
  const { id = "accordion", items, flush = false, alwaysOpen = false, anchors = false, className } = props;
  const [activeKey, setActiveKey] = (0, import_react.useState)(() => {
    const openKeys = items.map((item, index) => item.defaultOpen ? String(index) : null).filter((key) => key !== null);
    return alwaysOpen ? openKeys : openKeys[0];
  });
  const openFromHash = (0, import_react.useCallback)(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const index = items.findIndex((_item, itemIndex) => headingId(id, itemIndex) === hash);
    if (index === -1) {
      return;
    }
    const key = String(index);
    setActiveKey((current) => {
      if (!alwaysOpen) {
        return key;
      }
      const currentKeys = Array.isArray(current) ? current : [];
      return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
    });
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, COLLAPSE_TRANSITION_MS);
  }, [id, items, alwaysOpen]);
  (0, import_react.useEffect)(() => {
    if (!anchors) {
      return void 0;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [anchors]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Accordion, { ref, id, flush, alwaysOpen, activeKey, onSelect: setActiveKey, className, children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_bootstrap.Accordion.Item, { eventKey: String(index), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Accordion.Header, { id: headingId(id, index), children: item.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_bootstrap.Accordion.Body, { children: [
      item.content,
      anchors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyLinkControl, { headingId: headingId(id, index) })
    ] })
  ] }, index)) });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion
});
//# sourceMappingURL=Accordion.cjs.map