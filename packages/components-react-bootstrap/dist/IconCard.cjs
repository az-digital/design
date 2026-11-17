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

// src/components/Cards/IconCard.ts
var IconCard_exports = {};
__export(IconCard_exports, {
  IconCard: () => IconCard
});
module.exports = __toCommonJS(IconCard_exports);

// src/components/Cards/Cards.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function LinkedTitle({ title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) });
}
function IconCard({ icon, title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "card-icon material-symbols-rounded fw-light text-nowrap", style: { fontVariationSettings: "'FILL' 0" }, "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedTitle, { title, link }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text", children: text })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IconCard
});
//# sourceMappingURL=IconCard.cjs.map