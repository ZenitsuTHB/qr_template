// BezettingspercentageForm.js

import React from 'react';
import { FaUsers, FaClock } from 'react-icons/fa'; // Import relevant icons
import './css/bezettingspercentageForm.css';

const BezettingspercentageForm = ({
  maxCapacity,
  gemiddeldeDuurCouvert,
  onMaxCapacityChange,
  onGemiddeldeDuurCouvertChange,
  onHerberekenen,
}) => {
  return (
    <div className="bezettingspercentage-form-container">
      <div className="form-group">
        <label htmlFor="maxCapacity" className="form-label">
          Max. Capaciteit:
        </label>
        <div className="input-container">
          <FaUsers className="input-icon" />
          <input
            type="number"
            id="maxCapacity"
            name="maxCapacity"
            placeholder="Voer max. capaciteit in"
            value={maxCapacity}
            onChange={onMaxCapacityChange}
            className="standard-input"
            min="1"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="gemiddeldeDuurCouvert" className="form-label">
          Duur Couvert (min):
        </label>
        <div className="input-container">
          <FaClock className="input-icon" />
          <input
            type="number"
            id="gemiddeldeDuurCouvert"
            name="gemiddeldeDuurCouvert"
            placeholder="Voer duur couvert in minuten"
            value={gemiddeldeDuurCouvert}
            onChange={onGemiddeldeDuurCouvertChange}
            className="standard-input"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};

export default BezettingspercentageForm;
