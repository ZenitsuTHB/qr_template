// /src/Components/Calendar/Utils/dateUtils.js

export const getStartAndEndOfMonth = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

export const generateDatesArray = (start, end) => {
  const dates = [];
  for (let i = 1; i <= end.getDate(); i++) {
    dates.push(new Date(start.getFullYear(), start.getMonth(), i));
  }
  return dates;
};

export const getMonday = (date) => {
	const d = new Date(date);
	const day = d.getDay(); // 0 (Sun) to 6 (Sat)
	const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0); // Reset time to midnight
	return d;
  };