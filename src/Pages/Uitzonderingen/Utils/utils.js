// src/utils/utils.js


// Function to get today's date in YYYY-MM-DD format
export const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
  };
  
  export const isStartDateAfterEndDate = (startDateStr, endDateStr) => {
	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);
	return startDate > endDate;
  };
  
  // Generate time options based on 'Toepassing'
  export const getTimeOptions = (shift, shifts) => {
	const options = [];
	const startTime = shifts[shift].start;
	const endTime = shifts[shift].end;
  
	const [startHour, startMinute] = startTime.split(':').map(Number);
	const [endHour, endMinute] = endTime.split(':').map(Number);
  
	let currentTime = new Date();
	currentTime.setHours(startHour, startMinute, 0, 0);
  
	const endTimeObj = new Date();
	endTimeObj.setHours(endHour, endMinute, 0, 0);
  
	while (currentTime <= endTimeObj) {
	  const timeStr = currentTime.toTimeString().substring(0, 5);
	  options.push(timeStr);
	  currentTime.setMinutes(currentTime.getMinutes() + 15);
	}
  
	return options;
  };
  