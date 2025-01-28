// src/components/MonthReport.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import useReportData from '../Hooks/useReportData';
import {
  groupDatesIntoWeeks,
  getDutchDateString,
  getDutchDayName, // Ensure this is imported from reportUtils.js
  statLabels,
} from '../Utils/reportUtils';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

// CollapsibleBlock Component remains unchanged
const CollapsibleBlock = ({ weekNumber, dates, reservationsByDate, selectedShift }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate week label
  const weekLabel = `Week ${weekNumber}`;

  // Function to calculate total guests per day
  const calculateDailyGuests = (date) => {
    const dateString = formatDateForFilter(date);
    const reservations = reservationsByDate[dateString] || [];
    let totalGuests = 0;

    reservations.forEach((reservation) => {
      if (
        selectedShift === 'Dag' ||
        (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
        (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
        (selectedShift === 'Avond' && reservation.timeSlot === 2)
      ) {
        totalGuests += reservation.aantalGasten;
      }
    });

    return totalGuests;
  };

  // Calculate total guests for the week
  const totalGuestsForWeek = dates.reduce((total, day) => {
    return total + calculateDailyGuests(day.date);
  }, 0);

  return (
    <div className="collapsible-block">
      <div
        className="block-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="block-title">{weekLabel}</div>
        <FaChevronDown
          className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="block-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <table className="week-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Dag</th>
                  <th>Aantal Gasten</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((day, index) => (
                  <tr key={index}>
                    <td>{getDutchDateString(day.date)}</td>
                    <td>{getDutchDayName(day.date)}</td>
                    <td>{calculateDailyGuests(day.date)}</td>
                  </tr>
                ))}
                <tr className="totals-styled">
                  <td><strong>Totaal</strong></td>
                  <td></td>
                  <td><strong>{totalGuestsForWeek}</strong></td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MonthReport = ({ dates, reservationsByDate, selectedShift, autoGenerate = false }) => {
  const [weeks, setWeeks] = useState([]); // Array of weeks, each week is an array of dates

  const {
    reportGenerated,
    loading,
    handleGenerateReport,
    stats,
    totalGuests,
  } = useReportData(dates, reservationsByDate, selectedShift, autoGenerate);

  useEffect(() => {
    // Group dates into weeks
    const groupedWeeks = groupDatesIntoWeeks(dates);
    setWeeks(groupedWeeks);
  }, [dates]);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="month-report">
      {!reportGenerated && !loading && !autoGenerate && (
        <div
          className="generate-report-text"
          onClick={handleGenerateReport}
          style={{ color: 'var(--color-blue)', cursor: 'pointer' }}
        >
          Genereer rapport
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="progress-bar"></div>
          <div>Laden...</div>
        </div>
      )}

      {(reportGenerated || autoGenerate) && (
        <motion.div
          className="calendar-report-table"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Updated Title Section */}
          <div className="calendar-report-title">
            Maandrapport {selectedShift !== 'Dag' && `- ${selectedShift}`}
          </div>

          {/* Render collapsible blocks for each week */}
          <div className="weeks-container">
            {weeks.map((weekDates, weekIndex) => (
              <CollapsibleBlock
                key={weekIndex}
                weekNumber={weekIndex + 1}
                dates={weekDates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
              />
            ))}
          </div>

          {/* Add margin between weeks and statistics */}
          <div className="statistics-separator"></div>

          {/* Render statistical data for the entire month */}
          <div className="statistical-data">
            <table>
              <thead>
                <tr>
                  <th>Statistiek</th>
                  <th>Waarde</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).map(([key, value], index) => (
                  <motion.tr key={index} variants={rowVariants}>
                    <td>{statLabels[key]}</td>
                    <td>
                      {key.includes('Day') && value
                        ? getDutchDayName(value)
                        : value}
                    </td>
                  </motion.tr>
                ))}
                <motion.tr variants={rowVariants} className="totals-styled">
                  <td><strong>Totaal aantal gasten</strong></td>
                  <td>{totalGuests}</td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MonthReport;
