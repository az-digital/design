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

export {
  Accordion
};
//# sourceMappingURL=chunk-OKZAS3X2.js.map