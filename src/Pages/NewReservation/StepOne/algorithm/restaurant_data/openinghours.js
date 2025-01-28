// index.js

const daysOfWeekEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysOfWeekDutch = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

const shifts = {
  breakfast: { start: '07:00', end: '11:00' },
  lunch: { start: '11:00', end: '16:00' },
  dinner: { start: '16:00', end: '23:00' },
};

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function getMealTypeByTime(timeStr) {
  const time = parseTime(timeStr);
  for (const [mealType, shift] of Object.entries(shifts)) {
    const start = parseTime(shift.start);
    const end = parseTime(shift.end);
    if (time >= start && time < end) {
      return mealType;
    }
  }
  return null;
}

function getDataByDayAndMeal(data, dayOfWeek, mealType) {
  const mealKey = `openinghours-${mealType}`;
  if (!data[mealKey]) {
    return null;
  }
  const mealData = data[mealKey];
  const dayData = mealData.schemeSettings[dayOfWeek];
  if (!dayData) {
    return null;
  }
  return { ...dayData };
}

function adjustMealData(mealData, generalSettings) {
  if (mealData.maxCapacityEnabled === false) {
    if (generalSettings && generalSettings.zitplaatsen) {
      mealData.maxCapacity = generalSettings.zitplaatsen;
      mealData.maxCapacityEnabled = true;
    } else {
      mealData.maxCapacity = '0';
      mealData.maxCapacityEnabled = true;
    }
  }
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

function getDataByDateAndMeal(data, dateStr, mealType) {
  const date = new Date(dateStr);
  if (isNaN(date)) {
    return null;
  }
  const dayOfWeekIndex = date.getDay();
  const dayOfWeek = daysOfWeekEnglish[dayOfWeekIndex];
  let mealData = getDataByDayAndMeal(data, dayOfWeek, mealType);
  if (!mealData || mealData.enabled !== true) {
    return null;
  }

  adjustMealData(mealData, data['general-settings']);

  // Add duurReservatie to endTime
  addDuurReservatieToEndTime(mealData, data);

  return mealData;
}

function getDataByDateAndTime(data, dateStr, timeStr) {
  const mealType = getMealTypeByTime(timeStr);
  if (!mealType) {
    return null;
  }
  const mealData = getDataByDateAndMeal(data, dateStr, mealType);
  if (!mealData) {
    return null;
  }
  const requestedTime = parseTime(timeStr);
  const startTime = parseTime(mealData.startTime);
  const endTime = parseTime(mealData.endTime);
  if (requestedTime >= startTime && requestedTime < endTime) {
    return mealData;
  } else {
    return null;
  }
}

module.exports = {
  getDataByDayAndMeal,
  getDataByDateAndMeal,
  getDataByDateAndTime,
  daysOfWeekEnglish,
  daysOfWeekDutch,
  getMealTypeByTime,
  parseTime,
  shifts,
};
