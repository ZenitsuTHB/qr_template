// src/Pages/Uitzonderingen/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/exceptions.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import ExceptionForm from './ExceptionForm';
import ExceptionList from './ExceptionList';
import ExceptionCalendar from './ExceptionCalendar';
import ExceptionTabs from './ExceptionTabs';
import ExceptionItem from './ExceptionItem.js';

const Uitzonderingen = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of exceptions
  const [exceptions, setExceptions] = useState([]);
  const [filteredExceptions, setFilteredExceptions] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // For navigating months

  // Fetch the exceptions at component mount
  useEffect(() => {
    const fetchExceptions = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/exceptions', { noCache: true });
        if (Array.isArray(data)) {
          setExceptions(data);
        } else {
          setExceptions([]);
        }
      } catch (error) {
        console.error('Error fetching exceptions:', error);
        setExceptions([]);
        triggerNotification('Fout bij het ophalen van uitzonderingen.', 'error');
      }
    };
    fetchExceptions();
  }, [api, triggerNotification]);

  // Filter exceptions based on the active tab
  useEffect(() => {
    const filterExceptionsByTab = () => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const nextMonth = (currentMonth + 1) % 12;

      let filtered = [];

      exceptions.forEach((exception) => {
        const startDate = new Date(exception.startDate);
        const endDate = new Date(exception.endDate);

        switch (activeTab) {
          case 'current':
            if (startDate.getMonth() === currentMonth || endDate.getMonth() === currentMonth) {
              filtered.push(exception);
            }
            break;
          case 'next':
            if (startDate.getMonth() === nextMonth || endDate.getMonth() === nextMonth) {
              filtered.push(exception);
            }
            break;
          case 'all':
          default:
            filtered.push(exception);
            break;
        }
      });

      setFilteredExceptions(filtered);
    };

    filterExceptionsByTab();
  }, [exceptions, activeTab]);

  // Handler to refresh exceptions
  const refreshExceptions = async () => {
    try {
      const data = await api.get(window.baseDomain + 'api/exceptions', { noCache: true });
      if (Array.isArray(data)) {
        setExceptions(data);
      } else {
        setExceptions([]);
      }
    } catch (error) {
      console.error('Error fetching exceptions:', error);
      setExceptions([]);
      triggerNotification('Fout bij het ophalen van uitzonderingen.', 'error');
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'current') {
      setCalendarMonthOffset(0);
    } else if (tab === 'next') {
      setCalendarMonthOffset(1);
    } else if (tab === 'all') {
      setCalendarMonthOffset(0); // Or handle 'all' differently
    }
  };

  // Handle month navigation in calendar
  const handleMonthChange = (offset) => {
    setCalendarMonthOffset((prevOffset) => prevOffset + offset);
  };

  // Optional: If you still want to handle date clicks without displaying exceptions
  const handleDateClick = (date) => {
    // Implement any other logic you need when a date is clicked
    console.log('Date clicked:', date);
  };

  return (
    <div className="exceptions-page">
		
      <NotificationComponent />
      <div className="exceptions-page__container">
        <ExceptionForm
          api={api}
          triggerNotification={triggerNotification}
          refreshExceptions={refreshExceptions}
        />
        <div className="exceptions-page__content">
          {activeTab !== 'all' && (
            <ExceptionCalendar
              exceptions={exceptions}
              onDateClick={handleDateClick}
              monthOffset={calendarMonthOffset}
              onMonthChange={handleMonthChange}
            />
          )}
          <ExceptionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <ExceptionList
            exceptions={filteredExceptions}
            api={api}
            triggerNotification={triggerNotification}
            refreshExceptions={refreshExceptions}
          />
        </div>
      </div>
    </div>
  );
};

export default withHeader(Uitzonderingen);
