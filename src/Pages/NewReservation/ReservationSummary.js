// src/components/ReservationForm/ReservationSummary.jsx

import React from 'react';
import './css/reservationSummary.css'; // Import the CSS file

const ReservationSummary = ({ formData, onNewReservation }) => {
  return (
    <div className="reservation-summary">
      <ul className="reservation-details">
        <li><strong>Reservatie Gegevens:</strong></li> 
        <li><strong>Aantal gasten:</strong> {formData.guests}</li> {/* Uses guests */}
        <li><strong>Datum:</strong> {formData.date}</li>
        <li><strong>Tijd:</strong> {formData.time}</li>
        <li><strong>Voornaam:</strong> {formData.firstName}</li>
        <li><strong>Achternaam:</strong> {formData.lastName}</li>
        <li><strong>Email:</strong> {formData.email}</li>
        <li><strong>Telefoonnummer:</strong> {formData.phone}</li>
        {formData.menu && (
          <li><strong>Menu:</strong> {formData.menu}</li>
        )}
        {formData.personeel && (
          <li><strong>Aangemaakt door:</strong> {formData.personeel}</li>
        )}
        {formData.extraInfo && (
          <li><strong>Extra informatie:</strong> {formData.extraInfo}</li>
        )}
      </ul>
      <button className="button-style-3" onClick={onNewReservation}>
        Nieuwe Reservatie Maken
      </button>
    </div>
  );
};

export default ReservationSummary;
