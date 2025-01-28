// utils/dateUtils.js


export const formatDateForFilter = (date) => {
	if (!date) return '';
	const year = date.getFullYear();
	const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-based
	const day = (`0${date.getDate()}`).slice(-2);
	return `${year}-${month}-${day}`;
  };
  

  export const formatDateDutch = (date) => {
	if (!date) return '';
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	return date.toLocaleDateString('nl-NL', options);
  };
  
  export const isToday = (date) => {
	const today = new Date();
	return (
	  date.getDate() === today.getDate() &&
	  date.getMonth() === today.getMonth() &&
	  date.getFullYear() === today.getFullYear()
	);
  };
  
  export const timeToMinutes = (timeStr) => {
	if (!timeStr) return 0;
	const [hours, minutes] = timeStr.split(':').map(Number);
	return hours * 60 + minutes;
  };
  