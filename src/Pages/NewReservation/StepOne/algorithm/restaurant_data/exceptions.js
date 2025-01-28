// exceptions.js

const {
	getDataByDateAndMeal,
	getDataByDateAndTime,
	getMealTypeByTime,
	parseTime,
	shifts,
	daysOfWeekEnglish,
	daysOfWeekDutch,
} = require('./openinghours');

function isDateInRange(dateStr, startDateStr, endDateStr) {
	const date = new Date(dateStr);
	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);
	if (isNaN(date) || isNaN(startDate) || isNaN(endDate)) {
	  return false;
	}
	return date >= startDate && date <= endDate;
}

function getDutchDayOfWeek(date) {
	const dayIndex = date.getDay();
	return daysOfWeekDutch[dayIndex];
}

function doesExceptionApply(exception, dateStr, dateDayOfWeekDutch, mealType) {
	const { timeframe, startDate, endDate, daysOfWeek } = exception;

	if (!isDateInRange(dateStr, startDate, endDate)) {
	  return false;
	}

	if (Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
	  const daysOfWeekLower = daysOfWeek.map(day => day.toLowerCase());
	  if (!daysOfWeekLower.includes(dateDayOfWeekDutch)) {
		return false;
	  }
	}

	if (timeframe === 'Volledige Dag' || timeframe === mealType) {
	  return true;
	}

	return false;
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

function addDuurReservatieToEndTime(mealData, data) {
  const duurReservatie = getDuurReservatie(data);
  const endMinutes = parseTime(mealData.endTime);
  const newEndMinutes = endMinutes + duurReservatie;
  const hours = String(Math.floor(newEndMinutes / 60)).padStart(2, '0');
  const minutes = String(newEndMinutes % 60).padStart(2, '0');
  mealData.endTime = `${hours}:${minutes}`;
}

function mapExceptionToMealData(exception, data) {
	let mealData = {
	  enabled: true,
	  startTime: exception.startHour,
	  endTime: exception.endHour,
	  maxCapacityEnabled: exception.maxSeats ? true : false,
	  maxCapacity: exception.maxSeats || null,
	  shiftsEnabled: false,
	  shifts: [],
	};

	// Add duurReservatie to endTime
	addDuurReservatieToEndTime(mealData, data);

	return mealData;
}

function getDataByDateAndMealWithExceptions(data, dateStr, mealType) {
	const exceptions = data.exceptions || [];
	const date = new Date(dateStr);
	if (isNaN(date)) {
	  return null;
	}
	const dateDayOfWeekDutch = getDutchDayOfWeek(date).toLowerCase();

	const exceptionTypesPriority = ['Opening', 'Sluiting', 'Uitzondering'];

	for (const exceptionType of exceptionTypesPriority) {
	  for (const exception of exceptions) {
		if (exception.type === exceptionType) {
		  if (doesExceptionApply(exception, dateStr, dateDayOfWeekDutch, mealType)) {
			if (exceptionType === 'Sluiting') {
			  return null;
			} else {
			  return mapExceptionToMealData(exception, data);
			}
		  }
		}
	  }
	}

	return getDataByDateAndMeal(data, dateStr, mealType);
}

function shouldIncludeEndTime(mealType, endTime) {
	if ((mealType === 'breakfast' && endTime === '11:00') ||
		(mealType === 'lunch' && endTime === '16:00')) {
	  return false;
	}
	return true;
}

function getDataByDateAndTimeWithExceptions(data, dateStr, timeStr) {
	const mealType = getMealTypeByTime(timeStr);
	if (!mealType) {
	  return null;
	}
	const mealData = getDataByDateAndMealWithExceptions(data, dateStr, mealType);
	if (!mealData) {
	  return null;
	}

	const requestedTime = parseTime(timeStr);
	const startTime = parseTime(mealData.startTime);
	const endTime = parseTime(mealData.endTime);

	const includeEndTime = shouldIncludeEndTime(mealType, mealData.endTime);

	const timeFallsWithin =
	  includeEndTime
		? requestedTime >= startTime && requestedTime <= endTime
		: requestedTime >= startTime && requestedTime < endTime;

	return timeFallsWithin ? mealData : null;
}

module.exports = {
	getDataByDateAndMealWithExceptions,
	getDataByDateAndTimeWithExceptions,
};
