import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './pages/Popup';

createRoot(document.body).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
