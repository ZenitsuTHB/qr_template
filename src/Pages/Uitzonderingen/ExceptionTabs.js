// src/Pages/Uitzonderingen/ExceptionTabs.js

import React from 'react';
import './css/exceptions.css';

const ExceptionTabs = ({ activeTab, onTabChange }) => {
  const months = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
  ];

  const today = new Date();
  const currentMonth = months[today.getMonth()];
  const nextMonth = months[(today.getMonth() + 1) % 12];

  return (
    <div className="exceptions-page__tabs-container">
      <div className="exceptions-page__tabs">
        <div
          className={`exceptions-page__tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => onTabChange('current')}
        >
          {currentMonth}
        </div>
        <div
          className={`exceptions-page__tab ${activeTab === 'next' ? 'active' : ''}`}
          onClick={() => onTabChange('next')}
        >
          {nextMonth}
        </div>
        <div
          className={`exceptions-page__tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onTabChange('all')}
        >
          Alle
        </div>
      </div>
    </div>
  );
};

export default ExceptionTabs;
