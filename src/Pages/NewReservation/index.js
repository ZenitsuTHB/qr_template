// src/components/NewReservationAdmin.js

import React, { useState } from 'react';
import useApi from '../../Hooks/useApi';
import ReservationSidebar from './ReservationSidebar';
import { AiOutlinePlus } from 'react-icons/ai';

import './css/newReservationAdmin.css';

const NewReservationAdmin = () => {
  const api = useApi();

  const [formData, setFormData] = useState({
    guests: '',
    date: '',
    time: '',
    menu: '', // Existing
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    extraInfo: '',
    personeel: '', // Add personeel field
  });

  const [errors, setErrors] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);

  const validateStepOne = () => {
    const errors = {};
    if (!formData.guests) {
      errors.guests = 'Aantal gasten is verplicht';
    }
    if (!formData.date) {
      errors.date = 'Datum is verplicht';
    }
    if (!formData.time) {
      errors.time = 'Tijd is verplicht';
    }
    return errors;
  };

  const validateStepTwo = () => {
    const errors = {};

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'E-mail is ongeldig';
    }

    // Optional: Validate personeel selection if necessary
    // For example, require selecting personeel
    // if (!formData.personeel) {
    //   errors.personeel = 'Selecteer een personeel';
    // }

    return errors;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const stepOneErrors = validateStepOne();
    const stepTwoErrors = validateStepTwo();
    const allErrors = { ...stepOneErrors, ...stepTwoErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      const submissionData = {
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        extraInfo: formData.extraInfo,
        menu: formData.menu,
        personeel: formData.personeel, // Include personeel in submission
      };

      try {
        await api.post(`${window.baseDomain}api/auth-reservations/`, submissionData);
        setReservationSubmitted(true);
      } catch (error) {
        console.error('Error submitting reservation:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  return (
    <div className="new-reservation-page">
      <button
        className="open-sidebar-button"
        onClick={() => setIsSidebarOpen(true)}
        style={{ zIndex: isSidebarOpen ? 0 : 1000 }}
      >
        <AiOutlinePlus size={24} color="#fff" />
      </button>
      {/* Sidebar */}
      <ReservationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleFinalSubmit={handleFinalSubmit}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        reservationSubmitted={reservationSubmitted}
        onNewReservation={() => {
          setFormData({
            guests: '',
            date: '',
            time: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            extraInfo: '',
            menu: '',
            personeel: '', // Reset personeel selection
          });
          setReservationSubmitted(false);
        }}
      />
    </div>
  );
};

export default NewReservationAdmin;
