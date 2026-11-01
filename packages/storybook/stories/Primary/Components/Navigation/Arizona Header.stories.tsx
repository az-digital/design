import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing the
// header as it ships today, with the markup from its Arizona Header docs. The
// controls choose the header's color and whether it has header buttons. Focus
// comes from the keyboard.

// Each color's class. Red is the original header, being retired.
const colors = { Blue: 'bg-blue', Red: 'bg-red' } as const;

type ArizonaHeaderArgs = {
  Color: keyof typeof colors;
  'Header buttons': boolean;
};

const headerButton = (icon: string, label: string) => (
  <button type="button" className="btn btn-arizona-header">
    <span aria-hidden="true" className="icon material-symbols-rounded">
      {icon}
    </span>
    <span className="icon-text">{label}</span>
  </button>
);

const meta = {
  title: 'Primary/Components/Navigation/Arizona Header',
  args: {
    Color: 'Blue',
    'Header buttons': true,
  },
  argTypes: {
    Color: { control: 'inline-radio', options: Object.keys(colors) },
    'Header buttons': { control: 'boolean' },
  },
  render: (args) => (
    // Without az-fixed-header-on-mobile, so the header stays in the docs page instead of
    // pinning itself to the top of the screen.
    <div className={`arizona-header ${colors[args.Color] ?? colors.Blue}`}>
      <div className="container">
        <div className="row">
          <a className="arizona-logo col-auto" href="https://www.arizona.edu" title="The University of Arizona homepage">
            <img
              className="arizona-line-logo"
              alt="The University of Arizona Wordmark Line Logo White"
              src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg"
            />
          </a>
          {args['Header buttons'] && (
            // Arizona Bootstrap's markup adds d-lg-none here, so the buttons only show below
            // 992px. Leaving it out shows them at any width.
            <div className="d-flex col-auto px-0">
              {headerButton('search', 'Search')}
              {headerButton('menu', 'Menu')}
            </div>
          )}
        </div>
      </div>
    </div>
  ),
} satisfies Meta<ArizonaHeaderArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Arizona Header docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
