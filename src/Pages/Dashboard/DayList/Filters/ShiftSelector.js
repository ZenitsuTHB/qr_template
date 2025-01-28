// ShiftSelector.js

import React, { useRef, useEffect } from 'react';
import { FaList } from 'react-icons/fa';
import './css/shiftSelector.css'; // Create and style this CSS as needed

const ShiftSelector = ({
  shifts,
  selectedShift,
  setSelectedShift,
  isShiftOptionsOpen,
  setIsShiftOptionsOpen,
  setCurrentPage,
}) => {
  const shiftButtonRef = useRef(null);
  const shiftOptionsRef = useRef(null);

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
  }, [isShiftOptionsOpen, setIsShiftOptionsOpen]);

  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
    setIsShiftOptionsOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const toggleShiftOptions = () => {
    setIsShiftOptionsOpen(!isShiftOptionsOpen);
  };

  return (
    <div className="shift-selector">
      <button
        onClick={toggleShiftOptions}
        className="button-style-1 shift-button"
        ref={shiftButtonRef}
      >
        <FaList className="button-style-1-icon shift-button-icon" />
        {selectedShift ? `${selectedShift}` : 'Shift'}
      </button>

      {isShiftOptionsOpen && (
        <div className="shift-options-container" ref={shiftOptionsRef}>
          {Object.keys(shifts).map((shift) => (
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
  );
};

export default ShiftSelector;
