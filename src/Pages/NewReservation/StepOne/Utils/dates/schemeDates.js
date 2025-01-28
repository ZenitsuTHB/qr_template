// src/Pages/NewReservation/Utils/dates/schemeDates.js

import { DateTime } from 'luxon';

const getOrInitializeArray = (dict, key) => {
  if (!Array.isArray(dict[key])) {
    dict[key] = [];
  }
  return dict[key];
};

const initializeDictionaries = () => {
  window.dateDictionary = window.dateDictionary || {};
  window.shiftsPerDate = window.shiftsPerDate || {};
};

const isWithinPeriod = (currentDate, endDate) => {
  return currentDate <= endDate;
};

const processDaySetting = (dateString, daySetting) => {
  // Check if date is in closedDates
  if (window.closedDates.has(dateString)) {
    return;
  }

  // Check for exceptional openings
  if (window.exceptionalOpenings[dateString]) {
    const exceptionalOpening = window.exceptionalOpenings[dateString];
    window.dateDictionary[dateString] = [
      {
        startTime: exceptionalOpening.startTime,
        endTime: exceptionalOpening.endTime,
      },
    ];
  } else {
    // Use the daySetting's times
    if (!window.dateDictionary[dateString]) {
      window.dateDictionary[dateString] = [];
    }
    window.dateDictionary[dateString].push({
      startTime: daySetting.startTime || null,
      endTime: daySetting.endTime || null,
    });
  }

  // Process shifts
  if (
    daySetting.shiftsEnabled &&
    Array.isArray(daySetting.shifts) &&
    daySetting.shifts.length > 0
  ) {
    const shiftsArray = getOrInitializeArray(window.shiftsPerDate, dateString);

    daySetting.shifts.forEach((shift) => {
      const exists = shiftsArray.some(
        (existingShift) =>
          existingShift.name === shift.name && existingShift.startTime === shift.startTime
      );
      if (!exists) {
        shiftsArray.push({
          name: shift.name || '',
          startTime: shift.startTime || '',
          endTime: shift.endTime || null,
        });
      }
    });
  }
};

export const getSchemeSettingsDates = (timeblocks, maxDate) => {
  initializeDictionaries();
  const dates = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  timeblocks.forEach((block) => {
    if (!block.schemeSettings) {
      return;
    }

    const { schemeSettings } = block;
    let currentDate = DateTime.now().setZone('Europe/Brussels').startOf('day');

    // Adjust endDate based on dagenInToekomst
    let endDate = maxDate;

    if (schemeSettings.period && schemeSettings.period.enabled) {
      const { startDate, endDate: periodEndDate } = schemeSettings.period;
      if (startDate && periodEndDate) {
        currentDate = DateTime.fromISO(startDate, { zone: 'Europe/Brussels' }).startOf('day');
        const schemeEndDate = DateTime.fromISO(periodEndDate, { zone: 'Europe/Brussels' }).endOf('day');
        // Use the minimum of schemeEndDate and maxDate
        endDate = schemeEndDate < maxDate ? schemeEndDate : maxDate;
      }
    }

    while (isWithinPeriod(currentDate, endDate)) {
      const dayOfWeek = currentDate.weekday % 7;
      const dayName = dayNames[dayOfWeek];
      const daySetting = schemeSettings[dayName];
      const dateString = currentDate.toISODate();
      if (daySetting && daySetting.enabled) {
        processDaySetting(dateString, daySetting);
        if (window.dateDictionary[dateString]) {
          dates.push(dateString);
        }
      }
      currentDate = currentDate.plus({ days: 1 });
    }
  });
  return dates;
};
