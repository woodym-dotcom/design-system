import type { Preview } from '@storybook/react';

// Load the design-system stylesheet stack so stories render with real tokens,
// brand accent, and primitives CSS (the same imports consumers use). Without
// these, every story renders unstyled.
import '../tokens/core.css';
import '../tokens/type-scale.css';
import '../tokens/viz.css';
import '../tokens/utilities.css';
import '../brands/companyco.css';
import '../primitives/primitives.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
};

export default preview;
