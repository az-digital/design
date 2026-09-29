"use strict";
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

// src/components/Nav/index.ts
var Nav_exports = {};
__export(Nav_exports, {
  Nav: () => Nav
});
module.exports = __toCommonJS(Nav_exports);

// src/components/Nav/Nav.tsx
var import_react = require("react");

// src/utils/classNames.ts
function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// src/components/Nav/Nav.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function variantClass(variant) {
  switch (variant) {
    case "tabs":
      return "nav-tabs";
    case "pills":
      return "nav-pills";
    case "underline":
      return "nav-underline";
    case "utility":
      return "nav-utility";
    default:
      return false;
  }
}
function NavItems({ items, navClasses }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "nav-item", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "a",
      {
        className: classNames("nav-link", item.active && "active", item.disabled && "disabled"),
        href: item.disabled ? void 0 : item.href ?? "#",
        "aria-current": item.active ? "page" : void 0,
        "aria-disabled": item.disabled ? "true" : void 0,
        children: item.label
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: navClasses, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItems, { items: item.items, navClasses }) })
  ] }, index)) });
}
var Nav = (0, import_react.forwardRef)(function Nav2(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames("nav", variantClass(variant), vertical && "flex-column", fill && "nav-fill", justify && "nav-justified");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { ref, className: classNames(navClasses, className), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItems, { items, navClasses }) });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Nav
});
//# sourceMappingURL=Nav.cjs.map