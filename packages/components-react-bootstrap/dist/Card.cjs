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

// src/components/Cards/Card.ts
var Card_exports = {};
__export(Card_exports, {
  Card: () => Card
});
module.exports = __toCommonJS(Card_exports);

// src/components/Cards/Cards.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Card({ title, body, header = "", footer = "" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card bg-cloud border-0", children: [
    header && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-header", children: header }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body text-tinta", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { dangerouslySetInnerHTML: { __html: body } })
    ] }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-footer", children: footer })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Card
});
//# sourceMappingURL=Card.cjs.map