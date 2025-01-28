// NameColumn.js

import React from 'react';
import { FaCircle } from 'react-icons/fa';
import './css/nameColumn.css';

const NameColumn = ({ isNewReservationHere, firstName, lastName }) => {
  return (
    <div className="name-column">
      {isNewReservationHere && (
        <FaCircle className="new-user-icon" title="Nieuwe reservering" />
      )}
      <a
        href="#"
        className={`name-link ${isNewReservationHere ? 'new-reservation' : ''}`}
      >
        {`${firstName} ${lastName}`}
      </a>
    </div>
  );
};

export default NameColumn;
