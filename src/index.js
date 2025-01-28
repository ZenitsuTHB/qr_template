import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Providers from './Providers';
import App from './App';

window.isIframe = window !== window.parent;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Providers>
    <Router>
      <App />
    </Router>
  </Providers>
);
