// src/components/Accordion/Accordion.tsx
import { forwardRef } from "react";
import { Accordion as RBAccordion } from "react-bootstrap";
import { jsx, jsxs } from "react/jsx-runtime";
var Accordion = forwardRef(function Accordion2(props, ref) {
  const { id = "accordion", items, flush = false, alwaysOpen = false, className } = props;
  const openKeys = items.map((item, index) => item.defaultOpen ? String(index) : null).filter((key) => key !== null);
  return /* @__PURE__ */ jsx(RBAccordion, { ref, id, flush, alwaysOpen, defaultActiveKey: alwaysOpen ? openKeys : openKeys[0], className, children: items.map((item, index) => /* @__PURE__ */ jsxs(RBAccordion.Item, { eventKey: String(index), children: [
    /* @__PURE__ */ jsx(RBAccordion.Header, { children: item.title }),
    /* @__PURE__ */ jsx(RBAccordion.Body, { children: item.content })
  ] }, index)) });
});

// src/components/Button/Button.tsx
import { forwardRef as forwardRef2 } from "react";

// src/utils/classNames.ts
function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// src/components/Button/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Button = forwardRef2(function Button2(props, ref) {
  const { htmlTag = "a", href = "#", style = "solid", color = "red", size, disabled = false, active = false, className, children } = props;
  const classes = classNames(
    "btn",
    style === "link" ? "btn-link" : style === "outline" ? `btn-outline-${color}` : `btn-${color}`,
    size && `btn-${size}`,
    disabled && htmlTag === "a" && "disabled",
    active && "active",
    className
  );
  if (htmlTag === "button") {
    return /* @__PURE__ */ jsx2("button", { ref, type: "button", className: classes, disabled, children });
  }
  return /* @__PURE__ */ jsx2(
    "a",
    {
      ref,
      href,
      role: "button",
      className: classes,
      "aria-disabled": disabled ? "true" : void 0,
      tabIndex: disabled ? -1 : void 0,
      children
    }
  );
});
export {
  Accordion,
  Button
};
//# sourceMappingURL=index.js.map