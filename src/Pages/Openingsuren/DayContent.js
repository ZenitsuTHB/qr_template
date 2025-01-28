// src/Pages/Uitzonderingen/DayContent.js

import React, { useState, useEffect, useRef } from 'react';
import './css/dayContent.css';
import MaxCapacityAccordion from './MaxCapacityAccordion';
import ShiftsAccordion from './ShiftsAccordion';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { shifts } from './constants';

const DayContent = ({ dayId, days, mealType, scheduleData, setScheduleData }) => {
  const api = useApi();
  const day = days.find((d) => d.id === dayId);

  const { triggerNotification, NotificationComponent } = useNotification();

  const [dayData, setDayData] = useState({
    startTime: '',
    endTime: '',
    maxCapacityEnabled: false,
    maxCapacity: '',
    shiftsEnabled: false,
    shifts: [],
  });

  const [errors, setErrors] = useState({});

  const endTimeRef = useRef(null);

  useEffect(() => {
    if (scheduleData && scheduleData[dayId]) {
      const dataForDay = scheduleData[dayId];
      setDayData({
        startTime: dataForDay.startTime || '',
        endTime: dataForDay.endTime || '',
        maxCapacityEnabled: dataForDay.maxCapacityEnabled || false,
        maxCapacity: dataForDay.maxCapacity || '',
        shiftsEnabled: dataForDay.shiftsEnabled || false,
        shifts: dataForDay.shifts || [],
      });
    } else {
      setDayData({
        startTime: '',
        endTime: '',
        maxCapacityEnabled: false,
        maxCapacity: '',
        shiftsEnabled: false,
        shifts: [],
      });
    }
    setErrors({});
  }, [scheduleData, dayId]);

  // Generate time options based on mealType
  const generateTimeOptions = (type) => {
    if (!type || !shifts[type]) return [];

    const start = shifts[type].start;
    const end = shifts[type].end;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const options = [];
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      options.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

  // Get start time options
  const startTimeOptions = generateTimeOptions(mealType);

  // Get end time options based on selected start time
  const getEndTimeOptions = () => {
    if (!dayData.startTime) return generateTimeOptions(mealType);

    const [startHour, startMinute] = dayData.startTime.split(':').map(Number);
    const [mealEndHour, mealEndMinute] = shifts[mealType].end.split(':').map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(mealEndHour, mealEndMinute, 0, 0);

    const options = [];
    let current = new Date(start);
    current.setMinutes(current.getMinutes() + 15);

    while (current <= end) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      options.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

  const endTimeOptions = getEndTimeOptions();

  // Handle Save with Validations
  const handleSave = async () => {
    const validationErrors = {};

    // Check if end time is after start time
    if (dayData.startTime && dayData.endTime) {
      const start = dayData.startTime.split(':').map(Number);
      const end = dayData.endTime.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(start[0], start[1], 0, 0);

      const endDate = new Date();
      endDate.setHours(end[0], end[1], 0, 0);

      if (endDate <= startDate) {
        validationErrors.endTime = 'Eindtijd moet na de starttijd zijn.';
      }
    }

    // Additional validations can be added here as needed

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerNotification(
        Object.values(validationErrors).join(' '),
        'error'
      );
      return;
    }

    // Merge existing scheduleData with the updated data for the current day
    const updatedSchemeSettings = {
      ...scheduleData,
      [day.id]: {
        enabled: true,
        startTime: dayData.startTime,
        endTime: dayData.endTime,
        maxCapacityEnabled: dayData.maxCapacityEnabled,
        maxCapacity: dayData.maxCapacity,
        shiftsEnabled: dayData.shiftsEnabled,
        shifts: dayData.shifts,
      },
    };

    const updatedData = {
      schemeSettings: updatedSchemeSettings,
    };

    try {
      await api.put(`${window.baseDomain}api/openinghours-${mealType}`, updatedData);
      triggerNotification('Data succesvol opgeslagen', 'success');
      // Update local scheduleData without reloading from backend
      setScheduleData(updatedSchemeSettings);
    } catch (error) {
      console.error('Error saving data:', error);
      triggerNotification('Fout bij het opslaan van data', 'error');
    }
  };

  let mealTypeLabel = '';
  if (mealType === 'breakfast') {
    mealTypeLabel = 'ochtend';
  } else if (mealType === 'lunch') {
    mealTypeLabel = 'middag';
  } else if (mealType === 'dinner') {
    mealTypeLabel = 'avond';
  }

  return (
    <div className="schedule-page">
      <h1 className="schedule-page-title">{day.title}{mealTypeLabel}</h1>

      <NotificationComponent />

      <div className="day-content scheme-container">
        <div className="time-inputs-container">
          <div className="input-container">
            <label htmlFor="startTime">Start Tijd</label>
            <select
              id="startTime"
              name="startTime"
              value={dayData.startTime}
              onChange={(e) => {
                setDayData({ ...dayData, startTime: e.target.value, endTime: '' });
                setErrors({ ...errors, startTime: '', endTime: '' });
              }}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Start Tijd</option>
              {startTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.startTime && (
              <p className="exceptions-page__error">{errors.startTime}</p>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="endTime">Eind Tijd</label>
            <select
              id="endTime"
              name="endTime"
              value={dayData.endTime}
              onChange={(e) => setDayData({ ...dayData, endTime: e.target.value })}
              className="exceptions-page__select"
              disabled={!dayData.startTime}
              ref={endTimeRef}
            >
              <option value="">Selecteer Eind Tijd</option>
              {endTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.endTime && (
              <p className="exceptions-page__error">{errors.endTime}</p>
            )}
          </div>
        </div>

        <MaxCapacityAccordion
          enabled={dayData.maxCapacityEnabled}
          setEnabled={(enabled) =>
            setDayData({ ...dayData, maxCapacityEnabled: enabled, maxCapacity: '' })
          }
          maxCapacity={dayData.maxCapacity}
          setMaxCapacity={(maxCapacity) =>
            setDayData({ ...dayData, maxCapacity })
          }
        />

        <ShiftsAccordion
          enabled={dayData.shiftsEnabled}
          setEnabled={(enabled) => setDayData({ ...dayData, shiftsEnabled: enabled })}
          shifts={dayData.shifts}
          setShifts={(shifts) => setDayData({ ...dayData, shifts })}
          startTime={dayData.startTime}
          endTime={dayData.endTime}
        />

        <button className="button-style-3" onClick={handleSave}>
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default DayContent;
