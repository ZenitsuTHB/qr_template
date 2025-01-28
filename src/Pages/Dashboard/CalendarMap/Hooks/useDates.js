// useDates.js

import { useMemo } from 'react';
import { getMonday } from '../Utils/dateUtils';

const useDates = (currentDate, weekOrMonthView) => {
  return useMemo(() => {
    let dates = [];

    if (weekOrMonthView === 'month') {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const numDays = endDate.getDate();

      const prevMonthDays = (startDate.getDay() + 6) % 7;

      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          -i
        );
        dates.push({ date, currentMonth: false });
      }

      for (let i = 1; i <= numDays; i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i
        );
        dates.push({ date, currentMonth: true });
      }

      while (dates.length % 7 !== 0) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          dates.length - numDays - prevMonthDays + 1
        );
        dates.push({ date, currentMonth: false });
      }
    } else if (weekOrMonthView === 'week') {
      const currentWeekStart = getMonday(currentDate);
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const currentMonth = date.getMonth() === currentDate.getMonth();
        dates.push({ date, currentMonth });
      }
    }

    return dates;
  }, [currentDate, weekOrMonthView]);
};

export default useDates;
