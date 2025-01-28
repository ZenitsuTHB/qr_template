import React, { useState, useEffect, useRef } from 'react';
import './css/timeSelector.css';
import { getAvailableTimeblocks } from './algorithm/getAvailableTimeblocks';

const TimeSelector = ({
  guests,
  formData,
  handleChange,
  field,
  selectedDate,
  expanded,
  setCurrentExpandedField,
  restaurantData,
  reservations,
  reservationMode, // Receive reservationMode as prop
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded || false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const timeSelectorRef = useRef(null);

  useEffect(() => {
    if (selectedDate && guests && restaurantData && reservations) {
      const adjustedGuests =
        reservationMode !== 'met_limieten' ? -10000 : guests; // Adjust guests
      const timeblocks = getAvailableTimeblocks(
        restaurantData,
        selectedDate,
        reservations,
        adjustedGuests // Use adjustedGuests
      );

      // Convert timeblocks object to array suitable for rendering
      const times = Object.keys(timeblocks).map((time) => ({
        value: time,
        label: timeblocks[time].name || time,
      }));

      // Sort times
      times.sort((a, b) => {
        const [aHours, aMinutes] = a.value.split(':').map(Number);
        const [bHours, bMinutes] = b.value.split(':').map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });

      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  }, [
    selectedDate,
    guests,
    restaurantData,
    reservations,
    reservationMode, // Add reservationMode to dependencies
  ]);

  const handleTimeSelect = (timeValue) => {
    handleChange({
      target: { name: field.id, value: timeValue },
    });
    setIsExpanded(false);
    if (setCurrentExpandedField) {
      setCurrentExpandedField(null);
    }
  };

  const formatDisplayTime = () => {
    if (formData[field.id]) {
      const selected = availableTimes.find(
        (time) => time.value === formData[field.id]
      );
      return selected ? selected.label : 'Selecteer een tijd';
    }
    return 'Selecteer een tijd';
  };

  if (!field) {
    return null;
  }

  return (
    <div className="form-group time-selector-container" ref={timeSelectorRef}>
      {!selectedDate ? (
        <p className="info-text">Selecteer eerst een datum.</p>
      ) : (
        <>
          <div
            className="time-display"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded && setCurrentExpandedField) {
                setCurrentExpandedField('time');
              }
            }}
          >
            <span>{formatDisplayTime()}</span>
            <span className="arrow">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <path
                  d="M7 10l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </div>
          {isExpanded && (
            <div className="time-selector">
              {availableTimes.length === 0 ? (
                <div className="no-times">Geen beschikbare tijden.</div>
              ) : (
                <div className="time-options">
                  {availableTimes.map((time) => (
                    <div
                      key={time.value}
                      className={`time-option ${
                        formData[field.id] === time.value ? 'selected' : ''
                      }`}
                      onClick={() => handleTimeSelect(time.value)}
                    >
                      {time.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimeSelector;
