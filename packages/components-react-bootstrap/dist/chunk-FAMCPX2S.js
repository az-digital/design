// src/components/Cards/Cards.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function Card({ title, body, header = "", footer = "" }) {
  return /* @__PURE__ */ jsxs("div", { className: "card bg-cloud border-0", children: [
    header && /* @__PURE__ */ jsx("div", { className: "card-header", children: header }),
    /* @__PURE__ */ jsxs("div", { className: "card-body text-tinta", children: [
      /* @__PURE__ */ jsx("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
      /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: body } })
    ] }),
    footer && /* @__PURE__ */ jsx("div", { className: "card-footer", children: footer })
  ] });
}
function LinkedTitle({ title, link }) {
  return /* @__PURE__ */ jsx("h3", { className: "card-title h5 fw-bold mb-2", children: /* @__PURE__ */ jsx("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) });
}
function LinkCard({ title, text, link }) {
  return /* @__PURE__ */ jsx("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
    /* @__PURE__ */ jsx(LinkedTitle, { title, link }),
    /* @__PURE__ */ jsx("p", { className: "card-text", children: text })
  ] }) });
}
function IconCard({ icon, title, text, link }) {
  return /* @__PURE__ */ jsx("div", { className: "card bg-cloud hover", children: /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
    /* @__PURE__ */ jsx("span", { className: "card-icon material-symbols-rounded fw-light text-nowrap", style: { fontVariationSettings: "'FILL' 0" }, "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ jsx(LinkedTitle, { title, link }),
    /* @__PURE__ */ jsx("p", { className: "card-text", children: text })
  ] }) });
}
function ImageCard({ image, imageDescription = "", title, text, link }) {
  return /* @__PURE__ */ jsxs("div", { className: "card bg-cloud hover overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("img", { className: "card-img-top img-fluid hover-img-zoom-in", src: image, alt: imageDescription }) }),
    /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
      /* @__PURE__ */ jsx(LinkedTitle, { title, link }),
      /* @__PURE__ */ jsx("p", { className: "card-text", children: text })
    ] })
  ] });
}
function TitleOnImageCard({ image, imageDescription = "", title, link }) {
  return /* @__PURE__ */ jsx("div", { className: "card border-0 hover overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "ratio ratio-1x1 overflow-hidden", children: [
    /* @__PURE__ */ jsx("img", { className: "card-img-top object-fit-cover hover-img-zoom-in", src: image, alt: imageDescription }),
    /* @__PURE__ */ jsx("div", { className: "card-img-overlay p-0 d-flex flex-column", children: /* @__PURE__ */ jsx("h3", { className: "card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline", children: /* @__PURE__ */ jsx("a", { href: link, className: "stretched-link text-reset text-decoration-none", children: title }) }) })
  ] }) });
}
function QuickLinksCard({ title, text, links }) {
  return /* @__PURE__ */ jsx("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
    /* @__PURE__ */ jsx("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ jsx("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ jsx("ul", { className: "list-unstyled mb-0", children: (links ?? []).map(({ label, link }, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: link, className: "card-link text-azurite fw-semibold tk-proxima-nova-condensed", children: label }) }, `${link}-${index}`)) })
  ] }) });
}
function CallToActionCard({ title, text, button, buttonLink }) {
  return /* @__PURE__ */ jsx("div", { className: "card bg-cloud border-0", children: /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
    /* @__PURE__ */ jsx("h3", { className: "card-title h5 fw-bold mb-2 text-azurite", children: title }),
    /* @__PURE__ */ jsx("p", { className: "card-text text-tinta", children: text }),
    /* @__PURE__ */ jsx("a", { href: buttonLink, className: "btn btn-red stretched-link mt-3", children: button })
  ] }) });
}

export {
  Card,
  LinkCard,
  IconCard,
  ImageCard,
  TitleOnImageCard,
  QuickLinksCard,
  CallToActionCard
};
//# sourceMappingURL=chunk-FAMCPX2S.js.map