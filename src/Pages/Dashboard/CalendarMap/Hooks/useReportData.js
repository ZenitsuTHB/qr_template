// src/hooks/useReportData.js

import { useState, useEffect } from 'react';
import {
  calculateMedian,
  calculateAverage,
} from '../Utils/reportUtils';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

/**
 * Custom hook to generate report data and calculate statistics.
 *
 * @param {Array} dates - Array of date objects.
 * @param {Object} reservationsByDate - Reservations mapped by date string.
 * @param {String} selectedShift - Selected shift ('Dag', 'Ochtend', 'Middag', 'Avond').
 * @param {Boolean} autoGenerate - Flag to auto-generate report.
 * @returns {Object} - Contains report data, statistics, and loading state.
 */


const useReportData = (dates, reservationsByDate, selectedShift, autoGenerate) => {
  const [reportGenerated, setReportGenerated] = useState(autoGenerate);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [totalGuests, setTotalGuests] = useState(0); // Total guests over the period

  useEffect(() => {
    if (autoGenerate) {
      generateReportData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates, reservationsByDate, selectedShift, autoGenerate]);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      generateReportData();
      setLoading(false);
      setReportGenerated(true);
    }, 2000); // Simulate 2 seconds loading time
  };

  const generateReportData = () => {
    let totals = [0, 0, 0]; // [Morning, Afternoon, Evening]
    let dailyTotalsTemp = []; // To store total guests per day
    let totalGuestsTemp = 0; // Total guests over the period

    dates.forEach(({ date }) => {
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
          totals[reservation.timeSlot] += reservation.aantalGasten;
          shiftTotals[reservation.timeSlot] += reservation.aantalGasten;
          dayTotal += reservation.aantalGasten;
        }
      });

      totalGuestsTemp += dayTotal;

      dailyTotalsTemp.push({
        date,
        total: dayTotal,
        shiftTotals,
      });
    });

    setTotalGuests(totalGuestsTemp);

    // Calculate statistical data
    if (dailyTotalsTemp.length > 0) {
      const guestCounts = dailyTotalsTemp.map((day) => day.total);
      const min = Math.min(...guestCounts);
      const max = Math.max(...guestCounts);
      const median = calculateMedian(guestCounts);
      const average = calculateAverage(guestCounts);
      const highest = dailyTotalsTemp.find((day) => day.total === max);
      const lowest = dailyTotalsTemp.find((day) => day.total === min);

      setStats({
        minGuests: min,
        maxGuests: max,
        medianGuests: median,
        averageGuests: average.toFixed(2),
        lowestDay: lowest ? lowest.date : null,
        highestDay: highest ? highest.date : null,
      });
    }

    setReportGenerated(true);
  };

  return {
    reportGenerated,
    loading,
    handleGenerateReport,
    stats,
    totalGuests,
    setReportGenerated, // In case you need to reset or control from the component
  };
};

export default useReportData;
