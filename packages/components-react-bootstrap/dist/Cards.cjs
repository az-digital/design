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

// src/components/Cards/index.ts
var Cards_exports = {};
__export(Cards_exports, {
  CallToActionCard: () => CallToActionCard,
  Card: () => Card,
  IconCard: () => IconCard,
  ImageCard: () => ImageCard,
  LinkCard: () => LinkCard,
  QuickLinksCard: () => QuickLinksCard,
  TitleOnImageCard: () => TitleOnImageCard
});
module.exports = __toCommonJS(Cards_exports);

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
function LinkedTitle({ title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) });
}
function LinkCard({ title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedTitle, { title, link }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text", children: text })
  ] }) });
}
function IconCard({ icon, title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "card-icon material-symbols-rounded fw-light text-nowrap", style: { fontVariationSettings: "'FILL' 0" }, "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedTitle, { title, link }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text", children: text })
  ] }) });
}
function ImageCard({ image, imageDescription = "", title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card bg-cloud hover overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "card-img-top img-fluid hover-img-zoom-in", src: image, alt: imageDescription }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedTitle, { title, link }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text", children: text })
    ] })
  ] });
}
function TitleOnImageCard({ image, imageDescription = "", title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card border-0 hover overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ratio ratio-1x1 overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "card-img-top object-fit-cover hover-img-zoom-in", src: image, alt: imageDescription }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-img-overlay p-0 d-flex flex-column", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) }) })
  ] }) });
}
function QuickLinksCard({ title, text, links }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "list-unstyled mb-0", children: (links ?? []).map(({ label, link }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link, className: "card-link text-azurite fw-semibold tk-proxima-nova-condensed", children: label }) }, `${link}-${index}`)) })
  ] }) });
}
function CallToActionCard({ title, text, button, buttonLink }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: buttonLink, className: "btn btn-red stretched-link mt-3", children: button })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CallToActionCard,
  Card,
  IconCard,
  ImageCard,
  LinkCard,
  QuickLinksCard,
  TitleOnImageCard
});
//# sourceMappingURL=Cards.cjs.map