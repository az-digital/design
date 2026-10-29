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

// src/components/Card/index.ts
var Card_exports = {};
__export(Card_exports, {
  Card: () => Card
});
module.exports = __toCommonJS(Card_exports);

// src/components/Card/Card.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Card = (0, import_react.forwardRef)(function Card2(props, ref) {
  const { header, image, title, subtitle, text, links, footer, className } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref, className: className ? `card ${className}` : "card", children: [
    header && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-header", children: header }),
    image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: image.src, className: "card-img-top", alt: image.alt }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card-body", children: [
      title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", { className: "card-title", children: title }),
      subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", { className: "card-subtitle mb-2 text-body-secondary", children: subtitle }),
      text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "card-text", children: text }),
      links?.map((link, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link.href ?? "#", className: "card-link", children: link.label }, index))
    ] }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-footer", children: footer })
  ] });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Card
});
//# sourceMappingURL=Card.cjs.map