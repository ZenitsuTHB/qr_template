// src/Pages/Mededeling/MededelingList.js

import React from 'react';
import './css/mededeling.css';
import MededelingItem from './MededelingItem';

const MededelingList = ({ mededelingen, api, triggerNotification, refreshMededelingen }) => {
  return (
    <div className="mededeling-component__list">
      <h3>Mededelingen</h3>
      {mededelingen.length > 0 ? (
        <div className="mededeling-component__mededeling-list">
          {mededelingen.map((mededeling) => (
            <MededelingItem
              key={mededeling._id}
              mededeling={mededeling}
              api={api}
              triggerNotification={triggerNotification}
              refreshMededelingen={refreshMededelingen}
            />
          ))}
        </div>
      ) : (
        <p>Geen mededelingen gevonden.</p>
      )}
    </div>
  );
};

export default MededelingList;
