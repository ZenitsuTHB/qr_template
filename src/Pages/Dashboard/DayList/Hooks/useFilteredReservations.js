// useFilteredReservations.js

import { useMemo } from 'react';
import { formatDateForFilter, timeToMinutes } from '../../../../Utils/dateUtils.js';
import { shifts } from '../Utils/constants.js';

const useFilteredReservations = (reservationsData, filters) => {
  const {
    searchQuery,
    nameSearch,
    guestsSearch,
    timeSearch,
    selectedDate,
    selectedShift,
  } = filters;

  const filteredReservationsData = useMemo(() => {
    return reservationsData.filter((reservation) => {
      const generalMatch = !searchQuery || (() => {
        const query = searchQuery.toLowerCase();

        const fullName = `${reservation.firstName || ''} ${reservation.lastName || ''}`.toLowerCase();
        const guests = reservation.aantalGasten ? reservation.aantalGasten.toString() : '';
        const time = (reservation.tijdstip || '').toLowerCase();
        const email = (reservation.email || '').toLowerCase();
        const phone = (reservation.telefoon || '').toLowerCase();

        return (
          fullName.includes(query) ||
          guests.includes(query) ||
          time.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      })();

      const matchesName = !nameSearch || (() => {
        const fullName = `${reservation.firstName || ''} ${reservation.lastName || ''}`.toLowerCase();
        return fullName.includes(nameSearch.toLowerCase());
      })();

      const matchesGuests = !guestsSearch || (() => {
        return reservation.aantalGasten
          ? reservation.aantalGasten.toString().includes(guestsSearch)
          : false;
      })();

      const matchesTime = !timeSearch || (() => {
        return reservation.tijdstip
          ? reservation.tijdstip.toLowerCase().includes(timeSearch.toLowerCase())
          : false;
      })();

      const matchesDate = !selectedDate || (() => {
        const formattedSelectedDate = formatDateForFilter(selectedDate);
        return reservation.date === formattedSelectedDate;
      })();

      const matchesShift = !selectedShift || (() => {
        const shift = shifts[selectedShift];
        if (!shift || !reservation.tijdstip) return false;
        const reservationMinutes = timeToMinutes(reservation.tijdstip);
        const shiftStart = timeToMinutes(shift.start);
        const shiftEnd = timeToMinutes(shift.end);
        return reservationMinutes >= shiftStart && reservationMinutes <= shiftEnd;
      })();

      return generalMatch && matchesName && matchesGuests && matchesTime && matchesDate && matchesShift;
    });
  }, [reservationsData, searchQuery, nameSearch, guestsSearch, timeSearch, selectedDate, selectedShift]);

  return filteredReservationsData;
};

export default useFilteredReservations;
 