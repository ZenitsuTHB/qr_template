// src/Pages/NewReservation/Utils/dateUtils.js

import moment from 'moment-timezone';

export const isWeekInPast = (weekStartDate) => {
  const today = moment().tz('Europe/Brussels').startOf('day');
  const weekEndDate = weekStartDate.clone().add(6, 'days').endOf('day');
  return weekEndDate.isBefore(today);
};

export const isSameDay = (date1, date2) => date1.isSame(date2, 'day');
