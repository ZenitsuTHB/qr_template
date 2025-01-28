// src/Pages/NewReservation/Utils/dates/blockDates.js

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

const processTimeblock = (block) => {
  if (!block.date) {
    return;
  }

  const dateString = DateTime.fromISO(block.date, { zone: 'Europe/Brussels' }).toISODate();

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
    // Use the block's times
    if (!window.dateDictionary[dateString]) {
      window.dateDictionary[dateString] = [];
    }
    window.dateDictionary[dateString].push({
      startTime: block.startTime || null,
      endTime: block.endTime || null,
    });
  }

  // Process shifts
  if (block.shifts && Array.isArray(block.shifts) && block.shifts.length > 0) {
    const shiftsArray = getOrInitializeArray(window.shiftsPerDate, dateString);

    block.shifts.forEach((shift) => {
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

export const getBlockSettingsDates = (timeblocks) => {
  initializeDictionaries();
  const dates = [];

  timeblocks.forEach((block) => {
    processTimeblock(block);
    // Do not add date if not in dateDictionary (i.e., date was skipped)
    if (block.date) {
      const dateString = DateTime.fromISO(block.date, { zone: 'Europe/Brussels' }).toISODate();
      if (window.dateDictionary[dateString]) {
        dates.push(dateString);
      }
    }
  });

  return dates;
};
