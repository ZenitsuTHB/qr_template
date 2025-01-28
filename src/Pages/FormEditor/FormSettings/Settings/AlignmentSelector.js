// src/components/FormSettings/AlignmentSelector.jsx

import React from 'react';
import { FaSquareFull, FaColumns, FaImage } from 'react-icons/fa';
import './css/alignmentSelector.css';

const AlignmentSelector = ({ alignment, setAlignment }) => {
  const options = [
    {
      key: 'fullScreenColor',
      label: 'Volledig Scherm Kleur',
      icon: <FaSquareFull size={48} />,
    },
    {
      key: 'halfColorPicture',
      label: '50/50 Kleur en Banner',
      icon: <FaColumns size={48} />,
    },
    {
      key: 'fullScreenPicture',
      label: 'Enkel Bannerfoto',
      icon: <FaImage size={48} />,
    },
  ];

  const handleSelect = (key) => {
    setAlignment(key);
  };

  return (
    <div className="alignment-selector">
      <label>Indeling:</label>
      <div className="alignment-options">
        {options.map((option) => (
          <div
            key={option.key}
            className={`alignment-option ${
              alignment === option.key ? 'selected' : ''
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

export default AlignmentSelector;
