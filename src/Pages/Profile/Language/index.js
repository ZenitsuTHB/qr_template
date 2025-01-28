// src/components/Profile/LanguageSelector.jsx

import React, { useState, useRef, useEffect } from 'react';
import useNotification from '../../../Components/Notification/index';
import './css/language.css';
import englishFlag from '../../../Assets/flags/EN.webp';
import dutchFlag from '../../../Assets/flags/BE.webp';
import spanishFlag from '../../../Assets/flags/ES.webp';
import frenchFlag from '../../../Assets/flags/FR.webp';
import germanFlag from '../../../Assets/flags/DE.webp';
import { useTranslation } from 'react-i18next';
import { withHeader } from '../../../Components/Structural/Header';

const languageOptions = [
  { code: 'en', name: 'English', flag: englishFlag },
  { code: 'nl', name: 'Nederlands', flag: dutchFlag },
  { code: 'es', name: 'Español', flag: spanishFlag },
  { code: 'fr', name: 'Français', flag: frenchFlag },
  { code: 'de', name: 'Deutsch', flag: germanFlag },
];

const Language = () => {
  const { i18n } = useTranslation();
  const { triggerNotification, NotificationComponent } = useNotification();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    return languageOptions.find((lang) => lang.code === savedLang) || languageOptions[0];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem('selectedLanguage', lang.code);
    triggerNotification(`Gekozen taal: ${lang.name}`, 'success');
    setIsModalOpen(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className='language-page'>
      <div className="language-selector-container">
        <NotificationComponent />
        <h2>Taalvoorkeuren</h2>
        <div
          className="language-selector"
          onClick={() => setIsModalOpen(!isModalOpen)}
          aria-label="Select Language"
        >
          <img src={selectedLanguage.flag} alt={`${selectedLanguage.name} Flag`} className="language-selector__flag" />
          <span className="language-selector__name">{selectedLanguage.name}</span>
        </div>

        {isModalOpen && (
          <div className="language-selector__modal-overlay">
            <div className="language-selector__modal" ref={modalRef}>
              <h2>Kies een Taal</h2>
              <div className="language-selector__options">
                {languageOptions.map((lang) => (
                  <div
                    key={lang.code}
                    className={`language-selector__option ${lang.code === selectedLanguage.code ? 'selected' : ''}`}
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    <img src={lang.flag} alt={`${lang.name} Flag`} className="language-selector__option-flag" />
                    <span className="language-selector__option-name">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withHeader(Language);
