import type { SocialIcon } from './icons';

export type FooterLink = { label: string; href: string; icon?: SocialIcon };
export type FooterMenu = { heading: string; links: FooterLink[] };

/**
 * The University footer's links, as on Arizona Quickstart 3 sites (for
 * example president.arizona.edu). They're fixed University content, the same
 * on every site, so they aren't configurable. Twitter is listed as X, its
 * current name.
 */
export const utilityLinks: FooterLink[] = [
  { label: 'Employment', href: 'https://talent.arizona.edu/' },
  { label: 'Emergency Information', href: 'https://cirt.arizona.edu' },
  { label: 'Nondiscrimination', href: 'https://www.arizona.edu/nondiscrimination' },
  { label: 'Campus Safety', href: 'https://safety.arizona.edu' },
  { label: 'Copyright', href: 'https://www.arizona.edu/copyright' },
  { label: 'Campus Accessibility', href: 'https://www.arizona.edu/campus-accessibility' },
  { label: 'Contact Us', href: 'https://www.arizona.edu/contact-us' },
  { label: 'Feedback', href: 'https://www.arizona.edu/website-feedback' },
];

export const informationFor: FooterMenu = {
  heading: 'Information For',
  links: [
    { label: 'Future Students', href: 'https://www.arizona.edu/admissions' },
    { label: 'Current Students', href: 'https://www.arizona.edu/students' },
    { label: 'Faculty & Staff', href: 'https://www.arizona.edu/faculty-staff' },
    { label: 'Alumni & Donors', href: 'https://www.arizona.edu/alumni-donors' },
    { label: 'Parents & Visitors', href: 'https://www.arizona.edu/parents-visitors' },
    { label: 'Corporations & Businesses', href: 'https://corporate.arizona.edu' },
  ],
};

export const topics: FooterMenu = {
  heading: 'Topics',
  links: [
    { label: 'About the University', href: 'https://www.arizona.edu/about' },
    { label: 'Academics', href: 'https://www.arizona.edu/academics' },
    { label: 'Arts & Museums', href: 'https://www.arizona.edu/arts-museums' },
    { label: 'Athletics & Recreation', href: 'https://www.arizona.edu/athletics-recreation' },
    { label: 'Campus Store', href: 'https://shop.arizona.edu/' },
    { label: 'Colleges, Schools, Departments', href: 'https://www.arizona.edu/colleges-schools' },
    { label: 'Environment & Sustainability', href: 'https://www.environment.arizona.edu' },
    { label: 'International Engagement', href: 'https://international.arizona.edu' },
    { label: 'Health & Medical', href: 'https://healthsciences.arizona.edu/' },
    { label: 'Libraries', href: 'https://www.arizona.edu/libraries' },
    { label: 'Research & Innovation', href: 'https://research.arizona.edu' },
    { label: 'Purpose, Mission & Values', href: 'https://www.arizona.edu/purpose-mission-values' },
  ],
};

export const resources: FooterMenu = {
  heading: 'Resources',
  links: [
    { label: 'Directory', href: 'https://directory.arizona.edu' },
    { label: 'Calendars', href: 'https://www.arizona.edu/calendars-events' },
    { label: 'Campus Map', href: 'https://map.arizona.edu' },
    { label: 'News', href: 'https://news.arizona.edu' },
    { label: 'Phonebook', href: 'https://phonebook.arizona.edu' },
    { label: 'Weather', href: 'https://www.arizona.edu/weather' },
  ],
};

export const connect: FooterMenu = {
  heading: 'Connect',
  links: [
    { label: 'X, formerly Twitter', href: 'https://x.com/uarizona', icon: 'x' },
    { label: 'Instagram', href: 'https://instagram.com/uarizona', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com/uarizona', icon: 'facebook' },
    { label: 'LinkedIn', href: 'https://linkedin.com/edu/university-of-arizona-17783', icon: 'linkedin' },
    { label: 'YouTube', href: 'https://youtube.com/universityofarizona', icon: 'youtube' },
  ],
};

export const landAcknowledgment = {
  href: 'https://www.arizona.edu/university-arizona-land-acknowledgment',
  linkText: 'the University of Arizona is on the land and territories of Indigenous peoples',
};
