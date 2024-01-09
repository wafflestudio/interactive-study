import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Reset } from 'styled-reset';

import App from './App.tsx';
import './styles/font.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Reset />
      <App />
    </RecoilRoot>
  </React.StrictMode>,
);
