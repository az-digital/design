import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, squarePhoto } from './cards';

// A square photo with only a title on it, with the markup in Arizona Bootstrap's
// "Title on Image" docs. The control is the title; hover it, or press Tab, for the
// zoom and the underline.

type TitleOnImageCardArgs = { Title: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Title on Image Card',
  tags: ['!dev'],
  args: { Title: 'Undergraduate' },
  argTypes: { Title: { control: 'text' } },
  render: (args) => (
    <Frame>
      <div className="card border-0 hover overflow-hidden">
        <div className="ratio ratio-1x1 overflow-hidden">
          <img className="card-img-top object-fit-cover hover-img-zoom-in" src={squarePhoto} alt="" />
          <div className="card-img-overlay p-0 d-flex flex-column">
            <h3 className="card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline">
              <a href="#title-on-image-card" className="stretched-link text-reset text-decoration-none">{args.Title}</a>
            </h3>
          </div>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<TitleOnImageCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Title on Image Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
