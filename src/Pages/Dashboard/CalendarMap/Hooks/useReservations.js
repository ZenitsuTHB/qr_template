// src/Components/Calendar/Hooks/useReservations.js

import { useState, useEffect } from 'react';
import useApi from '../../../../Hooks/useApi';

const useReservations = () => {
  const [reservationsByDate, setReservationsByDate] = useState({});
  const api = useApi();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/auth-reservations', { noCache: true });

        console.log('Raw data from backend:', data);

        // Process data to map fields and group reservations by date
        const groupedByDate = {};

        data.forEach((reservation) => {
          // Map backend data to frontend expected format
          const mappedReservation = {
            id: reservation._id, // Ensure this is a string
            date: reservation.date,
            time: reservation.time,
            fullName: `${reservation.firstName} ${reservation.lastName}`,
            email: reservation.email,
            phone: reservation.phone,
            aantalGasten: reservation.guests,
            menu: reservation.menu,
            extra: reservation.extraInfo && reservation.extraInfo.trim() !== '' ? reservation.extraInfo : null,
            timeSlot: getTimeSlot(reservation.time),
          };

          const date = mappedReservation.date;
          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }
          groupedByDate[date].push(mappedReservation);
        });

        setReservationsByDate(groupedByDate);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [api]);

  // Helper function to determine timeSlot based on time
  const getTimeSlot = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours >= 6 && hours < 12) {
      return 0; // Morning
    } else if (hours >= 12 && hours < 17) {
      return 1; // Afternoon
    } else {
      return 2; // Evening
    }
  };

  return reservationsByDate;
};

export default useReservations;
