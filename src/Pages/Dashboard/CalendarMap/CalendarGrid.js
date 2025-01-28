// CalendarGrid.js

import React, { useState, useEffect } from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';
import { motion } from 'framer-motion';
import { formatDateForFilter } from '../../../Utils/dateUtils';

const CalendarGrid = ({
  dates,
  currentDate,
  reservationsByDate,
  onDateClick,
  selectedShift,
  selectedViewMode,
  predictionsByDate,
  weekOrMonthView,
  maxCapacity,
  gemiddeldeDuurCouvert,
  weatherDataByDate,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);
  const [maxOccupation, setMaxOccupation] = useState(0);
  const [maxPrediction, setMaxPrediction] = useState(0);

  // Calculate max occupation for Bezettingsgraad and prediction
  useEffect(() => {
    if (
      selectedViewMode === 'Bezettingsgraad' ||
      selectedViewMode === 'Bezettingspercentage' ||
      selectedViewMode === 'Voorspelling'
    ) {
      const occupations = dates.map(({ date }) => {
        const dateString = formatDateForFilter(date); // Use the custom date formatter
        const reservations = reservationsByDate[dateString] || [];
        let totalGuests = 0;

        reservations.forEach((res) => {
          if (
            selectedShift === 'Dag' ||
            (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
            (selectedShift === 'Middag' && res.timeSlot === 1) ||
            (selectedShift === 'Avond' && res.timeSlot === 2)
          ) {
            totalGuests += res.aantalGasten;
          }
        });

        return totalGuests;
      });
      setMaxOccupation(Math.max(...occupations));

      // For Voorspelling, set maxPrediction
      if (selectedViewMode === 'Voorspelling') {
        setMaxPrediction(Math.max(...Object.values(predictionsByDate)));
      } else {
        setMaxPrediction(0);
      }
    }
  }, [dates, reservationsByDate, selectedShift, selectedViewMode, predictionsByDate]);

  const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']; // Dutch day names

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="calendar-grid"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      key={`${currentDate.toString()}-${selectedViewMode}-${selectedShift}`}
    >
      {/* Calendar Header */}
      <div className="calendar-grid-header">
        {dayNames.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="calendar-grid-body">
        {dates.map(({ date, currentMonth }, index) => (
          <motion.div key={index} variants={itemVariants}>
            <CalendarDay
              date={date}
              currentMonth={currentMonth}
              reservationsByDate={reservationsByDate}
              onDateClick={onDateClick}
              maxOccupation={maxOccupation}
              maxPrediction={maxPrediction}
              selectedShift={selectedShift}
              selectedViewMode={selectedViewMode}
              predictionsByDate={predictionsByDate}
              isHovered={hoveredDayIndex === index}
              onMouseEnter={() => setHoveredDayIndex(index)}
              onMouseLeave={() => setHoveredDayIndex(null)}
              fadeOut={hoveredDayIndex !== null && hoveredDayIndex !== index}
              maxCapacity={maxCapacity}
              gemiddeldeDuurCouvert={gemiddeldeDuurCouvert}
              weatherDataByDate={weatherDataByDate}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarGrid;
