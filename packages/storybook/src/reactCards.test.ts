import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  CallToActionCard,
  Card,
  IconCard,
  ImageCard,
  LinkCard,
  QuickLinksCard,
  TitleOnImageCard,
} from '../../components-react-bootstrap/src/components/Cards';

describe('React cards', () => {
  it('renders the plain card body and optional header and footer', () => {
    const markup = renderToStaticMarkup(createElement(Card, {
      title: 'Office hours',
      body: '<p>Welcome</p><ul><li>Monday</li></ul>',
      header: 'Header',
      footer: 'Footer',
    }));
    expect(markup).toContain('<div class="card-header">Header</div>');
    expect(markup).toContain('<p>Welcome</p><ul><li>Monday</li></ul>');
    expect(markup).toContain('<div class="card-footer">Footer</div>');
  });

  it('escapes text and renders a single stretched link', () => {
    const markup = renderToStaticMarkup(createElement(LinkCard, {
      title: '<title>',
      text: 'Some & text',
      link: '/page',
    }));
    expect(markup).toContain('&lt;title&gt;');
    expect(markup).toContain('Some &amp; text');
    expect(markup).toContain('href="/page" class="stretched-link');
    expect(markup.match(/<a /g)).toHaveLength(1);
  });

  it('hides the decorative icon from assistive technology', () => {
    const markup = renderToStaticMarkup(createElement(IconCard, {
      icon: 'school', title: 'Students', text: 'Learn more', link: '/students',
    }));
    expect(markup).toContain('aria-hidden="true">school</span>');
  });

  it('renders images with the requested descriptions', () => {
    const imageCard = renderToStaticMarkup(createElement(ImageCard, {
      image: '/wide.jpg', imageDescription: 'Campus', title: 'Visit', text: 'See campus', link: '/visit',
    }));
    const titleCard = renderToStaticMarkup(createElement(TitleOnImageCard, {
      image: '/square.jpg', title: 'Visit', link: '/visit',
    }));
    expect(imageCard).toContain('src="/wide.jpg" alt="Campus"');
    expect(titleCard).toContain('src="/square.jpg" alt=""');
    expect(titleCard).toContain('href="/visit" class="stretched-link');
  });

  it('renders independent quick links and one stretched action', () => {
    const links = renderToStaticMarkup(createElement(QuickLinksCard, {
      title: 'Resources', text: 'Find help', links: [{ label: 'Advising', link: '/advising' }, { label: 'Catalog', link: '/catalog' }],
    }));
    const action = renderToStaticMarkup(createElement(CallToActionCard, {
      title: 'Newsletter', text: 'Get updates', button: 'Subscribe', buttonLink: '/subscribe',
    }));
    expect(links.match(/<a /g)).toHaveLength(2);
    expect(links).toContain('href="/advising"');
    expect(links).not.toContain('stretched-link');
    expect(action).toContain('href="/subscribe" class="btn btn-red stretched-link');
    expect(action.match(/<a /g)).toHaveLength(1);
  });
});
