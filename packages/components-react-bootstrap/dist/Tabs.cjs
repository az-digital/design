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

// src/components/Tabs/index.ts
var Tabs_exports = {};
__export(Tabs_exports, {
  Tabs: () => Tabs
});
module.exports = __toCommonJS(Tabs_exports);

// src/components/Tabs/Tabs.tsx
var import_react_bootstrap = require("react-bootstrap");
var import_jsx_runtime = require("react/jsx-runtime");
function resolveActiveIndex(items, defaultActiveIndex) {
  if (defaultActiveIndex !== void 0) {
    return defaultActiveIndex;
  }
  const firstEnabled = items.findIndex((item) => !item.disabled);
  return firstEnabled === -1 ? 0 : firstEnabled;
}
function Tabs(props) {
  const { id = "tabs", items, variant = "tabs", vertical = false, fill = false, justify = false, className } = props;
  const activeIndex = resolveActiveIndex(items, props.defaultActiveIndex);
  const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_bootstrap.Nav,
    {
      variant,
      fill,
      justify,
      role: "tablist",
      className: [vertical && "flex-column", vertical && "me-3", className].filter(Boolean).join(" ") || void 0,
      "aria-orientation": vertical ? "vertical" : void 0,
      children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Nav.Link, { as: "button", type: "button", eventKey: String(index), disabled: item.disabled, children: item.title }, index))
    }
  );
  const panes = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Tab.Content, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Tab.Pane, { eventKey: String(index), children: item.content }, index)) });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Tab.Container, { id, defaultActiveKey: String(activeIndex), children: vertical ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "d-flex align-items-start", children: [
    nav,
    panes
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    nav,
    panes
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tabs
});
//# sourceMappingURL=Tabs.cjs.map