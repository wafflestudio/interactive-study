import { ElementSelector } from './scripts-lib/element-selector';
import { STATUS } from './types/status';

const selector = new ElementSelector();

chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.action) {
    case STATUS.INACTIVE:
      break;
    case STATUS.SURFING:
      selector.surfingElements();
      break;
    case STATUS.SELECTED:
      break;
    default:
      break;
  }
});
