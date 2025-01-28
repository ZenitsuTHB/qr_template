import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import { FaUser, FaPhone, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/nl'; // Import Dutch locale
import './css/reservationsStepTwo.css';

const ReservationStepTwoFiltering = ({
  formData,
  errors,
  handleChange,
  isSubmitting,
  menuData,
}) => {
  const [availableMenus, setAvailableMenus] = useState([]);

  useEffect(() => {
    moment.locale('nl'); // Set locale to Dutch
    if (formData.date && formData.time && menuData.length > 0) {
      const selectedDate = formData.date; // 'YYYY-MM-DD' format
      const selectedTime = formData.time; // 'HH:mm' format
      const selectedDateTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm');

      const filteredMenus = menuData.filter((menu) => {
        const menuStartDate = moment(menu.startDate, 'YYYY-MM-DD');
        const menuEndDate = moment(menu.endDate, 'YYYY-MM-DD');
        const isDateInRange = selectedDateTime.isBetween(menuStartDate, menuEndDate, 'day', '[]');

        const menuStartTime = moment(menu.startHour, 'HH:mm');
        const menuEndTime = moment(menu.endHour, 'HH:mm');
        const selectedTimeMoment = moment(selectedTime, 'HH:mm');
        const isTimeInRange = selectedTimeMoment.isBetween(menuStartTime, menuEndTime, 'minute', '[]');

        const selectedDayOfWeek = selectedDateTime.format('dddd').toLowerCase();
        const daysOfWeek = menu.daysOfWeek.map((day) => day.toLowerCase());
        const isDayMatching = daysOfWeek.length === 0 || daysOfWeek.includes(selectedDayOfWeek);

        return isDateInRange && isTimeInRange && isDayMatching;
      });

      setAvailableMenus(filteredMenus);
    } else {
      setAvailableMenus([]);
    }
  }, [formData.date, formData.time, menuData]);

  return (
    <div className="reservation-step-two">
      <div className="account-manage-form" noValidate>
        {/* Name Fields Container */}


        {/* Menu Selection Box */}
        {availableMenus.length > 0 && (
          <FormField
            label="Menu"
            name="menu"
            type="select"
            options={availableMenus.map((menu) => ({
              value: menu.name, // Adjust according to your data structure
              label: menu.name,
            }))}
            value={formData.menu}
            onChange={handleChange}
            error={errors.menu}
          />
        )}
        
        <div className="name-fields">
          <FormField
            label="Voornaam"
            name="firstName"
            placeholder="Voornaam"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            icon={FaUser}
          />
          <FormField
            label="Achternaam"
            name="lastName"
            placeholder="Achternaam"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            icon={FaUser}
          />
        </div>

        {/* Other Form Fields */}
        <FormField
          label="E-mail"
          name="email"
          type="email"
          placeholder="E-mailadres"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={FaEnvelope}
        />
        <FormField
          label="Telefoonnummer"
          name="phone"
          type="tel"
          placeholder="Telefoonnummer"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={FaPhone}
        />
        <FormField
          label="Extra info"
          name="extraInfo"
          type="textarea"
          placeholder="Extra informatie"
          value={formData.extraInfo}
          onChange={handleChange}
          error={errors.extraInfo}
          icon={FaInfoCircle}
        />
      </div>
    </div>
  );
};

export default ReservationStepTwoFiltering;
