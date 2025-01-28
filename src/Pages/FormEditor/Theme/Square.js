// ThemeSquare.js
import React from 'react';
import './css/themeSquare.css';

const ThemeSquare = ({ theme, onClick }) => {
  return (
    <div className="theme-square" onClick={onClick}>
      <div className="theme-square-content">
        <div className="theme-square-right">
          <img src={theme.image} alt={theme.title} />
        </div>
      </div>
      <div className="theme-square-title">{theme.title}</div>
    </div>
  );
};

export default ThemeSquare;
