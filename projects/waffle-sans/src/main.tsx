import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Reset } from 'styled-reset';

import App from './App.tsx';
import { TextureProvider } from './layout/TextureProvider.tsx';
import './styles/font.css';
import './styles/preload.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Reset />
      <TextureProvider>
        <App />
      </TextureProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
