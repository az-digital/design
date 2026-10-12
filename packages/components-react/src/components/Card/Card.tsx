import { forwardRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderCard` so the
 * two implementations can be shown side by side from the same story args,
 * except `header`/`text`/`footer`, which accept a `ReactNode` here instead
 * of a plain string.
 */
export type CardLinkProps = {
  /** Link label text. */
  label: string;
  /** Link URL. Defaults to `#`. */
  href?: string;
};

export type CardProps = {
  /** Optional header, shown above everything else. */
  header?: ReactNode;
  /** Optional image cap (`.card-img-top`), shown below the header (if any) and above the body. */
  image?: {
    src: string;
    alt: string;
  };
  /** Optional icon (`.card-icon`), shown at the top of the body above the title. Leave `alt` empty when the icon is decorative. */
  icon?: {
    src: string;
    alt: string;
  };
  /** Card title, rendered as an `<h5 class="card-title">`. */
  title?: string;
  /** Card subtitle, rendered as an `<h6 class="card-subtitle">` directly beneath the title. */
  subtitle?: string;
  /** Body text. */
  text?: ReactNode;
  /** Links rendered at the end of the body, grouped in a `.card-links` stack, each as its own `.card-link`. */
  links?: CardLinkProps[];
  /** Optional footer, shown below everything else. */
  footer?: ReactNode;
  className?: string;
};

/**
 * Arizona Digital card. Purely presentational — Bootstrap's card has no
 * JavaScript behavior of its own (unlike Accordion/Tabs), so this is
 * hand-rolled rather than wrapping `react-bootstrap`; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const { header, image, icon, title, subtitle, text, links, footer, className } = props;

  return (
    <div ref={ref} className={className ? `card ${className}` : 'card'}>
      {header && <div className="card-header">{header}</div>}
      {image && <img src={image.src} className="card-img-top" alt={image.alt} />}
      <div className="card-body">
        {icon && <img src={icon.src} className="card-icon" alt={icon.alt} />}
        {title && <h5 className="card-title">{title}</h5>}
        {subtitle && <h6 className="card-subtitle mb-2 text-body-secondary">{subtitle}</h6>}
        {text && <p className="card-text">{text}</p>}
        {links && links.length > 0 && (
          <div className="card-links">
            {links.map((link, index) => (
              <a href={link.href ?? '#'} className="card-link" key={index}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
});
