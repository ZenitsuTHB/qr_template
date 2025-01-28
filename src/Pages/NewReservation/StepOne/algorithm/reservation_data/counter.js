// counter.js

/**
 * Parses a time string in "HH:MM" format into minutes since midnight.
 * @param {string} timeStr - The time string in "HH:MM" format.
 * @returns {number} The time in minutes since midnight.
 */
function parseTime(timeStr) {
	const [hours, minutes] = timeStr.split(':').map(Number);
	return hours * 60 + minutes;
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
   * Calculates the total number of guests for reservations that cover a specific hour on a specific date.
   * @param {Object} data - The main data object containing general settings.
   * @param {Array} reservations - An array of reservation objects.
   * @param {string} hour - The hour to check in "HH:MM" format.
   * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
   * @returns {number} The total number of guests for that hour on the specified date.
   */
  function getGuestCountAtHour(data, reservations, hour, dateStr) {
	// Get 'duurReservatie' from general settings, default to 120 if not set or zero
	let duurReservatie = getDuurReservatie(data)
  
	// Convert the target hour to minutes since midnight
	const targetTime = parseTime(hour);
  
	let totalGuests = 0;
  
	for (const reservation of reservations) {
	  // Only consider reservations on the specified date
	  if (reservation.date !== dateStr) {
		continue;
	  }
  
	  const startTime = parseTime(reservation.time);

	  const endTime = startTime + duurReservatie; // Use 'duurReservatie' from general settings
  	  // Check if the target time is within the reservation time range
	  // Start time is inclusive, end time is exclusive
	  if (targetTime >= startTime && targetTime < endTime) {
		totalGuests += parseInt(reservation.guests, 10);
	  }
	}
  
	return totalGuests;
  }
  
  module.exports = {
	getGuestCountAtHour,
  };
  