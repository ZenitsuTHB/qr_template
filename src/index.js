import React from 'react';
import ReactDOM from 'react-dom/client';
import Providers from './Providers';
import App from './App';

window.isIframe = window !== window.parent;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Providers>
    <App />
  </Providers>
);
