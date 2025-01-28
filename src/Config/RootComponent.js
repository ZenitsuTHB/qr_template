// src/components/RootComponent.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import CalendarComponent from '../Pages/Dashboard/CalendarMap/index.js';
import SettingsTabs from '../Pages/FormEditor/FormSettings/SettingsTabs.js';

const RootComponent = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  if (query.has('preview')) {
    return <SettingsTabs title="" />;
  } else {
    return <CalendarComponent title="Dashboard" />;
  }
};

export default RootComponent;
