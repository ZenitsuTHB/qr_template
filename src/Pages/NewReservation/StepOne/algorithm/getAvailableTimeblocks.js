// getAvailableTimeblocks.js

const { timeblocksAvailable } = require('./processing/timeblocksAvailable');

/**
 * Parses a time string in "HH:MM" format into a Date object on a specific date.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {Date} Date object representing the time on the specified date and time zone.
 */
function parseDateTimeInTimeZone(dateStr, timeStr, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a date object in UTC
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  // Convert that UTC date/time to the specified time zone
  const dateInTimeZone = new Date(
    date.toLocaleString('en-US', { timeZone: timeZone })
  );
  return dateInTimeZone;
}

/**
 * Gets the available time blocks or shifts for a reservation, considering 'uurOpVoorhand' and 'dagenInToekomst'.
 * @param {Object} data - The main data object containing settings and meal information.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} guests - The number of guests for the reservation.
 * @returns {Object} - Returns a pruned object of available time blocks or shifts, or an empty object if out of range.
 */
function getAvailableTimeblocks(data, dateStr, reservations, guests) {
  // Get 'uurOpVoorhand' from general settings
  let uurOpVoorhand = 4;
  if (
    data['general-settings'] &&
    data['general-settings'].uurOpVoorhand &&
    parseInt(data['general-settings'].uurOpVoorhand, 10) >= 0
  ) {
    uurOpVoorhand = parseInt(data['general-settings'].uurOpVoorhand, 10);
  }

  // Get 'dagenInToekomst' from general settings
  let dagenInToekomst = 90; // Default if not defined
  if (
    data['general-settings'] &&
    data['general-settings'].dagenInToekomst &&
    parseInt(data['general-settings'].dagenInToekomst, 10) > 0
  ) {
    dagenInToekomst = parseInt(data['general-settings'].dagenInToekomst, 10);
  }

  // Time zone for CEST/CET (Europe/Amsterdam)
  const timeZone = 'Europe/Amsterdam';

  // Current date/time in CEST
  const now = new Date();
  const currentTimeInTimeZone = new Date(
    now.toLocaleString('en-US', { timeZone: timeZone })
  );

  // Calculate the maximum allowed date
  const maxAllowedDate = new Date(currentTimeInTimeZone.getTime());
  maxAllowedDate.setDate(maxAllowedDate.getDate() + dagenInToekomst);
  maxAllowedDate.setHours(23, 59, 59, 999);

  // Parse the target date in the specified time zone
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const targetDateInTimeZone = new Date(
    targetDate.toLocaleString('en-US', { timeZone: timeZone })
  );

  // Check if targetDateInTimeZone is within dagenInToekomst
  if (targetDateInTimeZone > maxAllowedDate) {
    // Out of allowed range, return empty object
    return {};
  }

  // Check if the target date is today in the specified time zone
  const isToday =
    currentTimeInTimeZone.toDateString() === targetDateInTimeZone.toDateString();

  // Get available time blocks or shifts
  const availableTimeblocks = timeblocksAvailable(data, dateStr, reservations, guests);

  // If the date is today and uurOpVoorhand is greater than zero, prune time blocks
  if (isToday && uurOpVoorhand >= 0) {
    const cutoffTime = new Date(currentTimeInTimeZone.getTime());
    cutoffTime.setHours(cutoffTime.getHours() + uurOpVoorhand);

    for (const [key, value] of Object.entries(availableTimeblocks)) {
      let timeStr = key;

      const timeBlockDateTime = parseDateTimeInTimeZone(dateStr, timeStr, timeZone);

      if (timeBlockDateTime < cutoffTime) {
        delete availableTimeblocks[key];
      }
    }
  }

  return availableTimeblocks;
}

module.exports = {
  getAvailableTimeblocks,
};
