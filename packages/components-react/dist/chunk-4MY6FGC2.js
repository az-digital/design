// src/components/Tabs/Tabs.tsx
import { Nav as RBNav, Tab as RBTab } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const nav = /* @__PURE__ */ jsx(
    RBNav,
    {
      variant,
      fill,
      justify,
      role: "tablist",
      className: [vertical && "flex-column", vertical && "me-3", className].filter(Boolean).join(" ") || void 0,
      "aria-orientation": vertical ? "vertical" : void 0,
      children: items.map((item, index) => /* @__PURE__ */ jsx(RBNav.Link, { as: "button", type: "button", eventKey: String(index), disabled: item.disabled, children: item.title }, index))
    }
  );
  const panes = /* @__PURE__ */ jsx(RBTab.Content, { children: items.map((item, index) => /* @__PURE__ */ jsx(RBTab.Pane, { eventKey: String(index), children: item.content }, index)) });
  return /* @__PURE__ */ jsx(RBTab.Container, { id, defaultActiveKey: String(activeIndex), children: vertical ? /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start", children: [
    nav,
    panes
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    nav,
    panes
  ] }) });
}

export {
  Tabs
};
//# sourceMappingURL=chunk-4MY6FGC2.js.map