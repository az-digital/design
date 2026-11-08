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

// src/components/Cards/TitleOnImageCard.ts
var TitleOnImageCard_exports = {};
__export(TitleOnImageCard_exports, {
  TitleOnImageCard: () => TitleOnImageCard
});
module.exports = __toCommonJS(TitleOnImageCard_exports);

// src/components/Cards/Cards.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function TitleOnImageCard({ image, imageDescription = "", title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card border-0 hover overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ratio ratio-1x1 overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "card-img-top object-fit-cover hover-img-zoom-in", src: image, alt: imageDescription }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-img-overlay p-0 d-flex flex-column", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) }) })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TitleOnImageCard
});
//# sourceMappingURL=TitleOnImageCard.cjs.map