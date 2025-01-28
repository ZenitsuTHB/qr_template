import React, { useState, useEffect } from 'react';
import ValueSelectorGuests from './ValueSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import './css/reservationMode.css'; // Import CSS for reservation mode
import moment from 'moment';
import useApi from '../../../Hooks/useApi'; // Import useApi
import { isWeekInPast } from './Utils/dateUtils';

const ReservationStepOne = ({
  formData,
  errors,
  handleChange,
  handleStepOneSubmit,
  setFormData,
  timeblocks,
  loadingTimeblocks,
  timeblocksError,
  restaurantData,
}) => {
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState(null); // startDate state
  const [reservations, setReservations] = useState([]); // reservations state
  const api = useApi(); // Initialize useApi hook

  const resetFormDataFields = (fieldsToReset) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      fieldsToReset.forEach((field) => {
        newFormData[field] = '';
      });
      return newFormData;
    });
  };

  // Initialize startDate
  useEffect(() => {
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    let firstWeekStart = today.clone().startOf('isoWeek');
    while (isWeekInPast(firstWeekStart)) {
      firstWeekStart.add(1, 'week');
    }
    setStartDate(firstWeekStart);
  }, []);

  // Fetch reservations when startDate changes
  useEffect(() => {
    const fetchReservations = async () => {
      if (startDate) {
        const beginDate = startDate.format('YYYY-MM-DD');
        const endDate = startDate.clone().add(13, 'days').format('YYYY-MM-DD');
        const restaurantId = localStorage.getItem('username');
        const endpoint = `${window.baseDomain}api/slots/${restaurantId}/${beginDate}/${endDate}`;

        try {
          console.log('Calendar Slots GET');
          const data = await api.get(endpoint, { noCache: true });
          setReservations(data); // Update reservations state
          console.log('Fetched reservations:', data);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      }
    };

    fetchReservations();
  }, [startDate, api]);

  // Handler for week change
  const handleWeekChange = (newStartDate) => {
    setStartDate(newStartDate);
  };

  // Set default reservation mode to 'met_limieten' on component mount
  useEffect(() => {
    if (!formData.reservationMode) {
      handleChange({
        target: { name: 'reservationMode', value: 'met_limieten' },
      });
    }
  }, [formData.reservationMode, handleChange]);

  useEffect(() => {
    resetFormDataFields(['date', 'time']);
  }, [guests]);

  if (timeblocksError) {
    return (
      <div>
        <a
          href="https://dashboard.reservaties.net/#/scheme"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}
        >
          Klik hier
        </a>{' '}
        om uw openingsuren in te stellen.
      </div>
    );
  }

  // Handler for reservation mode selection
  const handleReservationModeSelect = (mode) => {
    handleChange({
      target: { name: 'reservationMode', value: mode },
    });
    // Reset date and time when reservation mode changes
    resetFormDataFields(['date', 'time']);
  };

  return (
    <form
      className="account-manage-form"
      onSubmit={handleStepOneSubmit}
      noValidate
    >
      {/* Reservation Mode Selection */}
      <div className="form-group reservation-mode">
        <div className="reservation-mode-buttons">
          <button
            type="button"
            className={`reservation-mode-button ${
              formData.reservationMode === 'met_limieten' ? 'active' : ''
            }`}
            onClick={() => handleReservationModeSelect('met_limieten')}
            aria-pressed={formData.reservationMode === 'met_limieten'}
          >
            Met Limieten
          </button>
          <button
            type="button"
            className={`reservation-mode-button ${
              formData.reservationMode === 'zonder_regels' ? 'active' : ''
            }`}
            onClick={() => handleReservationModeSelect('zonder_regels')}
            aria-pressed={formData.reservationMode === 'zonder_regels'}
          >
            Onbeperkt
          </button>
        </div>
      </div>

      <ValueSelectorGuests
        setGuests={setGuests}
        value={formData.guests}
        onChange={handleChange}
        error={errors.guests}
      />

      {formData.guests && (
        <>
          <DateSelector
            guests={formData.guests}
            formData={formData}
            handleChange={handleChange}
            resetFormDataFields={resetFormDataFields}
            timeblocks={timeblocks}
            restaurantData={restaurantData}
            reservations={reservations} // Pass down reservations
            startDate={startDate} // Pass down startDate
            onWeekChange={handleWeekChange} // Pass down onWeekChange handler
            reservationMode={formData.reservationMode} // Pass reservationMode
          />
        </>
      )}

      {formData.date && (
        <>
          <TimeSelector
            guests={formData.guests}
            formData={formData}
            handleChange={handleChange}
            field={{ id: 'time', label: 'Tijd' }}
            selectedDate={formData.date}
            setCurrentExpandedField={() => {}}
            restaurantData={restaurantData}
            reservations={reservations}
            reservationMode={formData.reservationMode} // Pass reservationMode
          />
        </>
      )}
    </form>
  );
};

export default ReservationStepOne;
