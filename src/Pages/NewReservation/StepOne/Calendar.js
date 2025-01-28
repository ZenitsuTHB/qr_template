import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import 'moment/locale/nl';
import { isWeekInPast, isSameDay } from './Utils/dateUtils';
import './css/calendar.css';
import { isDateAvailable } from './algorithm/isDateAvailable'; // Import isDateAvailable

moment.locale('nl'); // Set moment to Dutch locale

const Calendar = ({
  guests,
  selectedDate,
  onSelectDate,
  autoExpand,
  reservationMode, // Receive reservationMode as prop
  restaurantData,
  startDate,
  onWeekChange,
  reservations,
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand || false);
  const calendarRef = useRef(null);

  const maxDate = moment().tz('Europe/Amsterdam').add(1, 'year').endOf('day');

  useEffect(() => {
    if (autoExpand) {
      setIsExpanded(true);
    }
  }, [autoExpand]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateCalendarDays = (startDate) => {
    const days = [];
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const twoWeeksFromStart = startDate.clone().add(13, 'days');

    let date = startDate.clone();
    while (date.isSameOrBefore(twoWeeksFromStart, 'day')) {
      const formattedDate = date.format('YYYY-MM-DD');
      const adjustedGuests =
        reservationMode !== 'met_limieten' ? -10000 : guests; // Adjust guests

      const isAvailable = isDateAvailable(
        restaurantData,
        formattedDate,
        reservations,
        adjustedGuests // Use adjustedGuests
      );

      days.push({
        date: date.clone(),
        isPast: date.isBefore(today, 'day'),
        isFuture: date.isAfter(maxDate, 'day'),
        isAvailable: isAvailable,
      });

      date.add(1, 'day');
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day.isAvailable && !day.isPast && !day.isFuture) {
      const formattedDate = day.date.format('YYYY-MM-DD');
      onSelectDate(formattedDate); // Notify parent
      setIsExpanded(false);
    } else {
      console.log('Date is not available for selection.');
    }
  };

  const handlePrevWeek = () => {
    const newStartDate = startDate.clone().subtract(1, 'week');
    if (isWeekInPast(newStartDate)) {
      console.log('Cannot go to previous week. It is in the past.');
      return;
    }
    onWeekChange(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = startDate.clone().add(1, 'week');
    onWeekChange(newStartDate);
  };

  const formatDisplayDate = () => {
    if (!selectedDate) {
      return 'Selecteer een datum'; // "Select a date" in Dutch
    }

    const selectedMoment = moment(selectedDate, 'YYYY-MM-DD')
      .tz('Europe/Amsterdam')
      .startOf('day');
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const tomorrow = moment()
      .tz('Europe/Amsterdam')
      .add(1, 'day')
      .startOf('day');

    if (selectedMoment.isSame(today, 'day')) {
      return 'Vandaag'; // "Today" in Dutch
    } else if (selectedMoment.isSame(tomorrow, 'day')) {
      return 'Morgen'; // "Tomorrow" in Dutch
    } else {
      // Format: e.g., "Maandag 1 Januari 2023"
      return selectedMoment.format('dddd D MMMM YYYY');
    }
  };

  // Recalculate days whenever startDate, guests, reservations, restaurantData, or reservationMode change
  const days = startDate ? generateCalendarDays(startDate) : [];

  return (
    <div className="calendar-container" ref={calendarRef}>
      <div
        className="calendar-display"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <span>{formatDisplayDate()}</span>
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
      {isExpanded && startDate && (
        <div className="calendar">
          <div className="calendar-header">
            <button type="button" onClick={handlePrevWeek}>
              &lt;
            </button>
            <span>
              {startDate.format('DD MMM')} -{' '}
              {startDate.clone().add(13, 'days').format('DD MMM YYYY')}
            </span>
            <button type="button" onClick={handleNextWeek}>
              &gt;
            </button>
          </div>
          <div className="calendar-weeks-wrapper">
            <table className="calendar-table">
              <thead>
                <tr>
                  {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 2 }).map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {days
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((dayObj, index) => {
                        const isSelected =
                          selectedDate &&
                          isSameDay(
                            dayObj.date,
                            moment(selectedDate, 'YYYY-MM-DD').tz(
                              'Europe/Amsterdam'
                            )
                          );
                        const classNames = [];
                        if (dayObj.isPast) {
                          classNames.push('gray-out');
                        } else if (dayObj.isAvailable) {
                          classNames.push('available');
                        } else {
                          classNames.push('unavailable');
                        }
                        if (isSelected) {
                          classNames.push('selected');
                        }

                        return (
                          <td
                            key={index}
                            className={classNames.join(' ')}
                            onClick={() => handleDateClick(dayObj)}
                            style={{
                              '--animation-order': index + weekIndex * 7,
                            }}
                          >
                            <div className="day-square">
                              {dayObj.date.date()}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
