import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations
import enAccount from './i18n/en/account.json';
import frAccount from './i18n/fr/account.json';
import esAccount from './i18n/es/account.json';
import deAccount from './i18n/de/account.json';
import nlAccount from './i18n/nl/account.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        accountOnboarding: enAccount,
      },
      fr: {
        accountOnboarding: frAccount,
      },
      es: {
        accountOnboarding: esAccount,
      },
      de: {
        accountOnboarding: deAccount,
      },
      nl: {
        accountOnboarding: nlAccount,
      },
    },
    lng: 'nl', // default language
    fallbackLng: 'nl',
    ns: ['accountOnboarding'], // Only 'account' namespace
    defaultNS: 'accountOnboarding', // Default namespace set to 'account'
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
