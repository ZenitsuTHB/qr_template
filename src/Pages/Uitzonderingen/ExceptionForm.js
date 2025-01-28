// src/Pages/Uitzonderingen/ExceptionForm.js

import React from 'react';
import './css/exceptions.css';
import { shifts } from './constants';
import useExceptionForm from './Hooks/useExceptionForm';
import { getTodayDateString, getTimeOptions } from './Utils/utils';

const ExceptionForm = ({ api, triggerNotification, refreshExceptions }) => {
  const initialFormData = {
    title: '',
    type: '',
    timeframe: '',
    date: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    maxSeats: '',
    daysOfWeek: [],
  };

  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    startDateRef,
    endDateRef,
  } = useExceptionForm(initialFormData, api, triggerNotification, refreshExceptions);

  return (
    <form className="exceptions-page__form" onSubmit={handleSubmit}>
      <div className="exceptions-page__form-group">
        <label>Titel</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titel"
          className="exceptions-page__input"
        />
        {errors.title && <p className="exceptions-page__error">{errors.title}</p>}
      </div>

      <div className="exceptions-page__form-group">
        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="exceptions-page__select"
        >
          <option value="">Selecteer Type</option>
          <option value="Opening">Opening</option>
          <option value="Sluiting">Sluiting</option>
          <option value="Sluitingsdag">Sluitingsdag</option>
          <option value="Sluitingsdagen">Sluitingsdagen</option>
          <option value="Uitzondering">Uitzondering</option>
        </select>
        {errors.type && <p className="exceptions-page__error">{errors.type}</p>}
      </div>

      {formData.type && formData.type !== 'Sluitingsdag' && formData.type !== 'Sluitingsdagen' && (
        <div className="exceptions-page__form-group">
          <label>Toepassing</label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="exceptions-page__select"
          >
            <option value="">Selecteer Toepassing</option>
            <option value="breakfast">Ochtend</option>
            <option value="lunch">Middag</option>
            <option value="dinner">Avond</option>
          </select>
          {errors.timeframe && <p className="exceptions-page__error">{errors.timeframe}</p>}
        </div>
      )}

      {formData.type === 'Sluitingsdag' && (
        <div className="exceptions-page__form-group">
          <label>Datum</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="exceptions-page__input"
            min={getTodayDateString()}
          />
          {errors.date && <p className="exceptions-page__error">{errors.date}</p>}
        </div>
      )}

      {formData.type === 'Sluitingsdagen' && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Datum</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={startDateRef}
              min={getTodayDateString()}
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={endDateRef}
              min={getTodayDateString()}
            />
            {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
          </div>
        </>
      )}

      {(formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Datum</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={startDateRef}
              min={getTodayDateString()}
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={endDateRef}
              min={getTodayDateString()}
            />
            {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
          </div>
        </>
      )}

      {(formData.type === 'Opening' || formData.type === 'Uitzondering') && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Uur</label>
            <select
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Start Uur</option>
              {formData.timeframe &&
                getTimeOptions(formData.timeframe, shifts).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
            {errors.startHour && <p className="exceptions-page__error">{errors.startHour}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Uur</label>
            <select
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Eind Uur</option>
              {formData.timeframe &&
                getTimeOptions(formData.timeframe, shifts).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
            {errors.endHour && <p className="exceptions-page__error">{errors.endHour}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Max. Zitplaatsen</label>
            <input
              type="number"
              name="maxSeats"
              value={formData.maxSeats}
              onChange={handleChange}
              className="exceptions-page__input"
            />
            {errors.maxSeats && <p className="exceptions-page__error">{errors.maxSeats}</p>}
          </div>
        </>
      )}

      {/* Dagen van de week - Not shown for Sluitingsdag */}
      {formData.type && formData.type !== 'Sluitingsdag' && (
        <div className="exceptions-page__form-group">
          <label>Dagen van de week</label>
          <div className="exceptions-page__checkbox-group">
            {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(
              (day) => (
                <label key={day} className="exceptions-page__checkbox-label">
                  <input
                    type="checkbox"
                    name="daysOfWeek"
                    value={day}
                    checked={formData.daysOfWeek.includes(day)}
                    onChange={handleChange}
                    className="exceptions-page__checkbox"
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              )
            )}
          </div>
          {errors.daysOfWeek && <p className="exceptions-page__error">{errors.daysOfWeek}</p>}
        </div>
      )}

      <button type="submit" className="button-style-3">
        Opslaan
      </button>
    </form>
  );
};

export default ExceptionForm;
