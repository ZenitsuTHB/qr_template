const { getDailyGuestCounts } = require('./dailyGuestCounts');
const { getMealTypesWithShifts } = require('./mealTypeCount');
const { getDataByDateAndMealWithExceptions } = require('../restaurant_data/exceptions');
const { getMealTypeByTime, parseTime: parseTimeOH } = require('../restaurant_data/openinghours');

/**
 * Parses a time string in "HH:MM" format into minutes since midnight.
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Retrieves interval and duurReservatie from general settings
 */
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

function getDuurReservatie(data) {
  let duurReservatie = 120;
  if (
    data['general-settings'] &&
    data['general-settings'].duurReservatie &&
    parseInt(data['general-settings'].duurReservatie, 10) > 0
  ) {
    duurReservatie = parseInt(data['general-settings'].duurReservatie, 10);
  }
  return duurReservatie;
}

/**
 * Determines if a given start time plus duurReservatie fits within the meal timeframe.
 */
function fitsWithinMeal(data, dateStr, startTimeStr, duurReservatie) {
  // Determine the meal type based on the start time
  const mealType = getMealTypeByTime(startTimeStr);
  if (!mealType) return false;

  // Get the meal data (with exceptions applied)
  const mealData = getDataByDateAndMealWithExceptions(data, dateStr, mealType);
  if (!mealData) return false;

  const mealEndTime = parseTime(mealData.endTime);
  const startTime = parseTime(startTimeStr);
  
  // Check if startTime + duurReservatie is within the mealEndTime
  return startTime + duurReservatie <= mealEndTime;
}

function timeblocksAvailable(data, dateStr, reservations, guests) {
  const duurReservatie = getDuurReservatie(data);
  const intervalReservatie = getInterval(data);

  // Slots needed
  const slotsNeeded = Math.ceil(duurReservatie / intervalReservatie);

  // Get guest counts and shifts info
  const { guestCounts, shiftsInfo } = getDailyGuestCounts(data, dateStr, reservations);

  const availableTimeblocks = {};

  // Handle shifts first
  const mealTypesWithShifts = getMealTypesWithShifts(data, dateStr);
  if (mealTypesWithShifts.length > 0 && shiftsInfo && shiftsInfo.length > 0) {
    for (const shift of shiftsInfo) {
      const { time, availableSeats } = shift;
      if (availableSeats >= guests && fitsWithinMeal(data, dateStr, time, duurReservatie)) {
        availableTimeblocks[time] = { name: time };
      }
    }
  }

  // Handle non-shift times
  if (guestCounts && Object.keys(guestCounts).length > 0) {
    const timeSlots = Object.keys(guestCounts).sort((a, b) => parseTime(a) - parseTime(b));

    for (let i = 0; i <= timeSlots.length - slotsNeeded; i++) {
      // Check capacity for all needed slots
      let consecutiveSlotsAvailable = true;
      if (guestCounts[timeSlots[i]] < guests) {
        continue;
      }

      let previousTime = parseTime(timeSlots[i]);
      for (let j = 1; j < slotsNeeded; j++) {
        const currentTimeSlot = timeSlots[i + j];
        const currentTime = parseTime(currentTimeSlot);

        // Check interval and capacity
        if ((currentTime - previousTime) !== intervalReservatie || guestCounts[currentTimeSlot] < guests) {
          consecutiveSlotsAvailable = false;
          break;
        }
        previousTime = currentTime;
      }

      // If all consecutive slots are available, check if the full duration fits
      if (consecutiveSlotsAvailable && fitsWithinMeal(data, dateStr, timeSlots[i], duurReservatie)) {
        availableTimeblocks[timeSlots[i]] = { name: timeSlots[i] };
      }
    }
  }

  return availableTimeblocks;
}

module.exports = {
  timeblocksAvailable,
};
