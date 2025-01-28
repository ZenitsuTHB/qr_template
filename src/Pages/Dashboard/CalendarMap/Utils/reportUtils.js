// src/utils/reportUtils.js

// Helper functions for statistical calculations
export const calculateMedian = (numbers) => {
	const sorted = [...numbers].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 !== 0
	  ? sorted[mid]
	  : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  
  export const calculateAverage = (numbers) =>
	numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
  
  export const calculateVariance = (numbers, mean) => {
	const squaredDiffs = numbers.map((val) => (val - mean) ** 2);
	return squaredDiffs.reduce((acc, val) => acc + val, 0) / numbers.length;
  };
  
  // Helper functions for date formatting
  export const getDutchDateString = (date) =>
	date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });
  
  export const getDutchDayName = (date) =>
	date.toLocaleDateString('nl-NL', { weekday: 'long' });
  
  // Function to group dates into weeks
  export const groupDatesIntoWeeks = (dates) => {
	const weeks = [];
	for (let i = 0; i < dates.length; i += 7) {
	  weeks.push(dates.slice(i, i + 7));
	}
	return weeks;
  };
  
  // Labels for statistics
  export const statLabels = {
	minGuests: 'Minimaal aantal gasten',
	maxGuests: 'Maximaal aantal gasten',
	medianGuests: 'Mediaan aantal gasten',
	averageGuests: 'Gemiddeld aantal gasten',
	varianceGuests: 'Variantie aantal gasten',
	lowestDay: 'Laagste dag',
	highestDay: 'Hoogste dag',
  };
  