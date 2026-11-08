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
var src_exports = {};
__export(src_exports, {
  Accordion: () => Accordion,
  ArizonaHeader: () => ArizonaHeader,
  Button: () => Button,
  CallToActionCard: () => CallToActionCard,
  Card: () => Card,
  IconCard: () => IconCard,
  ImageCard: () => ImageCard,
  LinkCard: () => LinkCard,
  Nav: () => Nav,
  QuickLinksCard: () => QuickLinksCard,
  Tabs: () => Tabs,
  TitleOnImageCard: () => TitleOnImageCard
});
module.exports = __toCommonJS(src_exports);

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

// src/components/ArizonaHeader/ArizonaHeader.tsx
var import_react2 = require("react");

// src/utils/classNames.ts
function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// src/components/ArizonaHeader/ArizonaHeader.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var HeaderButton = ({ icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "btn btn-arizona-header", children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { "aria-hidden": "true", className: "icon material-symbols-rounded", children: icon }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "icon-text", children: label })
] });
var ArizonaHeader = (0, import_react2.forwardRef)(function ArizonaHeader2(props, ref) {
  const { variant = "blue", fixedOnMobile = false, id = "header_arizona", headerButtons = false, className } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref, className: classNames("arizona-header", fixedOnMobile && "az-fixed-header-on-mobile", variant === "red" ? "bg-red" : "bg-blue", className), id, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { className: "arizona-logo col-auto", href: "https://www.arizona.edu", title: "The University of Arizona homepage", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "img",
      {
        className: "arizona-line-logo",
        alt: "The University of Arizona Wordmark Line Logo White",
        src: "https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg",
        fetchPriority: "high"
      }
    ) }),
    headerButtons && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "d-flex col-auto px-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HeaderButton, { icon: "search", label: "Search" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HeaderButton, { icon: "menu", label: "Menu" })
    ] })
  ] }) }) });
});

// src/components/Button/Button.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var Button = (0, import_react3.forwardRef)(function Button2(props, ref) {
  const { htmlTag = "a", href = "#", style = "solid", color = "red", size, disabled = false, active = false, className, children } = props;
  const bootstrapColor = color === "rain" ? "sky" : color;
  const classes = classNames(
    "btn",
    style === "link" ? "btn-link" : style === "outline" ? `btn-outline-${bootstrapColor}` : `btn-${bootstrapColor}`,
    size && `btn-${size}`,
    disabled && htmlTag === "a" && "disabled",
    active && "active",
    className
  );
  if (htmlTag === "button") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { ref, type: "button", className: classes, disabled, children });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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

// src/components/Cards/Cards.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function Card({ title, body, header = "", footer = "" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card bg-cloud border-0", children: [
    header && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card-header", children: header }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body text-tinta", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { dangerouslySetInnerHTML: { __html: body } })
    ] }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card-footer", children: footer })
  ] });
}
function LinkedTitle({ title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "card-title h5 fw-bold mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) });
}
function LinkCard({ title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LinkedTitle, { title, link }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "card-text", children: text })
  ] }) });
}
function IconCard({ icon, title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "card-icon material-symbols-rounded fw-light text-nowrap", style: { fontVariationSettings: "'FILL' 0" }, "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LinkedTitle, { title, link }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "card-text", children: text })
  ] }) });
}
function ImageCard({ image, imageDescription = "", title, text, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card bg-cloud hover overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { className: "card-img-top img-fluid hover-img-zoom-in", src: image, alt: imageDescription }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LinkedTitle, { title, link }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "card-text", children: text })
    ] })
  ] });
}
function TitleOnImageCard({ image, imageDescription = "", title, link }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card border-0 hover overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "ratio ratio-1x1 overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { className: "card-img-top object-fit-cover hover-img-zoom-in", src: image, alt: imageDescription }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card-img-overlay p-0 d-flex flex-column", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) }) })
  ] }) });
}
function QuickLinksCard({ title, text, links }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { className: "list-unstyled mb-0", children: (links ?? []).map(({ label, link }, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: link, className: "card-link text-azurite fw-semibold tk-proxima-nova-condensed", children: label }) }, `${link}-${index}`)) })
  ] }) });
}
function CallToActionCard({ title, text, button, buttonLink }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "card-body", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: buttonLink, className: "btn btn-red stretched-link mt-3", children: button })
  ] }) });
}

// src/components/Nav/Nav.tsx
var import_react4 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("li", { className: "nav-item", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "a",
      {
        className: classNames("nav-link", item.active && "active", item.disabled && "disabled"),
        href: item.disabled ? void 0 : item.href ?? "#",
        "aria-current": item.active ? "page" : void 0,
        "aria-disabled": item.disabled ? "true" : void 0,
        children: item.label
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: navClasses, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NavItems, { items: item.items, navClasses }) })
  ] }, index)) });
}
var Nav = (0, import_react4.forwardRef)(function Nav2(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames("nav", variantClass(variant), vertical && "flex-column", fill && "nav-fill", justify && "nav-justified");
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { ref, className: classNames(navClasses, className), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NavItems, { items, navClasses }) });
});

// src/components/Tabs/Tabs.tsx
var import_react_bootstrap2 = require("react-bootstrap");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const nav = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react_bootstrap2.Nav,
    {
      variant,
      fill,
      justify,
      role: "tablist",
      className: [vertical && "flex-column", vertical && "me-3", className].filter(Boolean).join(" ") || void 0,
      "aria-orientation": vertical ? "vertical" : void 0,
      children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_bootstrap2.Nav.Link, { as: "button", type: "button", eventKey: String(index), disabled: item.disabled, children: item.title }, index))
    }
  );
  const panes = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_bootstrap2.Tab.Content, { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_bootstrap2.Tab.Pane, { eventKey: String(index), children: item.content }, index)) });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_bootstrap2.Tab.Container, { id, defaultActiveKey: String(activeIndex), children: vertical ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "d-flex align-items-start", children: [
    nav,
    panes
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    nav,
    panes
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  ArizonaHeader,
  Button,
  CallToActionCard,
  Card,
  IconCard,
  ImageCard,
  LinkCard,
  Nav,
  QuickLinksCard,
  Tabs,
  TitleOnImageCard
});
//# sourceMappingURL=index.cjs.map