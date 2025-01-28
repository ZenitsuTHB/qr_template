// src/components/FormSettings/BackgroundTypeSelector.jsx

import React from 'react';
import { FaSquareFull, FaGripLinesVertical, FaMagic } from 'react-icons/fa';
import './css/backgroundTypeSelector.css';

const BackgroundTypeSelector = ({ backgroundType, setBackgroundType }) => {
  const options = [
    {
      key: 'solid',
      label: 'Effen Kleur',
      icon: <FaSquareFull size={48} />,
    },
    {
      key: 'gradient',
      label: 'Kleur Overgang',
      icon: <FaGripLinesVertical size={48} />,
    },
    {
      key: 'animated',
      label: 'Kleur Animatie',
      icon: <FaMagic size={48} />,
    },
  ];

  const handleSelect = (key) => {
    setBackgroundType(key);
  };

  return (
    <div className="background-type-selector">
      <label>Achtergrondtype:</label>
      <div className="background-type-options">
        {options.map((option) => (
          <div
            key={option.key}
            className={`background-type-option ${
              backgroundType === option.key ? 'selected' : ''
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

export default BackgroundTypeSelector;
