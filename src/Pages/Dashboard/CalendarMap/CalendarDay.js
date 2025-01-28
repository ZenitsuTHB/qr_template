// CalendarDay.js

import React from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';
import { formatDateForFilter } from '../../../Utils/dateUtils';

const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
const timeSlotColors = ['rgba(24, 40, 37,', 'rgba(1, 111, 185,', 'rgba(34, 174, 209,'];

const CalendarDay = ({
  date,
  currentMonth,
  reservationsByDate,
  onDateClick,
  maxOccupation,
  maxPrediction,
  selectedShift,
  selectedViewMode,
  predictionsByDate,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  fadeOut,
  maxCapacity,
  gemiddeldeDuurCouvert,
  weatherDataByDate,
}) => {
  const dateString = formatDateForFilter(date); // Use the custom date formatter
  const reservations = reservationsByDate[dateString] || [];

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isPastDate = date < today && !isToday;

  const handleClick = () => {
    if (reservations.length > 0) {
      onDateClick(date);
    }
  };

  let totalGuests = 0;

  // Calculate totalGuestsByTimeSlot
  const totalGuestsByTimeSlot = [0, 0, 0]; // Ochtend, Middag, Avond

  reservations.forEach((reservation) => {
    if (
      selectedShift === 'Dag' ||
      (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
      (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
      (selectedShift === 'Avond' && reservation.timeSlot === 2)
    ) {
      totalGuests += reservation.aantalGasten;
      totalGuestsByTimeSlot[reservation.timeSlot] += reservation.aantalGasten;
    }
  });

  // Adjust background color and data based on selectedViewMode
  let backgroundColor = '';
  let content = null;

  if (selectedViewMode === 'Weer') {
    const temperature = weatherDataByDate[dateString];

    backgroundColor = 'white'; // Or any default background color
    content = (
      <div className="occupancy-percentage">
        <strong>{temperature !== undefined ? `${temperature}°C` : ''}</strong>
      </div>
    );
  } else if (selectedViewMode === 'Bezettingsgraad') {
    let heatmapIntensity = 0;
    if (maxOccupation > 0) {
      heatmapIntensity = totalGuests / maxOccupation;
    }

    // Adjust background color for shift
    let heatmapColor = 'rgba(0, 123, 255,'; // default blue
    let textColor = 'white';
    if (selectedShift === 'Ochtend') {
      heatmapColor = 'rgba(24, 40, 37,'; // '#182825'
      textColor = 'white';
    } else if (selectedShift === 'Middag') {
      heatmapColor = 'rgba(1, 111, 185,'; // '#016FB9'
      textColor = 'black';
    } else if (selectedShift === 'Avond') {
      heatmapColor = 'rgba(34, 174, 209,'; // '#22AED1'
      textColor = 'black';
    } else {
      heatmapColor = 'rgba(0, 123, 255,'; // default blue
      textColor = 'white';
    }

    backgroundColor = `${heatmapColor} ${heatmapIntensity})`;

    if (isHovered && totalGuests > 0) {
      content = (
        <div className="heatmap-total-guests" style={{ color: textColor }}>
          <strong>{totalGuests}</strong>
        </div>
      );
    }
  } else if (selectedViewMode === 'Bezettingspercentage') {
    // Occupancy Rate Calculation
    const maxCapacityNum = parseInt(maxCapacity, 10);
    const gemiddeldeDuurCouvertNum = parseInt(gemiddeldeDuurCouvert, 10);

    if (maxCapacityNum > 0 && gemiddeldeDuurCouvertNum > 0) {
      const totalIntervalsPerDay = (12 * 60) / 5; // Assuming 12 hours of operation, divided into 5-minute intervals
      const totalCapacityPerDay = maxCapacityNum * totalIntervalsPerDay;

      let totalOccupiedSlots = 0;

      reservations.forEach((reservation) => {
        if (
          selectedShift === 'Dag' ||
          (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
          (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
          (selectedShift === 'Avond' && reservation.timeSlot === 2)
        ) {
          const occupiedSlotsPerReservation =
            reservation.aantalGasten * (gemiddeldeDuurCouvertNum / 5);
          totalOccupiedSlots += occupiedSlotsPerReservation;
        }
      });

      let occupancyRate = (totalOccupiedSlots / totalCapacityPerDay) * 100;

      // Ensure occupancy rate is between 0 and 100
      occupancyRate = Math.min(Math.max(occupancyRate, 0), 100);

      backgroundColor = 'white'; // or any default color
      content = (
        <div className="occupancy-percentage">
          <strong>{occupancyRate.toFixed(1)}%</strong>
        </div>
      );
    } else {
      backgroundColor = 'white';
      content = (
        <div className="occupancy-percentage">
          <strong></strong>
        </div>
      );
    }
  } else if (selectedViewMode === 'Voorspelling') {
    const prediction = predictionsByDate[dateString] || 0;

    let predictionIntensity = 0;
    if (maxPrediction > 0) {
      predictionIntensity = prediction / maxPrediction;
    }

    let predictionColor = 'rgba(255, 0, 0,'; // shades of red
    backgroundColor = `${predictionColor} ${predictionIntensity})`;

    if (isHovered && prediction > 0) {
      content = (
        <div className="prediction-total-guests">
          <strong>{prediction.toFixed(1)}</strong>
        </div>
      );
    }
  } else if (selectedViewMode === 'Algemeen') {
    // No background color or content modifications
  }

  const opacity =
    isHovered
      ? 1
      : fadeOut
      ? 0.5
      : selectedViewMode === 'Bezettingsgraad' ||
        selectedViewMode === 'Voorspelling' ||
        selectedViewMode === 'Weer'
      ? 1
      : isPastDate && !isHovered
      ? 0.5
      : 1;

  return (
    <div
      className={`calendar-day ${currentMonth ? '' : 'calendar-day--disabled'} ${
        isPastDate ? 'calendar-day--past' : ''
      } ${isToday ? 'calendar-day--today' : ''} ${
        selectedViewMode !== 'Algemeen' ? 'special-mode' : ''
      }`}
      onClick={handleClick}
      style={{
        backgroundColor,
        opacity,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="calendar-day-number">{date.getDate()}</div>
      {content}
      {selectedViewMode === 'Algemeen' && (
        <div className="time-of-day-boxes">
          {[0, 1, 2].map((timeSlot) => {
            const shiftName = timeSlotNames[timeSlot];
            const totalGuestsInShift = totalGuestsByTimeSlot[timeSlot];

            if (
              (selectedShift === 'Dag' || selectedShift === shiftName) &&
              totalGuestsInShift > 0
            ) {
              return (
                <TimeOfDayBox
                  key={timeSlot}
                  timeSlot={timeSlot}
                  totalGuests={totalGuestsInShift}
                  isPastDate={isPastDate}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
