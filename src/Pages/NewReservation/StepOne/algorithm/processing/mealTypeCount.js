// mealTypeCount.js

const { getDataByDateAndMealWithExceptions } = require('../restaurant_data/exceptions');
const { parseTime } = require('../restaurant_data/openinghours');
const { getGuestCountAtHour } = require('../reservation_data/counter');

function getInterval(data) {
  let intervalReservatie = 15;
  if (
    data['general-settings'] &&
    data['general-settings'].intervalReservatie &&
    parseInt(data['general-settings'].intervalReservatie, 10) > 0
  ) {
    intervalReservatie = parseInt(data['general-settings'].intervalReservatie, 10);
  }
  return intervalReservatie;
}

/**
 * Retrieves meal types with shifts enabled and at least one shift defined for the specified date.
 * @param {Object} data - The main data object.
 * @param {string} dateStr - The date string (YYYY-MM-DD).
 * @returns {Array} - An array of meal types with shifts.
 */
function getMealTypesWithShifts(data, dateStr) {
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const mealTypesWithShifts = [];

  for (const mealType of mealTypes) {
    const mealData = getDataByDateAndMealWithExceptions(data, dateStr, mealType);
    if (
      mealData &&
      mealData.shiftsEnabled &&
      Array.isArray(mealData.shifts) &&
      mealData.shifts.length > 0
    ) {
      mealTypesWithShifts.push(mealType);
    }
  }

  return mealTypesWithShifts;
}

function shouldIncludeEndTime(mealType, endTime) {  
  if ((mealType === 'breakfast' && endTime === '11:00') ||
      (mealType === 'lunch' && endTime === '16:00')) {
    return false; // Do not include endTime for breakfast at 11:00 and lunch at 16:00
  }
  return true; // Include endTime for all other cases
}

/**
 * Calculates guest counts for each interval during a meal period or at shift times.
 * @param {Object} data - The main data object.
 * @param {string} dateStr - The date string (YYYY-MM-DD).
 * @param {string} mealType - The meal type ("breakfast", "lunch", "dinner").
 * @param {Array} reservations - An array of reservation objects.
 * @returns {Object|null} An object mapping times to guest counts, or null if meal is not available.
 */
function getGuestCountsForMeal(data, dateStr, mealType, reservations) {
  const mealData = getDataByDateAndMealWithExceptions(data, dateStr, mealType);
  if (!mealData) {
    return null;
  }

  const guestCounts = {};
  const shiftsInfo = [];

  // Get 'intervalReservatie' from general settings, default to 15 if not set or zero
  let intervalReservatie = getInterval(data);

  // Check if shifts are enabled and shifts array has valid content
  if (
    mealData.shiftsEnabled &&
    Array.isArray(mealData.shifts) &&
    mealData.shifts.length > 0
  ) {
    // If shifts are enabled and valid, calculate guest counts at shift times
    const shifts = mealData.shifts; // Array of shifts

    for (const shift of shifts) {
      const timeStr = shift.time; // Time of the shift in "HH:MM" format

      // Get guest count at this time
      const guestCount = getGuestCountAtHour(data, reservations, timeStr, dateStr);

      // Store in guestCounts
      guestCounts[timeStr] = mealData.maxCapacity - guestCount;

      // Store shift information
      shiftsInfo.push({
        mealType,
        shiftName: shift.name,
        time: timeStr,
        availableSeats: mealData.maxCapacity - guestCount,
      });
    }
  } else {
    // If shifts are not enabled or shifts array is empty/invalid, calculate guest counts at intervals
    const startTime = mealData.startTime;
    const endTime = mealData.endTime;

    // Determine if endTime should be included
    const includeEndTime = shouldIncludeEndTime(mealType, endTime);

    // Convert startTime and endTime to minutes since midnight
    let currentTime = parseTime(startTime);
    const endTimeMinutes = parseTime(endTime);

    while (includeEndTime ? currentTime <= endTimeMinutes : currentTime < endTimeMinutes) {
      // Convert currentTime back to "HH:MM" format
      const hours = Math.floor(currentTime / 60).toString().padStart(2, '0');
      const minutes = (currentTime % 60).toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      // Get guest count at this time
      const guestCount = getGuestCountAtHour(data, reservations, timeStr, dateStr);

      // Store in guestCounts
      guestCounts[timeStr] = mealData.maxCapacity - guestCount;

      // Increment currentTime by 'intervalReservatie' minutes
      currentTime += intervalReservatie;
    }
  }

  return { guestCounts, shiftsInfo };
}

module.exports = {
  getGuestCountsForMeal,
  getMealTypesWithShifts, // Exported
};
