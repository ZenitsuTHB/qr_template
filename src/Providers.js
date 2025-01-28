// Providers.js
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { SearchProvider } from './Context/SearchContext';
import store from './Redux/store';
import i18n from './i18n';

const Providers = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <HashRouter>
        <SearchProvider>
          {children}
        </SearchProvider>
      </HashRouter>
    </Provider>
  </I18nextProvider>
);

export default Providers;
