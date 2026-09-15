// src/components/Accordion/Accordion.tsx
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Accordion as RBAccordion, Overlay, Tooltip } from "react-bootstrap";
import { jsx, jsxs } from "react/jsx-runtime";
var COPY_FEEDBACK_MS = 3e3;
var COLLAPSE_TRANSITION_MS = 350;
function headingId(baseId, index) {
  return `${baseId}-heading-${index}`;
}
function CopyLinkControl({ headingId: targetHeadingId }) {
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef(null);
  const timeoutRef = useRef(void 0);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  const handleClick = (event) => {
    event.preventDefault();
    if (!navigator.clipboard) {
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${targetHeadingId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    }).catch(() => {
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
    /* @__PURE__ */ jsxs("a", { ref: anchorRef, className: "az-accordion-anchor icon-link", href: `#${targetHeadingId}`, onClick: handleClick, children: [
      /* @__PURE__ */ jsx("span", { className: "material-symbols-rounded", "aria-hidden": "true", children: copied ? "check" : "link" }),
      /* @__PURE__ */ jsx("span", { children: "Copy link" })
    ] }),
    /* @__PURE__ */ jsx(Overlay, { target: anchorRef.current, show: copied, placement: "top", children: (overlayProps) => /* @__PURE__ */ jsx(Tooltip, { ...overlayProps, children: "Copied!" }) })
  ] });
}
var Accordion = forwardRef(function Accordion2(props, ref) {
  const { id = "accordion", items, flush = false, alwaysOpen = false, anchors = false, className } = props;
  const [activeKey, setActiveKey] = useState(() => {
    const openKeys = items.map((item, index) => item.defaultOpen ? String(index) : null).filter((key) => key !== null);
    return alwaysOpen ? openKeys : openKeys[0];
  });
  const openFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const index = items.findIndex((_item, itemIndex) => headingId(id, itemIndex) === hash);
    if (index === -1) {
      return;
    }
    const key = String(index);
    setActiveKey((current) => {
      if (!alwaysOpen) {
        return key;
      }
      const currentKeys = Array.isArray(current) ? current : [];
      return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
    });
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, COLLAPSE_TRANSITION_MS);
  }, [id, items, alwaysOpen]);
  useEffect(() => {
    if (!anchors) {
      return void 0;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [anchors]);
  return /* @__PURE__ */ jsx(RBAccordion, { ref, id, flush, alwaysOpen, activeKey, onSelect: setActiveKey, className, children: items.map((item, index) => /* @__PURE__ */ jsxs(RBAccordion.Item, { eventKey: String(index), children: [
    /* @__PURE__ */ jsx(RBAccordion.Header, { id: headingId(id, index), children: item.title }),
    /* @__PURE__ */ jsxs(RBAccordion.Body, { children: [
      item.content,
      anchors && /* @__PURE__ */ jsx(CopyLinkControl, { headingId: headingId(id, index) })
    ] })
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

// src/components/Nav/Nav.tsx
import { forwardRef as forwardRef3 } from "react";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx3(Fragment, { children: items.map((item, index) => /* @__PURE__ */ jsxs2("li", { className: "nav-item", children: [
    /* @__PURE__ */ jsx3(
      "a",
      {
        className: classNames("nav-link", item.active && "active", item.disabled && "disabled"),
        href: item.disabled ? void 0 : item.href ?? "#",
        "aria-current": item.active ? "page" : void 0,
        "aria-disabled": item.disabled ? "true" : void 0,
        children: item.label
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ jsx3("ul", { className: navClasses, children: /* @__PURE__ */ jsx3(NavItems, { items: item.items, navClasses }) })
  ] }, index)) });
}
var Nav = forwardRef3(function Nav2(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames("nav", variantClass(variant), vertical && "flex-column", fill && "nav-fill", justify && "nav-justified");
  return /* @__PURE__ */ jsx3("ul", { ref, className: classNames(navClasses, className), children: /* @__PURE__ */ jsx3(NavItems, { items, navClasses }) });
});

// src/components/Tabs/Tabs.tsx
import { Nav as RBNav, Tab as RBTab } from "react-bootstrap";
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function resolveActiveIndex(items, defaultActiveIndex) {
  if (defaultActiveIndex !== void 0) {
    return defaultActiveIndex;
  }
  const firstEnabled = items.findIndex((item) => !item.disabled);
  return firstEnabled === -1 ? 0 : firstEnabled;
}
function Tabs(props) {
  const { id = "tabs", items, variant = "tabs", vertical = false, fill = false, justify = false, className } = props;
  const activeIndex = resolveActiveIndex(items, props.defaultActiveIndex);
  const nav = /* @__PURE__ */ jsx4(
    RBNav,
    {
      variant,
      fill,
      justify,
      role: "tablist",
      className: [vertical && "flex-column", vertical && "me-3", className].filter(Boolean).join(" ") || void 0,
      "aria-orientation": vertical ? "vertical" : void 0,
      children: items.map((item, index) => /* @__PURE__ */ jsx4(RBNav.Link, { as: "button", type: "button", eventKey: String(index), disabled: item.disabled, children: item.title }, index))
    }
  );
  const panes = /* @__PURE__ */ jsx4(RBTab.Content, { children: items.map((item, index) => /* @__PURE__ */ jsx4(RBTab.Pane, { eventKey: String(index), children: item.content }, index)) });
  return /* @__PURE__ */ jsx4(RBTab.Container, { id, defaultActiveKey: String(activeIndex), children: vertical ? /* @__PURE__ */ jsxs3("div", { className: "d-flex align-items-start", children: [
    nav,
    panes
  ] }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
    nav,
    panes
  ] }) });
}
export {
  Accordion,
  Button,
  Nav,
  Tabs
};
//# sourceMappingURL=index.js.map