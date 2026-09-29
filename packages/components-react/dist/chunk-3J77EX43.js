import {
  classNames
} from "./chunk-CLLYUIL6.js";

// src/components/Nav/Nav.tsx
import { forwardRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx(Fragment, { children: items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "nav-item", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        className: classNames("nav-link", item.active && "active", item.disabled && "disabled"),
        href: item.disabled ? void 0 : item.href ?? "#",
        "aria-current": item.active ? "page" : void 0,
        "aria-disabled": item.disabled ? "true" : void 0,
        children: item.label
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ jsx("ul", { className: navClasses, children: /* @__PURE__ */ jsx(NavItems, { items: item.items, navClasses }) })
  ] }, index)) });
}
var Nav = forwardRef(function Nav2(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames("nav", variantClass(variant), vertical && "flex-column", fill && "nav-fill", justify && "nav-justified");
  return /* @__PURE__ */ jsx("ul", { ref, className: classNames(navClasses, className), children: /* @__PURE__ */ jsx(NavItems, { items, navClasses }) });
});

export {
  Nav
};
//# sourceMappingURL=chunk-3J77EX43.js.map