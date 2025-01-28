// src/Components/Calendar/Hooks/useReservations.js

import { useState, useEffect } from 'react';
import useApi from '../../../../Hooks/useApi';

/**
 * Custom hook to fetch and manage reservations data.
 *
 * @returns {Array} An array of reservation objects.
 */
const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const api = useApi();

  useEffect(() => {
    /**
     * Fetches reservations from the backend API and processes them.
     */
    const fetchReservations = async () => {
      try {
        // Fetch raw data from the backend API
        console.log("Tableplan GET");
        const data = await api.get(`${window.baseDomain}api/auth-reservations`, { noCache: true });

        console.log('Raw data from backend:', data);

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error('Unexpected data format: Expected an array of reservations.');
          setReservations([]);
          return;
        }

        // Process and map each reservation to the frontend format
        const mappedReservations = data.map((reservation) => {
          // Extract the reservation ID
          const id = reservation._id?.$oid || reservation._id || `unknown-${Math.random()}`;

          // Parse the number of guests
          const guests = parseInt(reservation.guests?.$numberInt || reservation.guests, 10);
          const numberOfGuests = isNaN(guests) ? 1 : guests; // Default to 1 if parsing fails

          // Extract and trim extra information
          const notes = reservation.extraInfo?.trim() || '';

          // Return the mapped reservation object
          return {
            id,
            date: reservation.date, // Ensure this is in 'YYYY-MM-DD' format or adjust as needed
            time: reservation.time, // Ensure this is in 'HH:MM' format or adjust as needed
            firstName: reservation.firstName || 'Unknown',
            lastName: reservation.lastName || 'Guest',
            numberOfGuests,
            tableId: null, // Initialize as null; will be updated when assigned
            notes,
            email: reservation.email || '',
            phone: reservation.phone || '',
            reservationType: reservation.reservationType || 'common',
            // Add other fields if necessary
          };
        });

        setReservations(mappedReservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setReservations([]); // Fallback to an empty array on error
      }
    };

    fetchReservations();
  }, [api]);

  return reservations;
};

export default useReservations;
