// src/Utils/localStorageUtils.js

export const loadFromLocalStorage = (key, defaultValue) => {
	try {
	  const serializedState = localStorage.getItem(key);
	  if (serializedState === null) {
		return defaultValue;
	  }
	  return JSON.parse(serializedState);
	} catch (error) {
	  console.error(`Error loading ${key} from localStorage`, error);
	  return defaultValue;
	}
  };
  
  export const saveToLocalStorage = (key, value) => {
	try {
	  const serializedState = JSON.stringify(value);
	  localStorage.setItem(key, serializedState);
	} catch (error) {
	  console.error(`Error saving ${key} to localStorage`, error);
	}
  };
  