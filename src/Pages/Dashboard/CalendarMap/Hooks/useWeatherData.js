import { useState, useEffect } from 'react';
import useApi from '../../../../Hooks/useApi';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

// Global cache for session-based storage
const weatherDataCache = {}; // dateString => temperature

const useWeatherData = (startDate, endDate, fetchWeather) => {
  const [weatherDataByDate, setWeatherDataByDate] = useState({});
  const api = useApi();

  // Convert dates to strings outside useEffect to use in dependencies
  const startDateString = formatDateForFilter(startDate);
  const endDateString = formatDateForFilter(endDate);

  useEffect(() => {
    if (!fetchWeather) {
      setWeatherDataByDate({});
      return;
    }

    const fetchWeatherData = async () => {
      const location = 'Belgium'; // Or make this a parameter

      // Generate all dateStrings in the range
      const dateStrings = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dateStrings.push(d.toISOString().split('T')[0]);
      }

      // Determine which dates are missing from the cache
      const missingDates = dateStrings.filter(
        (dateStr) => !weatherDataCache[dateStr]
      );

      if (missingDates.length === 0) {
        // All data is cached
        const data = {};
        dateStrings.forEach((dateStr) => {
          data[dateStr] = weatherDataCache[dateStr];
        });
        setWeatherDataByDate(data);
        return;
      }

      try {
        // Fetch data from server
        const response = await api.get(
          window.baseDomain + `api/weather/${encodeURIComponent(location)}/${startDateString}/${endDateString}`
        );

        // Assuming the server returns data in the same format
        const data = response.days.reduce((acc, day) => {
          const dateStr = day.datetime;
          weatherDataCache[dateStr] = day.temp;
          acc[dateStr] = day.temp;
          return acc;
        }, {});

        setWeatherDataByDate(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [startDateString, endDateString, fetchWeather]);

  return weatherDataByDate;
};

export default useWeatherData;
