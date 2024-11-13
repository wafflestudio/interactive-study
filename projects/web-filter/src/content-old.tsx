import { createRoot } from 'react-dom/client';

import { WaveFilter } from './filters/WaveFilter';

const app = document.createElement('div');

app.id = 'web-filter-app';
app.style.display = 'none';

document.body.appendChild(app);

createRoot(app).render(
  <svg>
    <defs>
      <WaveFilter />
    </defs>
  </svg>,
);

document.body.style.filter = 'url(#filter)';
