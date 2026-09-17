import {
  classNames
} from "./chunk-CLLYUIL6.js";

// src/components/ArizonaHeader/ArizonaHeader.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var ArizonaHeader = forwardRef(function ArizonaHeader2(props, ref) {
  const { variant = "blue", fixedOnMobile = false, id = "header_arizona", className } = props;
  return /* @__PURE__ */ jsx("div", { ref, className: classNames("arizona-header", fixedOnMobile && "az-fixed-header-on-mobile", variant === "red" ? "bg-red" : "bg-blue", className), id, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row", children: /* @__PURE__ */ jsx("a", { className: "arizona-logo col-auto", href: "https://www.arizona.edu", title: "The University of Arizona homepage", children: /* @__PURE__ */ jsx(
    "img",
    {
      className: "arizona-line-logo",
      alt: "The University of Arizona Wordmark Line Logo White",
      src: "https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg",
      fetchPriority: "high"
    }
  ) }) }) }) });
});

export {
  ArizonaHeader
};
//# sourceMappingURL=chunk-UH7SW5A5.js.map