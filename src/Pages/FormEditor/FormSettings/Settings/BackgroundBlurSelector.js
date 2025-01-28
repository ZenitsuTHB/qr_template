// src/components/FormSettings/BackgroundBlurSelector.jsx

import React from 'react';
import { FaCamera, FaMagic } from 'react-icons/fa';
import './css/backgroundBlur.css'; // Create a new CSS file
import PropTypes from 'prop-types';

const BackgroundBlurSelector = ({ backgroundBlur, setBackgroundBlur }) => {
  const options = [
    {
      key: 'sharpPicture',
      label: 'Scherpe Foto',
      icon: <FaCamera size={48} />,
    },
    {
      key: 'blurBackground',
      label: 'Blur Achtergrond',
      icon: <FaMagic size={48} />,
    },
  ];

  const handleSelect = (key) => {
    setBackgroundBlur(key);
  };

  return (
    <div className="background-blur-selector">
      <label>Achtergrond Blur:</label>
      <div className="background-blur-options">
        {options.map((option) => (
          <div
            key={option.key}
            className={`background-blur-option ${
              backgroundBlur === option.key ? 'selected' : ''
            }`}
            onClick={() => handleSelect(option.key)}
          >
            <div className="icon-container">{option.icon}</div>
            <div className="option-label">{option.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

BackgroundBlurSelector.propTypes = {
  backgroundBlur: PropTypes.string.isRequired,
  setBackgroundBlur: PropTypes.func.isRequired,
};

export default BackgroundBlurSelector;
