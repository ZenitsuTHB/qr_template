// src/hooks/useExceptionForm.js

import { useState, useEffect, useRef } from 'react';
import { getTodayDateString, isStartDateAfterEndDate } from '../Utils/utils.js';

const useExceptionForm = (initialFormData, api, triggerNotification, refreshExceptions) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // Focus shift when start date is selected
  useEffect(() => {
    if (formData.startDate && !formData.endDate && endDateRef.current) {
      endDateRef.current.focus();
      // Animation to guide user
      endDateRef.current.classList.add('highlight-animation');
      setTimeout(() => {
        endDateRef.current.classList.remove('highlight-animation');
      }, 2000);
    }
  }, [formData.startDate]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (inputType === 'checkbox' && name === 'daysOfWeek') {
      const day = value;
      setFormData((prevFormData) => {
        let daysOfWeek = [...prevFormData.daysOfWeek];
        if (checked) {
          daysOfWeek.push(day);
        } else {
          daysOfWeek = daysOfWeek.filter((d) => d !== day);
        }
        return { ...prevFormData, daysOfWeek };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (formData.type !== 'Sluitingsdag' && formData.type !== 'Sluitingsdagen' && !formData.timeframe)
      validationErrors.timeframe = 'Toepassing is verplicht.';

    if (formData.type === 'Sluitingsdag' && !formData.date)
      validationErrors.date = 'Datum is verplicht.';
    if (formData.type === 'Sluitingsdagen' && !formData.startDate)
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (formData.type === 'Sluitingsdagen' && !formData.endDate)
      validationErrors.endDate = 'Einddatum is verplicht.';

    if (
      (formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') &&
      !formData.startDate
    )
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (
      (formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') &&
      !formData.endDate
    )
      validationErrors.endDate = 'Einddatum is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.startHour
    )
      validationErrors.startHour = 'Startuur is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.endHour
    )
      validationErrors.endHour = 'Einduur is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.maxSeats
    )
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';

    if (
      formData.startDate &&
      formData.endDate &&
      isStartDateAfterEndDate(formData.startDate, formData.endDate)
    ) {
      validationErrors.startDate = 'Startdatum mag niet na de einddatum liggen.';
      validationErrors.endDate = 'Einddatum mag niet voor de startdatum liggen.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    let payload = {
      title: formData.title,
      type: ['Sluitingsdag', 'Sluitingsdagen'].includes(formData.type)
        ? 'Sluiting'
        : formData.type,
      timeframe:
        formData.type === 'Sluitingsdag' || formData.type === 'Sluitingsdagen'
          ? 'Volledige Dag'
          : formData.timeframe,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      maxSeats: formData.maxSeats,
      daysOfWeek: formData.daysOfWeek,
    };

    // Handle Sluitingsdag (single date)
    if (formData.type === 'Sluitingsdag') {
      payload.startDate = formData.date;
      payload.endDate = formData.date;
      payload.daysOfWeek = []; // Clear daysOfWeek for Sluitingsdag
    }

    // Remove daysOfWeek for Sluitingsdag
    if (formData.type === 'Sluitingsdag') {
      delete payload.daysOfWeek;
    }

    payload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value != null && value !== '')
    );

    try {
      const response = await api.post(`${window.baseDomain}api/exceptions`, payload);
      if (response) {
        setFormData(initialFormData);
        setErrors({});
        triggerNotification('Uitzondering succesvol toegevoegd', 'success');
        refreshExceptions();
      } else {
        triggerNotification('Fout bij het toevoegen van de uitzondering', 'error');
      }
    } catch (error) {
      console.error('Error adding exception:', error);
      triggerNotification('Fout bij het toevoegen van de uitzondering', 'error');
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    startDateRef,
    endDateRef,
  };
};

export default useExceptionForm;
