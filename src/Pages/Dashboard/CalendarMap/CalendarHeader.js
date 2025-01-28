import React, { useState, useRef, useEffect } from 'react';
import './css/calendarHeader.css';
import {
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
  FaChevronDown,
  FaFile,
  FaCalendarAlt, // Added for calendar icon in tooltip
} from 'react-icons/fa';
import ShiftSelector from './ShiftSelector';
import ViewModeSelector from './ViewModeSelector';

const CalendarHeader = ({
  currentDate,
  onPrev,
  onNext,
  selectedShift,
  setSelectedShift,
  selectedViewMode,
  setSelectedViewMode,
  isChartView,
  toggleChartView,
  weekOrMonthView,
  setWeekOrMonthView,
  onGenerateReport,
}) => {
  const monthNames = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];

  // Utility function to get the Monday of the week for a given date
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const currentWeekStart = getMonday(currentDate);

  const [isViewOptionsOpen, setIsViewOptionsOpen] = useState(false);
  const viewOptionsRef = useRef(null);
  const viewButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewOptionsRef.current &&
        !viewOptionsRef.current.contains(event.target) &&
        viewButtonRef.current &&
        !viewButtonRef.current.contains(event.target)
      ) {
        setIsViewOptionsOpen(false);
      }
    };

    if (isViewOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewOptionsOpen]);

  const getWeekTitle = () => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End on Sunday

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = monthNames[start.getMonth()];
    const endMonth = monthNames[end.getMonth()];
    const year = start.getFullYear();

    if (start.getMonth() === end.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  };

  const getMonthTitle = () => {
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${month} ${year}`;
  };

  const handleViewOptionSelection = (option) => {
    setWeekOrMonthView(option);
    setIsViewOptionsOpen(false);
  };

  return (
    <div className="calendar-header">
      <div className="header-titles">
        {/* Previous Button */}
        <div className="button-with-tooltip">
          <button className="nav-button" onClick={onPrev}>
            <FaChevronLeft size={24} />
          </button>
        </div>

        {/* Next Button */}
        <div className="button-with-tooltip">
          <button className="nav-button" onClick={onNext} style={{ marginRight: '24px' }}>
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Title and View Options */}
        <div className="header-title-container">
          <h2>
            {weekOrMonthView === 'week' ? getWeekTitle() : getMonthTitle()}
          </h2>
          <div className="button-with-tooltip">
            <button
              className="view-options-button"
              onClick={() => setIsViewOptionsOpen(!isViewOptionsOpen)}
              ref={viewButtonRef}
              aria-label="Toggle view options"
            >
              <FaChevronDown size={16} />
            </button>
            {isViewOptionsOpen && (
              <div className="view-options-container" ref={viewOptionsRef}>
                <div
                  className="view-option"
                  onClick={() => handleViewOptionSelection('week')}
                >
                  Week
                </div>
                <div
                  className="view-option"
                  onClick={() => handleViewOptionSelection('month')}
                >
                  Maand
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-buttons">
        {/* Generate Report Button */}
        <div className="button-with-tooltip">
          <button
            onClick={onGenerateReport}
            className="standard-button blue toggle-button"
          >
            <FaFile size={16} />
          </button>
          <div className="tooltip">
            Bekijk Rapport
          </div>
        </div>

        {/* Toggle Chart View Button */}
        <div className="button-with-tooltip">
          <button
            onClick={toggleChartView}
            className="standard-button blue toggle-button"
          >
            {isChartView ? <FaCalendarAlt size={16} /> : <FaChartBar size={16} />}
          </button>
          <div className="tooltip">
            {isChartView ? 'Terug naar Kalender' : 'Bekijk Diagram'}
          </div>
        </div>

        {/* Shift Selector */}
        <div className="button-with-tooltip">
          <ShiftSelector
            selectedShift={selectedShift}
            setSelectedShift={setSelectedShift}
          />
          <div className="tooltip">
            Selecteer Shift
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="button-with-tooltip">
          <ViewModeSelector
            selectedViewMode={selectedViewMode}
            setSelectedViewMode={setSelectedViewMode}
          />
          <div className="tooltip">
            Selecteer Weergave
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
