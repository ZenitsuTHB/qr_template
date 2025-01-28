// src/Pages/Personeel/PersoneelList.js
import React from 'react';
import './css/personeel.css';
import PersoneelItem from './PersoneelItem';

const PersoneelList = ({ personeels, api, triggerNotification, refreshPersoneel }) => {
  return (
    <div className="personeel-component__list">
      <h3>Personeel</h3>
      {personeels.length > 0 ? (
        <div className="personeel-component__personeel-list">
          {personeels.map((personeel) => (
            <PersoneelItem
              key={personeel._id}
              personeel={personeel}
              api={api}
              triggerNotification={triggerNotification}
              refreshPersoneel={refreshPersoneel}
            />
          ))}
        </div>
      ) : (
        <p>Geen personeel gevonden.</p>
      )}
    </div>
  );
};

export default PersoneelList;
