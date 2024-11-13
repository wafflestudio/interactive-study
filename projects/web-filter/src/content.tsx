import { createRoot } from 'react-dom/client';

import { VintageFilter } from './filters/VintageFilter';
import { WaveFilter } from './filters/WaveFilter';
import { useActionHandler } from './helpers/hooks/useActionHandler';
import { useMessageListener } from './helpers/hooks/useMessageListener';

const app = document.createElement('div');

app.id = 'web-filter-app';

document.body.appendChild(app);

export const Content = () => {
  const { startSelection, stopSelection, applyFilter } = useActionHandler();

  useMessageListener({
    onStartSelection: startSelection,
    onApplyFilter: applyFilter,
    onStopSelection: stopSelection,
  });

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
