// TimeOfDayBox.js

import React from 'react';
import './css/timeOfDay.css';

const TimeOfDayBox = ({ timeSlot, totalGuests, isPastDate }) => {
  const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
  const timeSlotColors = ['#1e3a3f', '#48aaaf', '#7fd4d0'];
  const backgroundColor = timeSlotColors[timeSlot];
  const opacity = isPastDate ? 0.5 : 1;

  return (
    <div
      className="time-of-day-box"
      style={{ backgroundColor, opacity }}
    >
      <span>{timeSlotNames[timeSlot]}: {totalGuests}</span>
    </div>
  );
};

export default TimeOfDayBox;
