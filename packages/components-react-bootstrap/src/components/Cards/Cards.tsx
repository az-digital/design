export type CardProps = {
  title: string;
  /** Rich-text HTML for the body. The caller must sanitize it before passing it. */
  body: string;
  header?: string;
  footer?: string;
};

export function Card({ title, body, header = '', footer = '' }: CardProps) {
  return (
    <div className="card bg-cloud border-0">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body text-tinta">
        <h3 className="card-title h5 fw-bold mb-2 text-azurite">{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

export type LinkCardProps = { title: string; text: string; link: string };
export type IconCardProps = LinkCardProps & { icon: string };
export type ImageCardProps = LinkCardProps & { image: string; imageDescription?: string };
export type TitleOnImageCardProps = { image: string; imageDescription?: string; title: string; link: string };
export type QuickLink = { label: string; link: string };
export type QuickLinksCardProps = { title: string; text: string; links: QuickLink[] };
export type CallToActionCardProps = { title: string; text: string; button: string; buttonLink: string };

function LinkedTitle({ title, link }: Pick<LinkCardProps, 'title' | 'link'>) {
  return <h3 className="card-title h5 fw-bold mb-2"><a href={link} className="stretched-link text-reset text-decoration-none">{title}</a></h3>;
}

export function LinkCard({ title, text, link }: LinkCardProps) {
  return <div className="card bg-cloud hover"><div className="card-body"><LinkedTitle title={title} link={link} /><p className="card-text">{text}</p></div></div>;
}

export function IconCard({ icon, title, text, link }: IconCardProps) {
  return (
    <div className="card bg-cloud hover">
      <div className="card-body">
        <span className="card-icon material-symbols-rounded fw-light text-nowrap" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">{icon}</span>
        <LinkedTitle title={title} link={link} />
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
}

export function ImageCard({ image, imageDescription = '', title, text, link }: ImageCardProps) {
  return (
    <div className="card bg-cloud hover overflow-hidden">
      <div className="overflow-hidden"><img className="card-img-top img-fluid hover-img-zoom-in" src={image} alt={imageDescription} /></div>
      <div className="card-body"><LinkedTitle title={title} link={link} /><p className="card-text">{text}</p></div>
    </div>
  );
}

export function TitleOnImageCard({ image, imageDescription = '', title, link }: TitleOnImageCardProps) {
  return (
    <div className="card border-0 hover overflow-hidden">
      <div className="ratio ratio-1x1 overflow-hidden">
        <img className="card-img-top object-fit-cover hover-img-zoom-in" src={image} alt={imageDescription} />
        <div className="card-img-overlay p-0 d-flex flex-column">
          <h3 className="card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline">
            <a href={link} className="stretched-link text-reset text-decoration-none">{title}</a>
          </h3>
        </div>
      </div>
    </div>
  );
}

export function QuickLinksCard({ title, text, links }: QuickLinksCardProps) {
  return (
    <div className="card bg-cloud border-0">
      <div className="card-body">
        <h3 className="card-title h5 fw-bold mb-2 text-azurite">{title}</h3>
        <p className="card-text text-tinta">{text}</p>
        <ul className="list-unstyled mb-0">
          {(links ?? []).map(({ label, link }, index) => <li key={`${link}-${index}`}><a href={link} className="card-link text-azurite fw-semibold tk-proxima-nova-condensed">{label}</a></li>)}
        </ul>
      </div>
    </div>
  );
}

export function CallToActionCard({ title, text, button, buttonLink }: CallToActionCardProps) {
  return (
    <div className="card bg-cloud border-0">
      <div className="card-body">
        <h3 className="card-title h5 fw-bold mb-2 text-azurite">{title}</h3>
        <p className="card-text text-tinta">{text}</p>
        <a href={buttonLink} className="btn btn-red stretched-link mt-3">{button}</a>
      </div>
    </div>
  );
}
