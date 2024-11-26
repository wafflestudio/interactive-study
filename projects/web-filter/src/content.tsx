import { createRoot } from 'react-dom/client';

import { VintageFilter } from './filters/VintageFilter';
import { WaveFilter } from './filters/WaveFilter';
import { ElementSelector } from './scripts-lib/element-selector';
import { ACTION } from './types/status';

// TODO: 탭 간 이동 시 초기화
const selector = new ElementSelector();

chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.action) {
    case ACTION.START_SELECT_ELEMENT:
      selector.surfingElements();
      break;
    case ACTION.APPLY_FILTER:
      selector.applyFilter(request.filterId);
      break;
    default:
      break;
  }
});

export default function Content() {
  return (
    <svg>
      <defs>
        <WaveFilter />
        <VintageFilter />
      </defs>
    </svg>
  );
}

const app = document.createElement('div');
app.id = 'web-filter-app';
app.style.display = 'none';
document.body.appendChild(app);
createRoot(app).render(<Content />);
