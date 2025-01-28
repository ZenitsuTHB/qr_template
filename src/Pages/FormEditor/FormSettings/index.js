// src/components/FormSettings/SettingsTabsWithHeader.jsx

import React from 'react';
import SettingsTabs from './SettingsTabs.js'; // Adjust the path based on your project structure
import { withHeader } from '../../../Components/Structural/Header/index.js'; // Ensure the path is correct

const SettingsTabsWithHeader = () => {
  return <SettingsTabs />;
};

export default withHeader(SettingsTabsWithHeader);
