// ShiftSelector.js

import React, { useRef, useEffect } from 'react';
import { FaList } from 'react-icons/fa';
import './css/shiftSelector.css';

const ShiftSelector = ({
  selectedShift,
  setSelectedShift,
}) => {
  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = React.useState(false);
  const shiftButtonRef = useRef(null);
  const shiftOptionsRef = useRef(null);

  const shifts = ['Dag', 'Ochtend', 'Middag', 'Avond'];

  // Handle Click Outside for Shift Options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shiftOptionsRef.current &&
        !shiftOptionsRef.current.contains(event.target) &&
        shiftButtonRef.current &&
        !shiftButtonRef.current.contains(event.target)
      ) {
        setIsShiftOptionsOpen(false);
      }
    };

    if (isShiftOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShiftOptionsOpen]);

  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
    setIsShiftOptionsOpen(false);
  };

  const toggleShiftOptions = () => {
    setIsShiftOptionsOpen(!isShiftOptionsOpen);
  };

  return (
	<div className="shift-selector-calendar-map">
    <div className="shift-selector">
      <button
        onClick={toggleShiftOptions}
        className="standard-button blue shift-button"
        ref={shiftButtonRef}
      >
        <FaList className="shift-button-icon" />
        {selectedShift}
      </button>

      {isShiftOptionsOpen && (
        <div className="shift-options-container" ref={shiftOptionsRef}>
          {shifts.map((shift) => (
            <div
              key={shift}
              className="shift-option"
              onClick={() => handleShiftSelection(shift)}
            >
              {shift}
            </div>
          ))}
        </div>
      )}
    </div>
	</div>
  );
};

export default ShiftSelector;
