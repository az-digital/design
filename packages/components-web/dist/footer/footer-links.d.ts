import type { SocialIcon } from './icons';
export type FooterLink = {
    label: string;
    href: string;
    icon?: SocialIcon;
};
export type FooterMenu = {
    heading: string;
    links: FooterLink[];
};
/**
 * The University footer's links, as on Arizona Quickstart 3 sites (for
 * example president.arizona.edu). They're fixed University content, the same
 * on every site, so they aren't configurable. Twitter is listed as X, its
 * current name.
 */
export declare const utilityLinks: FooterLink[];
export declare const informationFor: FooterMenu;
export declare const topics: FooterMenu;
export declare const resources: FooterMenu;
export declare const connect: FooterMenu;
export declare const landAcknowledgment: {
    href: string;
    linkText: string;
};
