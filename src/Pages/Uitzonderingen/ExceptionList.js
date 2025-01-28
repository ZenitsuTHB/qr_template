// src/Pages/Uitzonderingen/ExceptionList.js

import React from 'react';
import './css/exceptions.css';
import ExceptionItem from './ExceptionItem';

const ExceptionList = ({ exceptions, api, triggerNotification, refreshExceptions }) => {
  return (
    <div className="exceptions-page__list">
      <h3>Uitzonderingen</h3>
      {exceptions.length > 0 ? (
        <div className="exceptions-page__exception-list">
          {exceptions.map((exception) => (
            <ExceptionItem
              key={exception._id}
              exception={exception}
              api={api}
              triggerNotification={triggerNotification}
              refreshExceptions={refreshExceptions}
            />
          ))}
        </div>
      ) : (
        <p>Geen uitzonderingen gevonden.</p>
      )}
    </div>
  );
};

export default ExceptionList;
