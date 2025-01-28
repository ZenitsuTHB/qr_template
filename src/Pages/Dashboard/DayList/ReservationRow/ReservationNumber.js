// ReservationNumber.js

import React from 'react';
import { FaBolt } from 'react-icons/fa';
import './css/reservationNumber.css';

const ReservationNumber = ({ aantalGasten }) => {
  return (
    <div className="reservation-number">
      
      {aantalGasten >= 5 && aantalGasten < 7 && (
        <FaBolt className="users-icon-gray" />
      )}
      {aantalGasten >= 7 && <FaBolt className="users-icon" />}
      <span>{aantalGasten}</span>
    </div>
  );
};

export default ReservationNumber;
