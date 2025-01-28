// isDateAvailable.js

const { getAvailableTimeblocks } = require('./getAvailableTimeblocks');

/**
 * Parses a time string in "HH:MM" format into minutes since midnight.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @returns {number} Minutes since midnight.
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if a date is within the allowed future range defined by dagenInToekomst.
 * @param {Object} data - The main data object (to access general settings).
 * @param {string} dateStr - The date string (YYYY-MM-DD).
 * @returns {boolean} true if within range, false otherwise.
 */
function isDateWithinAllowedRange(data, dateStr) {
  // Get dagenInToekomst
  let dagenInToekomst = 90;
  if (
    data['general-settings'] &&
    data['general-settings'].dagenInToekomst &&
    parseInt(data['general-settings'].dagenInToekomst, 10) > 0
  ) {
    dagenInToekomst = parseInt(data['general-settings'].dagenInToekomst, 10);
  }

  const timeZone = 'Europe/Amsterdam';

  const now = new Date();
  const currentTimeInTimeZone = new Date(
    now.toLocaleString('en-US', { timeZone: timeZone })
  );

  const maxAllowedDate = new Date(currentTimeInTimeZone.getTime());
  maxAllowedDate.setDate(maxAllowedDate.getDate() + dagenInToekomst);
  maxAllowedDate.setHours(23, 59, 59, 999);

  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const targetDateInTimeZone = new Date(
    targetDate.toLocaleString('en-US', { timeZone: timeZone })
  );

  return targetDateInTimeZone <= maxAllowedDate;
}

/**
 * Checks if a date is available for a reservation of a specified number of guests.
 * This updated version uses `getAvailableTimeblocks` to ensure that it never returns
 * true if no actual time slots are available, including for today's date.
 * @param {Object} data - The main data object containing settings and meal information.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} guests - The number of guests for the reservation.
 * @returns {boolean} - Returns true if the date has at least one available timeblock, false otherwise.
 */
function isDateAvailable(data, dateStr, reservations, guests) {
  // Check if date is within allowed range
  if (!isDateWithinAllowedRange(data, dateStr)) {
    return false;
  }

  // Get available timeblocks using the existing logic
  const availableTimeblocks = getAvailableTimeblocks(data, dateStr, reservations, guests);

  // Return true only if we have at least one available timeblock
  return Object.keys(availableTimeblocks).length > 0;
}

module.exports = {
  isDateAvailable,
};
