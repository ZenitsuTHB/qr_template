// src/pages/SchedulePage/NavigationBar.js

import React from 'react';
import './css/navigationBar.css';
import {
  FaSun,
  FaCloud,
  FaUmbrella,
  FaBolt,
  FaRainbow,
  FaSnowflake,
  FaMoon,
} from 'react-icons/fa';
import { motion, LayoutGroup } from 'framer-motion';

const NavigationBar = ({ days, selectedDay, onDayClick, scheduleData }) => {
  const icons = {
    FaSun: <FaSun />,
    FaCloud: <FaCloud />,
    FaUmbrella: <FaUmbrella />,
    FaBolt: <FaBolt />,
    FaRainbow: <FaRainbow />,
    FaSnowflake: <FaSnowflake />,
    FaMoon: <FaMoon />,
  };

  return (
    <div className="schedule-page navigation-bar">
      <div className="navigation-container">
        <LayoutGroup>
          {days.map((day, index) => {
            const isSelected = selectedDay === day.id;
            const dataForDay = scheduleData ? scheduleData[day.id] : null;
            const hasStartEndTime =
              dataForDay && dataForDay.startTime && dataForDay.endTime;
            const opacityStyle = !hasStartEndTime ? { opacity: 0.4 } : {};

            return (
              <motion.div
                key={day.id}
                className={`navigation-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onDayClick(day.id)}
                whileHover={{ scale: 1.05 }}
                animate={{ scale: isSelected ? 1.1 : 1 }}
                layout
                style={opacityStyle}
              >
                {isSelected && (
                  <motion.div
                    className="selected-day-background"
                    layoutId="selected-day-background"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="icon">{icons[day.icon]}</div>
                <div className="label">{day.label}</div>
                {!isSelected && index < days.length - 1 && (
                  <div className="border-right"></div>
                )}
              </motion.div>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
};

export default NavigationBar;
