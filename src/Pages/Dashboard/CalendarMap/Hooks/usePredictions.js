// src/components/Calendar/Hooks/usePredictions.js

import { useState, useEffect } from 'react';
import { median, mean } from '../Utils/predictionUtils';
import { getStartAndEndOfMonth, generateDatesArray } from '../Utils/dateUtils';
import { maxCapacity } from '../reservationData';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

const usePredictions = (
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode
) => {
  const [predictionsByDate, setPredictionsByDate] = useState({});

  // Parameters for prediction algorithm weights
  const WEIGHT_MEDIAN14 = 0;
  const WEIGHT_MEDIAN20 = 0;
  const WEIGHT_AVERAGE90 = 1;
  const WEIGHT_CURRENT_RESERVATIONS = 0.2;
  const MULTIPLIER_BASE_PREDICTION = 2;

  useEffect(() => {
    if (selectedViewMode !== 'Voorspelling') {
      setPredictionsByDate({});
      return;
    }

    const { start, end } = getStartAndEndOfMonth(currentDate);
    const datesArray = generateDatesArray(start, end);
    const predictions = {};
    const today = new Date();

    // Helper function to get reservations for a date
    const getReservationsForDate = (dateStr) => {
      const reservations = reservationsByDate[dateStr] || [];
      return reservations.filter((res) => {
        return (
          selectedShift === 'Dag' ||
          (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
          (selectedShift === 'Middag' && res.timeSlot === 1) ||
          (selectedShift === 'Avond' && res.timeSlot === 2)
        );
      });
    };

    // Prepare historical data
    const historicalData = [];

    // Build historical data for all dates
    datesArray.forEach((date) => {
      const dateStr = formatDateForFilter(date);
      const reservationsForDate = getReservationsForDate(dateStr);
      const totalGuests = reservationsForDate.reduce((sum, res) => sum + res.aantalGasten, 0);
      historicalData.push({ date, totalGuests });
    });

    // Start predictions from tomorrow
    const startIndex = datesArray.findIndex((date) => date > today);
    if (startIndex === -1) {
      setPredictionsByDate({});
      return;
    }

    // Use a copy of historicalData to avoid mutating the original during prediction
    const extendedHistoricalData = [...historicalData];

    for (let i = startIndex; i < datesArray.length; i++) {
      const currentDate = datesArray[i];
      const currentDateStr = formatDateForFilter(currentDate);
      const currentReservations = getReservationsForDate(currentDateStr);
      const currentTotalGuests = currentReservations.reduce((sum, res) => sum + res.aantalGasten, 0);

      // Collect data for medians and average
      const past14Days = extendedHistoricalData.slice(Math.max(0, i - 14), i);
      const past20Days = extendedHistoricalData
        .slice(Math.max(0, i - 20), i)
        .filter((data) => data.totalGuests > 0);
      const past90DaysSameDay = extendedHistoricalData.filter((data, idx) => {
        return (
          data.date.getDay() === currentDate.getDay() &&
          idx < i &&
          (currentDate - data.date) / (1000 * 60 * 60 * 24) <= 90
        );
      });

      // Calculate medians and average
      const median14Values = past14Days.map((d) => d.totalGuests);
      const median14 = median14Values.length ? median(median14Values) : 0;

      const median20Values = past20Days.map((d) => d.totalGuests);
      const median20 = median20Values.length ? median(median20Values) : 0;

      const average90Values = past90DaysSameDay.map((d) => d.totalGuests);
      const average90 = average90Values.length ? mean(average90Values) : 0;

      // Calculate base prediction
      const factors = [];
      if (median14) factors.push(median14 * WEIGHT_MEDIAN14);
      if (median20) factors.push(median20 * WEIGHT_MEDIAN20);
      if (average90) factors.push(average90 * WEIGHT_AVERAGE90);

      const factorsCount = factors.length || 1;
      const basePrediction =
        (factors.reduce((a, b) => a + b, 0) / factorsCount) * MULTIPLIER_BASE_PREDICTION;

      const adjustedCurrentReservations = (currentTotalGuests / 5) * WEIGHT_CURRENT_RESERVATIONS;

      let prediction = basePrediction + adjustedCurrentReservations;

      // Use max between prediction and current reservations
      if (prediction < currentTotalGuests) {
        prediction = currentTotalGuests;
      }

      // Cap prediction at maxCapacity
      if (prediction > maxCapacity) {
        prediction = maxCapacity;
      }

      // Round prediction
      if (prediction < 1) {
        prediction = 0;
      }

      predictions[currentDateStr] = Math.round(prediction);

      // Update extendedHistoricalData with predicted value
      extendedHistoricalData.push({ date: currentDate, totalGuests: prediction });
    }

    setPredictionsByDate(predictions);
  }, [currentDate, reservationsByDate, selectedShift, selectedViewMode]);

  return predictionsByDate;
};

export default usePredictions;
