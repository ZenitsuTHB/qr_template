// src/components/FormSettings/ThemePreview.jsx

import React, { useState } from 'react';
import ThemeSelectorModal from '../../Theme/index.js';
import './css/theme.css'

const ThemePreview = ({ selectedTheme, setSelectedTheme, triggerNotification }) => {
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <>
      <div className="form-group">
        <label>Banner:</label>
        {selectedTheme ? (
          <div
            className="theme-preview clickable"
            onClick={() => setShowThemeModal(true)}
            style={{ cursor: 'pointer' }}
            title="Klik om het thema te wijzigen"
          >
            <div className="theme-preview-content">

              <div className="theme-preview-right">
                <img src={selectedTheme.image} alt={selectedTheme.title} />
              </div>
            </div>
            <div className="theme-preview-title">{selectedTheme.title}</div>
          </div>
        ) : (
          <p>Geen banner geselecteerd</p>
        )}
      </div>

      {showThemeModal && (
        <ThemeSelectorModal
          onClose={() => setShowThemeModal(false)}
          onSuccess={(theme) => {
            setSelectedTheme(theme);
            triggerNotification('Thema aangepast', 'success');
          }}
        />
      )}
    </>
  );
};

export default ThemePreview;
