// src/pages/SchedulePage/index.js

import React, { useState, useEffect } from 'react';
import './css/schedulePage.css';
import NavigationBar from './NavigationBar';
import DayContent from './DayContent';
import { withHeader } from '../../Components/Structural/Header';
import useWindowWidth from './Hooks/useWindowWidth';
import useApi from '../../Hooks/useApi';

const SchedulePage = ({ mealType }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [scheduleData, setScheduleData] = useState({});
  const windowWidth = useWindowWidth();
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${window.baseDomain}api/openinghours-${mealType}`
        );
        if (response) {
          setScheduleData(response.schemeSettings || {});
        } else {
          setScheduleData({});
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setScheduleData({});
      }
    };
    fetchData();
  }, [api, mealType]);

  const isMobile = windowWidth < 900;

  const days = [
    {
      id: 'Monday',
      title: 'Maandag',
      label: isMobile ? 'Ma' : 'Maandag',
      icon: 'FaSun',
    },
    {
      id: 'Tuesday',
      title: 'Dinsdag',
      label: isMobile ? 'Di' : 'Dinsdag',
      icon: 'FaCloud',
    },
    {
      id: 'Wednesday',
      title: 'Woensdag',
      label: isMobile ? 'Wo' : 'Woensdag',
      icon: 'FaUmbrella',
    },
    {
      id: 'Thursday',
      title: 'Donderdag',
      label: isMobile ? 'Do' : 'Donderdag',
      icon: 'FaBolt',
    },
    {
      id: 'Friday',
      title: 'Vrijdag',
      label: isMobile ? 'Vr' : 'Vrijdag',
      icon: 'FaRainbow',
    },
    {
      id: 'Saturday',
      title: 'Zaterdag',
      label: isMobile ? 'Za' : 'Zaterdag',
      icon: 'FaSnowflake',
    },
    {
      id: 'Sunday',
      title: 'Zondag',
      label: isMobile ? 'Zo' : 'Zondag',
      icon: 'FaMoon',
    },
  ];

  const handleDayClick = (dayId) => {
    setSelectedDay(dayId);
  };

  return (
    <div className="schedule-page-component">
		
      <div className="schedule-page">
        <NavigationBar
          days={days}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          scheduleData={scheduleData}
        />
        {selectedDay && (
          <DayContent
            dayId={selectedDay}
            days={days}
            mealType={mealType}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData} // Pass the setter to DayContent
          />
        )}
      </div>
    </div>
  );
};

export default withHeader(SchedulePage);
