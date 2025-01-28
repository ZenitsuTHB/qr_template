// dailyGuestCounts.js

const { getGuestCountsForMeal } = require('./mealTypeCount');

/**
 * Calculates guest counts for breakfast, lunch, and dinner, and combines the results into a flat object.
 * If time slots overlap, the available seats from the latest meal (dinner > lunch > breakfast) are used.
 * @param {Object} data - The main data object.
 * @param {string} dateStr - The date string (YYYY-MM-DD).
 * @param {Array} reservations - An array of reservation objects.
 * @returns {Object} An object containing combined guest counts for all meals with time slots as keys,
 *                   and an array of shiftsInfo containing shift details.
 */
function getDailyGuestCounts(data, dateStr, reservations) {
  // Define meal types in order of priority (lowest to highest)
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const combinedGuestCounts = {};
  const shiftsInfo = [];
  const mealPriority = {
    'breakfast': 1,
    'lunch': 2,
    'dinner': 3
  };

  for (const mealType of mealTypes) {
    const result = getGuestCountsForMeal(data, dateStr, mealType, reservations);
    if (result) {
      const { guestCounts, shiftsInfo: mealShiftsInfo } = result;

      // Merge guestCounts into combinedGuestCounts
      for (const [time, availableSeats] of Object.entries(guestCounts)) {
        if (combinedGuestCounts.hasOwnProperty(time)) {
          // Compare meal priorities
          const existingMealPriority = combinedGuestCounts[time].mealPriority;
          const currentMealPriority = mealPriority[mealType];

          if (currentMealPriority >= existingMealPriority) {
            // Update with the current meal's available seats and priority
            combinedGuestCounts[time] = {
              availableSeats,
              mealPriority: currentMealPriority
            };
          }
          // Else, keep the existing value
        } else {
          // Add new time slot with available seats and meal priority
          combinedGuestCounts[time] = {
            availableSeats,
            mealPriority: mealPriority[mealType]
          };
        }
      }

      // Merge shiftsInfo
      if (mealShiftsInfo && mealShiftsInfo.length > 0) {
        shiftsInfo.push(...mealShiftsInfo);
      }
    }
    // Else do nothing if the meal is not available
  }

  // Extract only the availableSeats for the final output
  const finalGuestCounts = {};
  for (const [time, data] of Object.entries(combinedGuestCounts)) {
    finalGuestCounts[time] = data.availableSeats;
  }

  return { guestCounts: finalGuestCounts, shiftsInfo };
}

module.exports = {
  getDailyGuestCounts,
};
