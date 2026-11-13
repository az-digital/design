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

// src/components/Cards/CallToActionCard.ts
var CallToActionCard_exports = {};
__export(CallToActionCard_exports, {
  CallToActionCard: () => CallToActionCard
});
module.exports = __toCommonJS(CallToActionCard_exports);

// src/components/Cards/Cards.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function CallToActionCard({ title, text, button, buttonLink }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: buttonLink, className: "btn btn-red stretched-link mt-3", children: button })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CallToActionCard
});
//# sourceMappingURL=CallToActionCard.cjs.map