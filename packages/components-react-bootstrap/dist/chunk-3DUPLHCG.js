import {
  classNames
} from "./chunk-CLLYUIL6.js";

// src/components/ArizonaHeader/ArizonaHeader.tsx
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var HeaderButton = ({ icon, label }) => /* @__PURE__ */ jsxs("button", { type: "button", className: "btn btn-arizona-header", children: [
  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "icon material-symbols-rounded", children: icon }),
  /* @__PURE__ */ jsx("span", { className: "icon-text", children: label })
] });
var ArizonaHeader = forwardRef(function ArizonaHeader2(props, ref) {
  const { variant = "blue", fixedOnMobile = false, id = "header_arizona", headerButtons = false, className } = props;
  return /* @__PURE__ */ jsx("div", { ref, className: classNames("arizona-header", fixedOnMobile && "az-fixed-header-on-mobile", variant === "red" ? "bg-red" : "bg-blue", className), id, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
    /* @__PURE__ */ jsx("a", { className: "arizona-logo col-auto", href: "https://www.arizona.edu", title: "The University of Arizona homepage", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: "arizona-line-logo",
        alt: "The University of Arizona Wordmark Line Logo White",
        src: "https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg",
        fetchPriority: "high"
      }
    ) }),
    headerButtons && /* @__PURE__ */ jsxs("div", { className: "d-flex col-auto px-0", children: [
      /* @__PURE__ */ jsx(HeaderButton, { icon: "search", label: "Search" }),
      /* @__PURE__ */ jsx(HeaderButton, { icon: "menu", label: "Menu" })
    ] })
  ] }) }) });
});

export {
  ArizonaHeader
};
//# sourceMappingURL=chunk-3DUPLHCG.js.map