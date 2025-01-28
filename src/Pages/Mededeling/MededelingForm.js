// src/Pages/Mededeling/MededelingForm.js

import React, { useState } from 'react';
import './css/mededeling.css';

const MededelingForm = ({ api, triggerNotification, refreshMededelingen }) => {
  const [formData, setFormData] = useState({
    mededeling: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.mededeling.trim()) validationErrors.mededeling = 'Mededeling is verplicht.';
    if (!formData.startDate) validationErrors.startDate = 'Startdatum is verplicht.';
    if (!formData.endDate) validationErrors.endDate = 'Einddatum is verplicht.';
    if (!formData.startTime) validationErrors.startTime = 'Starttijd is verplicht.';
    if (!formData.endTime) validationErrors.endTime = 'Eindtijd is verplicht.';
    if (formData.daysOfWeek.length === 0) validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      mededeling: formData.mededeling,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      daysOfWeek: formData.daysOfWeek,
    };

    try {
      const response = await api.post(`${window.baseDomain}api/mededeling`, payload);
      if (response) {
        setFormData({
          mededeling: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          daysOfWeek: [],
        });
        setErrors({});
        triggerNotification('Mededeling succesvol toegevoegd', 'success');
        refreshMededelingen();
      } else {
        triggerNotification('Fout bij het toevoegen van de mededeling', 'error');
      }
    } catch (error) {
      console.error('Error adding mededeling:', error);
      triggerNotification('Fout bij het toevoegen van de mededeling', 'error');
    }
  };

  return (
    <form className="mededeling-component__form" onSubmit={handleSubmit}>
      <div className="mededeling-component__form-group">
        <label>Mededeling</label>
        <input
          type="text"
          name="mededeling"
          value={formData.mededeling}
          onChange={handleChange}
          placeholder="Mededeling"
          className="mededeling-component__input"
        />
        {errors.mededeling && <p className="mededeling-component__error">{errors.mededeling}</p>}
      </div>

      <div className="mededeling-component__form-group">
        <label>Start Datum</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="mededeling-component__input"
        />
        {errors.startDate && <p className="mededeling-component__error">{errors.startDate}</p>}
      </div>

      <div className="mededeling-component__form-group">
        <label>Eind Datum</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="mededeling-component__input"
        />
        {errors.endDate && <p className="mededeling-component__error">{errors.endDate}</p>}
      </div>

      <div className="mededeling-component__form-group">
        <label>Start Tijd</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="mededeling-component__input"
        />
        {errors.startTime && <p className="mededeling-component__error">{errors.startTime}</p>}
      </div>

      <div className="mededeling-component__form-group">
        <label>Eind Tijd</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="mededeling-component__input"
        />
        {errors.endTime && <p className="mededeling-component__error">{errors.endTime}</p>}
      </div>

      <div className="mededeling-component__form-group">
        <label>Dagen van de week</label>
        <div className="mededeling-component__checkbox-group">
          {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(
            (day) => (
              <label key={day} className="mededeling-component__checkbox-label">
                <input
                  type="checkbox"
                  name="daysOfWeek"
                  value={day}
                  checked={formData.daysOfWeek.includes(day)}
                  onChange={handleChange}
                  className="mededeling-component__checkbox"
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            )
          )}
        </div>
        {errors.daysOfWeek && <p className="mededeling-component__error">{errors.daysOfWeek}</p>}
      </div>

      <button type="submit" className="button-style-3">
        Mededeling Toevoegen
      </button>
    </form>
  );
};

export default MededelingForm;
