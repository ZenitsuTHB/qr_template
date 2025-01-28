// src/components/WeekReport.js

import React from 'react';
import './css/weekReport.css';
import { motion } from 'framer-motion';
import useReportData from '../Hooks/useReportData';
import { getDutchDayName, statLabels } from '../Utils/reportUtils';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

// Define the available shifts
const shifts = [
  { label: 'Ochtend', timeSlot: 0 },
  { label: 'Middag', timeSlot: 1 },
  { label: 'Avond', timeSlot: 2 },
];

const WeekReport = ({ dates, reservationsByDate, selectedShift, autoGenerate = false }) => {
  const {
    reportGenerated,
    loading,
    handleGenerateReport,
    stats,
    totalGuests,
  } = useReportData(dates, reservationsByDate, selectedShift, autoGenerate);

  // Define which shifts to display based on selectedShift
  const visibleShifts = selectedShift === 'Dag'
    ? shifts
    : shifts.filter(shift => shift.label === selectedShift);

  // Calculate total guests by shift
  const totalGuestsByShift = [0, 0, 0]; // [Morning, Afternoon, Evening]
  dates.forEach(({ date }) => {
    const dateString = formatDateForFilter(date)
    const reservations = reservationsByDate[dateString] || [];

    reservations.forEach((reservation) => {
      if (
        selectedShift === 'Dag' ||
        (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
        (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
        (selectedShift === 'Avond' && reservation.timeSlot === 2)
      ) {
        totalGuestsByShift[reservation.timeSlot] += reservation.aantalGasten;
      }
    });
  });

  // Calculate total guests for all visible shifts
  const totalGuestsAllShifts = visibleShifts.reduce(
    (sum, shift) => sum + totalGuestsByShift[shift.timeSlot],
    0
  );

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
    <div className="week-report">
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
            Weekrapport {selectedShift !== 'Dag' && `- ${selectedShift}`}
          </div>

          <table>
            <thead>
              <tr>
                <th>Dag</th>
                {visibleShifts.map((shift) => (
                  <th key={shift.timeSlot}>{shift.label}</th>
                ))}
                <th>Totaal</th>
              </tr>
            </thead>
            <tbody>
              {dates.map(({ date }, index) => {
                const dateString = formatDateForFilter(date);
                const reservations = reservationsByDate[dateString] || [];
                let dayTotal = 0;
                let shiftTotals = [0, 0, 0];

                reservations.forEach((reservation) => {
                  if (
                    selectedShift === 'Dag' ||
                    (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
                    (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
                    (selectedShift === 'Avond' && reservation.timeSlot === 2)
                  ) {
                    shiftTotals[reservation.timeSlot] += reservation.aantalGasten;
                    dayTotal += reservation.aantalGasten;
                  }
                });

                return (
                  <motion.tr key={index} variants={rowVariants}>
                    <td>{getDutchDayName(date)}</td>
                    {visibleShifts.map((shift) => (
                      <td key={shift.timeSlot}>{shiftTotals[shift.timeSlot]}</td>
                    ))}
                    <td>{dayTotal}</td>
                  </motion.tr>
                );
              })}
              <motion.tr variants={rowVariants} className='totals-styled'>
                <td>
                  <strong>Totaal</strong>
                </td>
                {visibleShifts.map((shift) => (
                  <td key={shift.timeSlot}>
                    {totalGuestsByShift[shift.timeSlot]}
                  </td>
                ))}
                <td>
                  <strong>{totalGuestsAllShifts}</strong>
                </td>
              </motion.tr>
            </tbody>
          </table>

          {/* Statistical data */}
          <motion.div className="statistical-data" variants={containerVariants}>
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
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default WeekReport;
