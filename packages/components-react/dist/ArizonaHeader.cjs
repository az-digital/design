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

// src/components/ArizonaHeader/index.ts
var ArizonaHeader_exports = {};
__export(ArizonaHeader_exports, {
  ArizonaHeader: () => ArizonaHeader
});
module.exports = __toCommonJS(ArizonaHeader_exports);

// src/components/ArizonaHeader/ArizonaHeader.tsx
var import_react = require("react");

// src/utils/classNames.ts
function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// src/components/ArizonaHeader/ArizonaHeader.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ArizonaHeader = (0, import_react.forwardRef)(function ArizonaHeader2(props, ref) {
  const { variant = "blue", fixedOnMobile = false, id = "header_arizona", className } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: classNames("arizona-header", fixedOnMobile && "az-fixed-header-on-mobile", variant === "red" ? "bg-red" : "bg-blue", className), id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "arizona-logo col-auto", href: "https://www.arizona.edu", title: "The University of Arizona homepage", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "img",
    {
      className: "arizona-line-logo",
      alt: "The University of Arizona Wordmark Line Logo White",
      src: "https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg",
      fetchPriority: "high"
    }
  ) }) }) }) });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArizonaHeader
});
//# sourceMappingURL=ArizonaHeader.cjs.map