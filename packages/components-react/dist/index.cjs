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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Accordion: () => Accordion,
  Button: () => Button,
  Nav: () => Nav,
  Tabs: () => Tabs
});
module.exports = __toCommonJS(index_exports);

// src/components/Accordion/Accordion.tsx
var import_react = require("react");
var import_react_bootstrap = require("react-bootstrap");
var import_jsx_runtime = require("react/jsx-runtime");
var COPY_FEEDBACK_MS = 3e3;
var COLLAPSE_TRANSITION_MS = 350;
function headingId(baseId, index) {
  return `${baseId}-heading-${index}`;
}
function CopyLinkControl({ headingId: targetHeadingId }) {
  const [copied, setCopied] = (0, import_react.useState)(false);
  const anchorRef = (0, import_react.useRef)(null);
  const timeoutRef = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => () => clearTimeout(timeoutRef.current), []);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { ref: anchorRef, className: "az-accordion-anchor icon-link", href: `#${targetHeadingId}`, onClick: handleClick, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "material-symbols-rounded", "aria-hidden": "true", children: copied ? "check" : "link" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy link" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Overlay, { target: anchorRef.current, show: copied, placement: "top", children: (overlayProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Tooltip, { ...overlayProps, children: "Copied!" }) })
  ] });
}
var Accordion = (0, import_react.forwardRef)(function Accordion2(props, ref) {
  const { id = "accordion", items, flush = false, alwaysOpen = false, anchors = false, className } = props;
  const [activeKey, setActiveKey] = (0, import_react.useState)(() => {
    const openKeys = items.map((item, index) => item.defaultOpen ? String(index) : null).filter((key) => key !== null);
    return alwaysOpen ? openKeys : openKeys[0];
  });
  const openFromHash = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
    if (!anchors) {
      return void 0;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [anchors]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Accordion, { ref, id, flush, alwaysOpen, activeKey, onSelect: setActiveKey, className, children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_bootstrap.Accordion.Item, { eventKey: String(index), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_bootstrap.Accordion.Header, { id: headingId(id, index), children: item.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_bootstrap.Accordion.Body, { children: [
      item.content,
      anchors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyLinkControl, { headingId: headingId(id, index) })
    ] })
  ] }, index)) });
});

// src/components/Button/Button.tsx
var import_react2 = require("react");

// src/utils/classNames.ts
function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// src/components/Button/Button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Button = (0, import_react2.forwardRef)(function Button2(props, ref) {
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
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { ref, type: "button", className: classes, disabled, children });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { className: "nav-item", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "a",
      {
        className: classNames("nav-link", item.active && "active", item.disabled && "disabled"),
        href: item.disabled ? void 0 : item.href ?? "#",
        "aria-current": item.active ? "page" : void 0,
        "aria-disabled": item.disabled ? "true" : void 0,
        children: item.label
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: navClasses, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(NavItems, { items: item.items, navClasses }) })
  ] }, index)) });
}
var Nav = (0, import_react3.forwardRef)(function Nav2(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames("nav", variantClass(variant), vertical && "flex-column", fill && "nav-fill", justify && "nav-justified");
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { ref, className: classNames(navClasses, className), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(NavItems, { items, navClasses }) });
});

// src/components/Tabs/Tabs.tsx
var import_react_bootstrap2 = require("react-bootstrap");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  const nav = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react_bootstrap2.Nav,
    {
      variant,
      fill,
      justify,
      role: "tablist",
      className: [vertical && "flex-column", vertical && "me-3", className].filter(Boolean).join(" ") || void 0,
      "aria-orientation": vertical ? "vertical" : void 0,
      children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_bootstrap2.Nav.Link, { as: "button", type: "button", eventKey: String(index), disabled: item.disabled, children: item.title }, index))
    }
  );
  const panes = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_bootstrap2.Tab.Content, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_bootstrap2.Tab.Pane, { eventKey: String(index), children: item.content }, index)) });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_bootstrap2.Tab.Container, { id, defaultActiveKey: String(activeIndex), children: vertical ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "d-flex align-items-start", children: [
    nav,
    panes
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    nav,
    panes
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  Button,
  Nav,
  Tabs
});
//# sourceMappingURL=index.cjs.map