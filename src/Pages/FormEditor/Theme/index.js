// src/components/Theme/ThemeSelectorModal.jsx

import React, { useState } from 'react';
import ThemeSquare from './Square';
import useApi from '../../../Hooks/useApi'; // Adjust the import path as necessary

import './css/themeSelectorModal.css';
import './css/animations.css';
import './css/mobile.css';

import { initialThemes } from './defaultThemes';

const ThemeSelectorModal = ({ onClose, onSuccess }) => {
  const [themes, setThemes] = useState(initialThemes);
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);
  const api = useApi();

  const handleThemeClick = async (theme) => {
    try {
      await saveThemeToBackend(theme);
      onSuccess(theme);
      onClose();
    } catch (error) {
    }
  };
  const handleAddThemeClick = () => {
    setShowAddThemeModal(true);
  };

  const saveThemeToBackend = async (theme) => {
    const themeData = {
      id: theme.id,
      title: theme.title,
      color: theme.color,
      image: theme.image,
    };

    try {
      await api.put(
        `${window.baseDomain}api/theme/`,
        themeData
      );
    } catch (error) {
      console.error('Error saving theme or updating background color:', error);
      throw error;
    }
  };

  const handleSaveNewTheme = (newTheme) => {
    setThemes([...themes, newTheme]);
    setShowAddThemeModal(false);
  };

  return (
    <div className="theme-page">
      <div className="theme-selector-modal">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
          <h2 className="style-title">Kies een Banner</h2>
          <div className="theme-grid">

            {themes.map((theme) => (
              <ThemeSquare
                key={theme.id}
                theme={theme}
                onClick={() => handleThemeClick(theme)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectorModal;
