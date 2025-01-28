// src/Pages/Uitzonderingen/ExceptionCalendar.js

import React, { useState, useEffect } from 'react';
import './css/exceptions.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ExceptionCalendar = ({ exceptions, onDateClick, monthOffset, onMonthChange }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const daysOfWeekShort = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const months = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
  ];

  useEffect(() => {
    generateCalendar();
  }, [exceptions, monthOffset]);

  // Helper function to normalize dates to midnight
  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const generateCalendar = () => {
    const today = new Date();
    let monthToDisplay = today.getMonth() + monthOffset;
    let yearToDisplay = today.getFullYear();

    // Adjust for year overflow
    if (monthToDisplay > 11) {
      monthToDisplay = monthToDisplay % 12;
      yearToDisplay += Math.floor((today.getMonth() + monthOffset) / 12);
    } else if (monthToDisplay < 0) {
      monthToDisplay = 12 + (monthToDisplay % 12);
      yearToDisplay -= Math.ceil(Math.abs(monthOffset) / 12);
    }

    const firstDayOfMonth = new Date(yearToDisplay, monthToDisplay, 1);
    const daysInMonth = new Date(yearToDisplay, monthToDisplay + 1, 0).getDate();

    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday is 0
    const weeks = [];
    let dayCounter = 1 - startDay;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        if (dayCounter > 0 && dayCounter <= daysInMonth) {
          const dateObj = new Date(yearToDisplay, monthToDisplay, dayCounter);
          const dateStr = dateObj.toISOString().split('T')[0];

          // Normalize dateObj
          const normalizedDateObj = normalizeDate(dateObj);

          // Get the day index (0: Sunday, 1: Monday, ..., 6: Saturday)
          const dayOfWeekIndex = normalizedDateObj.getDay();
          const dayOfWeekNames = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
          const dayName = dayOfWeekNames[dayOfWeekIndex];

          // Determine the exceptions on this date considering daysOfWeek
          const dateExceptions = exceptions.filter((exception) => {
            const startDate = new Date(exception.startDate);
            const endDate = new Date(exception.endDate);
            const exceptionDaysOfWeek = exception.daysOfWeek || [];

            // Normalize dates
            const normalizedStartDate = normalizeDate(startDate);
            const normalizedEndDate = normalizeDate(endDate);

            const dateInRange =
              normalizedDateObj >= normalizedStartDate &&
              normalizedDateObj <= normalizedEndDate;

            if (!dateInRange) {
              return false;
            }

            // If daysOfWeek is specified and not empty, check if the dayName is included
            if (exceptionDaysOfWeek.length > 0) {
              return exceptionDaysOfWeek.includes(dayName);
            } else {
              // If daysOfWeek is not specified or empty, exception applies to all dates in range
              return true;
            }
          });

          // Determine the highest priority exception type
          let exceptionType = null;
          if (dateExceptions.length > 0) {
            const typePriority = ['Opening', 'Uitzondering', 'Sluiting'];
            for (const type of typePriority) {
              if (dateExceptions.some((ex) => ex.type === type || ex.type === 'Sluitingsdag')) {
                exceptionType = type === 'Sluitingsdag' ? 'Sluiting' : type;
                break;
              }
            }
          }

          days.push(
            <td key={dayCounter} className="exceptions-page__calendar-cell">
              <div
                className={`exceptions-page__calendar-day ${
                  exceptionType ? `tag-${exceptionType.toLowerCase()}` : ''
                }`}
                onClick={() => onDateClick(dateStr)}
              >
                {dayCounter}
              </div>
            </td>
          );
        } else {
          days.push(<td key={`${week}-${day}`} className="exceptions-page__calendar-cell"></td>);
        }
        dayCounter++;
      }
      weeks.push(<tr key={week}>{days}</tr>);
    }

    setCalendarData({
      weeks,
      month: months[monthToDisplay],
      year: yearToDisplay,
    });

    setIsLoaded(true);
  };

  return (
    <div className="exceptions-page__calendar">
      <div className="exceptions-page__calendar-header">
        <FaChevronLeft
          className="exceptions-page__calendar-nav"
          onClick={() => onMonthChange(-1)}
        />
        <h3>
          {calendarData.month} {calendarData.year}
        </h3>
        <FaChevronRight
          className="exceptions-page__calendar-nav"
          onClick={() => onMonthChange(1)}
        />
      </div>
      <table className="exceptions-page__calendar-table">
        <thead>
          <tr>
            {daysOfWeekShort.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{calendarData.weeks}</tbody>
      </table>
      <div className="exceptions-page__calendar-legend">
        <span>
          <span className="exceptions-page__calendar-legend-box tag-opening"></span> Opening
        </span>
        <span>
          <span className="exceptions-page__calendar-legend-box tag-uitzondering"></span> Uitzondering
        </span>
        <span>
          <span className="exceptions-page__calendar-legend-box tag-sluiting"></span> Sluiting
        </span>
      </div>
    </div>
  );
};

export default ExceptionCalendar;
