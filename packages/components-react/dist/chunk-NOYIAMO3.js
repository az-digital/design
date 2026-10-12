// src/components/Card/Card.tsx
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Card = forwardRef(function Card2(props, ref) {
  const { header, image, icon, title, subtitle, text, links, footer, className } = props;
  return /* @__PURE__ */ jsxs("div", { ref, className: className ? `card ${className}` : "card", children: [
    header && /* @__PURE__ */ jsx("div", { className: "card-header", children: header }),
    image && /* @__PURE__ */ jsx("img", { src: image.src, className: "card-img-top", alt: image.alt }),
    /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
      icon && /* @__PURE__ */ jsx("img", { src: icon.src, className: "card-icon", alt: icon.alt }),
      title && /* @__PURE__ */ jsx("h5", { className: "card-title", children: title }),
      subtitle && /* @__PURE__ */ jsx("h6", { className: "card-subtitle mb-2 text-body-secondary", children: subtitle }),
      text && /* @__PURE__ */ jsx("p", { className: "card-text", children: text }),
      links && links.length > 0 && /* @__PURE__ */ jsx("div", { className: "card-links", children: links.map((link, index) => /* @__PURE__ */ jsx("a", { href: link.href ?? "#", className: "card-link", children: link.label }, index)) })
    ] }),
    footer && /* @__PURE__ */ jsx("div", { className: "card-footer", children: footer })
  ] });
});

export {
  Card
};
//# sourceMappingURL=chunk-NOYIAMO3.js.map