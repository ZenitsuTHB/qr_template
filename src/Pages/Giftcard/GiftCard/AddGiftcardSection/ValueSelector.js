import React, { useState } from 'react';
import './css/valueSelector.css';

const ValueSelector = ({ value, onChange }) => {
  const predefinedValues = [25, 50, 75, 100];
  const [customValue, setCustomValue] = useState(value || '');

  const handlePredefinedValueClick = (val) => {
    setCustomValue(val);
    onChange({ target: { name: 'value', value: val } });
  };

  const handleSliderChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange({ target: { name: 'value', value: val } });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange({ target: { name: 'value', value: val } });
  };

  return (
    <div className="value-selector">
      <div className="predefined-values">
        {predefinedValues.map((val) => (
          <button
            key={val}
            type="button"
            className={`predefined-value-button ${parseFloat(customValue) === val ? 'active' : ''}`}
            onClick={() => handlePredefinedValueClick(val)}
          >
            €{val}
          </button>
        ))}
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="5"
          max="500"
          step="5"
          value={customValue}
          onChange={handleSliderChange}
          className="slider"
        />
        <input
          type="number"
          name="value"
          value={customValue}
          onChange={handleInputChange}
          className="value-input"
          min="1"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default ValueSelector;
