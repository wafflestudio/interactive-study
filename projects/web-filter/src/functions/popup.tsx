import { createRoot } from 'react-dom/client';

import { Popup } from '../pages/Popup/Popup';
import { POPUP_ID } from './constant';

// open & close

const open = () => {
  if (document.querySelector(`#${POPUP_ID}`) !== null) return;
  const app = document.createElement('div');
  app.id = POPUP_ID;
  document.body.appendChild(app);
  createRoot(app).render(<Popup />);
};
const close = () => document.querySelector(`#${POPUP_ID}`)?.remove();

export const popup = { open, close };
