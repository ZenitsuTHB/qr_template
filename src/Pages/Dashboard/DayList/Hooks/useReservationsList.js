// src/Components/ReservationsList/Hooks/useReservationsList.js

import { useState, useEffect } from 'react';
import useApi from '../../../../Hooks/useApi';

const useReservationsList = () => {
  const [reservationsData, setReservationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/auth-reservations', { noCache: true });

        console.log('Raw data from backend:', data);

        // Map backend data to the expected frontend format
        const mappedReservations = data.map((reservation) => {
          // Map backend data to frontend expected format
          const mappedReservation = {
            id: reservation._id, // Ensure this is a string
            aantalGasten: reservation.guests,
            tijdstip: reservation.time,
            date: reservation.date,
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            email: reservation.email,
            phone: reservation.phone,
            menu: reservation.menu,
            zitplaats: reservation.zitplaats,
            personeel: reservation.personeel,
            extra: reservation.extraInfo && reservation.extraInfo.trim() !== '' ? reservation.extraInfo : null,
            createdAt: reservation.createdAt,
          };
          return mappedReservation;
        });

        setReservationsData(mappedReservations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [api]);

  return { reservationsData, loading, error };
};

export default useReservationsList;
