// sortUtils.js

export const getNewSortConfig = (currentConfig, key) => {
	let direction = 'asc';
  
	if (currentConfig.key === key && currentConfig.direction === 'asc') {
	  direction = 'desc';
	} else if (currentConfig.key === key && currentConfig.direction === 'desc') {
	  // Reset sort
	  return { key: null, direction: null };
	}
  
	return { key, direction };
  };
  