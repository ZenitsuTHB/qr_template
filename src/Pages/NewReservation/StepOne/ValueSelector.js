// src/Pages/NewReservation/ValueSelector.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/valueSelector.css';

const ValueSelectorGuests = ({ setGuests, value, onChange }) => {
  const predefinedValues = [1, 2, 3, '4+'];
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [showSlider, setShowSlider] = useState(false);

  const handlePredefinedValueClick = (val) => {
    if (val === '4+') {
      setShowSlider(true);
      setSelectedValue(4);
      setGuests(4);
      onChange({ target: { name: 'guests', value: 4 } });
    } else {
      setShowSlider(false);
      setSelectedValue(val);
      setGuests(val);
      onChange({ target: { name: 'guests', value: val } });
    }
  };

  const handleSliderChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    setGuests(val);
    onChange({ target: { name: 'guests', value: val } });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    setGuests(val);
    onChange({ target: { name: 'guests', value: val } });
  };

  return (
    <div className="value-selector">
      <div className="predefined-values">
        {predefinedValues.map((val) => (
          <button
            key={val}
            type="button"
            className={`predefined-value-button ${
              selectedValue == val || (val === '4+' && showSlider) ? 'active' : ''
            }`}
            onClick={() => handlePredefinedValueClick(val)}
          >
            {val === '4+' ? '4+' : `${val} ${val === 1 ? 'p' : 'p'}`}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {showSlider && (
          <motion.div
            className="slider-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={selectedValue}
              onChange={handleSliderChange}
              className="slider non-absolute"
            />
            <input
              type="number"
              name="guests"
              value={selectedValue}
              onChange={handleInputChange}
              className="value-input"
              min="4"
              max="100"
              step="1"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValueSelectorGuests;
