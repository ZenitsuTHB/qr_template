// useSortedReservations.js

import { useMemo } from 'react';

const useSortedReservations = (reservationsData, sortConfig) => {
  return useMemo(() => {
    const sortedData = [...reservationsData];
    if (sortConfig.key && sortConfig.direction) {
      sortedData.sort((a, b) => {
        if (sortConfig.key === 'aantalGasten') {
          return sortConfig.direction === 'asc'
            ? a.aantalGasten - b.aantalGasten
            : b.aantalGasten - a.aantalGasten;
        } else if (sortConfig.key === 'tijdstip') {
          const timeA = a.tijdstip.split(':').map(Number);
          const timeB = b.tijdstip.split(':').map(Number);
          const dateA = new Date();
          dateA.setHours(timeA[0], timeA[1], 0, 0);
          const dateB = new Date();
          dateB.setHours(timeB[0], timeB[1], 0, 0);
          return sortConfig.direction === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        return 0;
      });
    }
    return sortedData;
  }, [reservationsData, sortConfig]);
};

export default useSortedReservations;
