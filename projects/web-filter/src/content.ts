import { STATUS } from './types/status';

chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.action) {
    case STATUS.INACTIVE:
      console.log('INACTIVE');
      break;
    case STATUS.SURFING:
      console.log('SURFING');
      break;
    case STATUS.SELECTED:
      console.log('SELECTED');
      break;
    default:
      break;
  }
});
