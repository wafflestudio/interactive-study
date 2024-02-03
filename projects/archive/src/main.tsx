import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Reset } from 'styled-reset';

import './index.css';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Reset />
    <RouterProvider router={router} />;
  </React.StrictMode>,
);
