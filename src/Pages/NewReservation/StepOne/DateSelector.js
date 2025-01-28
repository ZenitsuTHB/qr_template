import React from 'react';
import Calendar from './Calendar';
import moment from 'moment';

const DateSelector = ({
  guests,
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
  restaurantData,
  reservations,
  startDate,
  onWeekChange,
  reservationMode, // Receive reservationMode as prop
}) => {
  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('Selected date:', formattedDate);
    handleChange({
      target: { name: 'date', value: formattedDate },
    });
    resetFormDataFields(['time']);
  };

  return (
    <div className="form-group date-selector-container">
      <Calendar
        guests={guests}
        selectedDate={formData.date || null}
        onSelectDate={handleDateSelect}
        autoExpand={false}
        reservationMode={reservationMode} // Pass reservationMode to Calendar
        restaurantData={restaurantData}
        startDate={startDate}
        onWeekChange={onWeekChange}
        reservations={reservations}
      />
    </div>
  );
};

export default DateSelector;
