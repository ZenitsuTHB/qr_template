// Hooks/useChartData.js

import { useEffect, useState } from 'react';
import { getMonday } from '../Utils/dateUtils';
import { formatDateForFilter } from '../../../../Utils/dateUtils';

const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
const timeSlotColors = ['#182825', '#016FB9', '#22AED1'];

const useChartData = ({
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode,
  maxCapacity,
  gemiddeldeDuurCouvert,
  predictionsByDate,
  weekOrMonthView,
  weatherDataByDate,
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    let startDate, endDate;
    const labels = [];
    let datasets = [];

    if (weekOrMonthView === 'month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (weekOrMonthView === 'week') {
      startDate = getMonday(currentDate);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    }

    const dateArray = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dateArray.push(new Date(d));
    }

    if (selectedViewMode === 'Weer') {
      const data = []; // Corrected: use 'data' array to store temperature values

      dateArray.forEach((date) => {
        const dateString = formatDateForFilter(date);
        labels.push(
          weekOrMonthView === 'month'
            ? date.getDate()
            : date.toLocaleDateString('nl-NL', { weekday: 'short' })
        );

        const temp = weatherDataByDate[dateString];
        data.push(temp !== undefined ? temp : null);
      });

      datasets = [
        {
          label: 'Temperatuur (°C)',
          data: data,
          backgroundColor: '#FF8C00', // Orange color
        },
      ];

      setChartData({
        labels,
        datasets,
      });
    } else if (selectedViewMode === 'Algemeen' && selectedShift === 'Dag') {
      const dataByTimeSlot = [[], [], []];

      dateArray.forEach((date) => {
        const dateString = formatDateForFilter(date);
        labels.push(
          weekOrMonthView === 'month'
            ? date.getDate()
            : date.toLocaleDateString('nl-NL', { weekday: 'short' })
        );

        const reservations = reservationsByDate[dateString] || [];
        const totalGuestsByTimeSlot = [0, 0, 0];

        reservations.forEach((res) => {
          totalGuestsByTimeSlot[res.timeSlot] += res.aantalGasten;
        });

        for (let timeSlot = 0; timeSlot < 3; timeSlot++) {
          dataByTimeSlot[timeSlot].push(totalGuestsByTimeSlot[timeSlot]);
        }
      });

      datasets = timeSlotNames.map((name, index) => ({
        label: name,
        data: dataByTimeSlot[index],
        backgroundColor: timeSlotColors[index],
      }));

      setChartData({ labels, datasets });
    } else {
      const data = [];

      dateArray.forEach((date) => {
        const dateString = formatDateForFilter(date);
        labels.push(
          weekOrMonthView === 'month'
            ? date.getDate()
            : date.toLocaleDateString('nl-NL', { weekday: 'short' })
        );

        if (selectedViewMode === 'Bezettingspercentage') {
          // Occupancy Rate Calculation
          const maxCapacityNum = parseInt(maxCapacity, 10);
          const gemiddeldeDuurCouvertNum = parseInt(gemiddeldeDuurCouvert, 10);

          if (maxCapacityNum > 0 && gemiddeldeDuurCouvertNum > 0) {
            const totalIntervalsPerDay = (12 * 60) / 5; // 144 intervals
            const totalCapacityPerDay = maxCapacityNum * totalIntervalsPerDay;

            const reservations = reservationsByDate[dateString] || [];

            let totalOccupiedSlots = 0;

            reservations.forEach((reservation) => {
              if (
                selectedShift === 'Dag' ||
                (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
                (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
                (selectedShift === 'Avond' && reservation.timeSlot === 2)
              ) {
                const occupiedSlotsPerReservation =
                  reservation.aantalGasten * (gemiddeldeDuurCouvertNum / 5);
                totalOccupiedSlots += occupiedSlotsPerReservation;
              }
            });

            let occupancyRate = (totalOccupiedSlots / totalCapacityPerDay) * 100;

            // Ensure occupancy rate is between 0 and 100
            occupancyRate = Math.min(Math.max(occupancyRate, 0), 100);

            data.push(parseFloat(occupancyRate.toFixed(1)));
          } else {
            data.push(0);
          }
        } else {
          let totalGuests = 0;

          if (selectedViewMode === 'Voorspelling') {
            totalGuests = predictionsByDate[dateString] || 0;
          } else {
            const reservations = reservationsByDate[dateString] || [];
            reservations.forEach((res) => {
              if (
                selectedShift === 'Dag' ||
                (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
                (selectedShift === 'Middag' && res.timeSlot === 1) ||
                (selectedShift === 'Avond' && res.timeSlot === 2)
              ) {
                totalGuests += res.aantalGasten;
              }
            });
          }

          data.push(totalGuests);
        }
      });

      let backgroundColor = '';
      if (selectedViewMode === 'Bezettingspercentage') {
        backgroundColor = '#28a745';
      } else if (selectedViewMode === 'Bezettingsgraad') {
        backgroundColor =
          selectedShift === 'Ochtend'
            ? '#182825'
            : selectedShift === 'Middag'
            ? '#016FB9'
            : selectedShift === 'Avond'
            ? '#22AED1'
            : 'var(--color-blue)';
      } else if (selectedViewMode === 'Voorspelling') {
        backgroundColor = '#ff0000';
      } else {
        backgroundColor =
          selectedShift === 'Ochtend'
            ? '#182825'
            : selectedShift === 'Middag'
            ? '#016FB9'
            : selectedShift === 'Avond'
            ? '#22AED1'
            : 'var(--color-blue)';
      }

      datasets = [
        {
          label:
            selectedViewMode === 'Bezettingspercentage'
              ? 'Bezettingsgraad (%)'
              : selectedViewMode === 'Voorspelling'
              ? 'Voorspelling Aantal Gasten'
              : 'Aantal Gasten',
          data: data,
          backgroundColor: Array.isArray(backgroundColor)
            ? backgroundColor
            : new Array(data.length).fill(backgroundColor),
        },
      ];

      setChartData({ labels, datasets });
    }
  }, [
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode,
    maxCapacity,
    gemiddeldeDuurCouvert,
    predictionsByDate,
    weekOrMonthView,
    weatherDataByDate,
  ]);

  return chartData;
};

export default useChartData;
