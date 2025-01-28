// src/Components/ReservationsList/Filters/DatePickerComponent.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatDateDutch,
  isToday,
} from '../../../../Utils/dateUtils.js';
import './css/datePicker.css';
import '../css/print.css';

const DatePickerComponent = ({
  selectedDate,
  setSelectedDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  handleDateChange,
  totalGuests, // New prop
  selectedShift, // New prop
  isPrinting, // New prop
}) => {
  // Handler to decrement the date by one day
  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  // Handler to increment the date by one day
  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const handlePrintClick = (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="date-picker-component">
      {selectedDate && (
        <div className="selected-date-container">
          {/* Previous Date Button */}
          <div className="button-with-tooltip">
            <button className="nav-button" onClick={handlePrevDate} aria-label="Previous Date">
              <FaChevronLeft size={16} />
            </button>
            <div className="tooltip">
              Vorige Dag
            </div>
          </div>

          {/* Selected Date with Shift Name */}
          <h2 className="selected-date">
            {isPrinting
              ? formatDateDutch(selectedDate) // Always show the formatted date when printing
              : isToday(selectedDate)
              ? 'Vandaag' // Show 'Vandaag' if it's today and not printing
              : formatDateDutch(selectedDate)} {/* Show formatted date if not today and not printing */}
            {selectedShift && ` - ${selectedShift}`} {/* Append shift name if selected */}
            {selectedDate && (
              <div className="total-guests-container">
                {totalGuests} gasten
              </div>
            )}
          </h2>

          {/* Next Date Button */}
          <div className="button-with-tooltip">
            <button className="nav-button" onClick={handleNextDate} aria-label="Next Date">
              <FaChevronRight size={16} />
            </button>
            <div className="tooltip">
              Volgende Dag
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Toggle Button */}
      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="button-style-1 date-button"
      >
        <FaCalendarAlt className="button-style-1-icon date-button-icon" />
        {selectedDate
          ? isToday(selectedDate)
            ? 'Vandaag'
            : `${formatDateDutch(selectedDate)}`
          : 'Datum'}
      </button>

      {isDatePickerOpen && (
        <div className="date-picker-popup">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            locale="nl"
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecteer een datum"
            todayButton="Vandaag"
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
