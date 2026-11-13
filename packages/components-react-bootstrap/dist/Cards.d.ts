import * as react from 'react';

type CardProps = {
    title: string;
    /** Rich-text HTML for the body. The caller must sanitize it before passing it. */
    body: string;
    header?: string;
    footer?: string;
};
declare function Card({ title, body, header, footer }: CardProps): react.JSX.Element;
type LinkCardProps = {
    title: string;
    text: string;
    link: string;
};
type IconCardProps = LinkCardProps & {
    icon: string;
};
type ImageCardProps = LinkCardProps & {
    image: string;
    imageDescription?: string;
};
type TitleOnImageCardProps = {
    image: string;
    imageDescription?: string;
    title: string;
    link: string;
};
type QuickLink = {
    label: string;
    link: string;
};
type QuickLinksCardProps = {
    title: string;
    text: string;
    links: QuickLink[];
};
type CallToActionCardProps = {
    title: string;
    text: string;
    button: string;
    buttonLink: string;
};
declare function LinkCard({ title, text, link }: LinkCardProps): react.JSX.Element;
declare function IconCard({ icon, title, text, link }: IconCardProps): react.JSX.Element;
declare function ImageCard({ image, imageDescription, title, text, link }: ImageCardProps): react.JSX.Element;
declare function TitleOnImageCard({ image, imageDescription, title, link }: TitleOnImageCardProps): react.JSX.Element;
declare function QuickLinksCard({ title, text, links }: QuickLinksCardProps): react.JSX.Element;
declare function CallToActionCard({ title, text, button, buttonLink }: CallToActionCardProps): react.JSX.Element;

export { CallToActionCard, type CallToActionCardProps, Card, type CardProps, IconCard, type IconCardProps, ImageCard, type ImageCardProps, LinkCard, type LinkCardProps, type QuickLink, QuickLinksCard, type QuickLinksCardProps, TitleOnImageCard, type TitleOnImageCardProps };
