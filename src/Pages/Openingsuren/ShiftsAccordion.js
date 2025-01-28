// src/Pages/Uitzonderingen/ShiftsAccordion.js

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaTrash } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch';
import './css/shiftsAccordion.css';

const ShiftsAccordion = ({ enabled, setEnabled, shifts, setShifts, startTime, endTime }) => {
  const [isExpanded, setIsExpanded] = useState(enabled);

  useEffect(() => {
    setIsExpanded(enabled);
  }, [enabled]);

  const handleHeaderClick = () => {
    if (enabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const generateShiftTimeOptions = (startTime, endTime) => {
    if (!startTime || !endTime) return [];

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const options = [];
    let current = new Date(startDate);

    // Inclusive of startTime, exclusive of endTime
    while (current < endDate) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      options.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

  const shiftTimeOptions = generateShiftTimeOptions(startTime, endTime);

  const addNewShift = () => {
    setShifts([...shifts, { name: '', time: '' }]);
  };

  const handleShiftChange = (index, field, value) => {
    const newShifts = [...shifts];
    newShifts[index][field] = value;
    setShifts(newShifts);
  };

  const removeShift = (index) => {
    const newShifts = [...shifts];
    newShifts.splice(index, 1);
    setShifts(newShifts);
  };

  return (
    <div className="shifts-accordion">
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleHeaderClick}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          <span>Shifts ({shifts.length})</span>
        </div>
        <div className="toggle-middle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={handleToggle} />
        </div>
      </div>
      {isExpanded && enabled && (
        <div className="item-content">
          {(!startTime || !endTime) && (
            <p className="shift-error">Selecteer eerst een starttijd en eindtijd.</p>
          )}
          {startTime &&
            endTime &&
            shifts.map((shift, index) => (
              <div key={index} className="shift-row">
                <select
                  value={shift.time}
                  onChange={(e) => handleShiftChange(index, 'time', e.target.value)}
                  className="shift-select"
                >
                  <option value="">Selecteer Tijd</option>
                  {shiftTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Shift Naam"
                  value={shift.name}
                  onChange={(e) => handleShiftChange(index, 'name', e.target.value)}
                  className="shift-input"
                />
                <button
                  className="remove-shift-button"
                  onClick={() => removeShift(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          {startTime && endTime && (
            <div className="add-shift" onClick={addNewShift}>
              <span>Voeg Nieuwe Shift Toe</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShiftsAccordion;
