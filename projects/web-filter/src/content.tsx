import { createRoot } from 'react-dom/client';

import { VintageFilter } from './filters/VintageFilter';
import { WaveFilter } from './filters/WaveFilter';
import { useElementSelection } from './helpers/hooks/useElementSelection';

const app = document.createElement('div');

app.id = 'web-filter-app';
app.style.display = 'none';

document.body.appendChild(app);

export const Content = () => {
  useElementSelection();

  return (
    <svg>
      <defs>
        <WaveFilter />
        <VintageFilter />
      </defs>
    </svg>
  );
};

createRoot(app).render(<Content />);
