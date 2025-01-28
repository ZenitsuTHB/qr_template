// AccountManage.jsx

import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaHome, FaCity, FaMapPin, FaUtensils, FaEnvelope } from 'react-icons/fa';
import { validateAccountData } from './Utils/validationUtils';
import FormField from './FormField';
import './css/accountManage.css';
import './css/mobile.css';

const AccountManage = ({ accountData, setAccountData, api, triggerNotification }) => {
  // Determine the greeting based on the current time
  const hour = new Date().getHours();
  let greeting;
  if (hour < 6) {
    greeting = 'Goedenacht 🌙';
  } else if (hour < 12) {
    greeting = 'Goedemorgen 👋'; 
  } else if (hour < 18) {
    greeting = 'Goedemiddag ☀️';
  } else {
    greeting = 'Goedenavond 😊';
  }

  const [formData, setFormData] = useState({
    first_name: accountData.first_name || '',
    last_name: accountData.last_name || '',
    email: accountData.email || '',
    phone_number: accountData.phone_number || '',
    street: accountData.street || '',
    house_number: accountData.house_number || '',
    city: accountData.city || '',
    postal_code: accountData.postal_code || '',
    bio: accountData.bio || '',
    imageId: accountData.imageId || '',
    restaurant_name: accountData.restaurant_name || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      first_name: accountData.first_name || '',
      last_name: accountData.last_name || '',
      email: accountData.email || '',
      phone_number: accountData.phone_number || '',
      street: accountData.street || '',
      house_number: accountData.house_number || '',
      city: accountData.city || '',
      postal_code: accountData.postal_code || '',
      bio: accountData.bio || '',
      imageId: accountData.imageId || '',
      restaurant_name: accountData.restaurant_name || '',
    });

    if (accountData.restaurant_name) {
      localStorage.setItem('restaurantName', accountData.restaurant_name);
    }
  }, [accountData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateAccountData(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setLoading(true);
        if (accountData._id) {
          await api.put(`${window.baseDomain}api/account`, formData);
          triggerNotification('Account bijgewerkt', 'success');
        } else {
          await api.post(`${window.baseDomain}api/account`, formData);
          triggerNotification('Gegevens toegevoegd', 'success');
        }

        if (formData.restaurant_name) {
          localStorage.setItem('restaurantName', formData.restaurant_name);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        triggerNotification('Fout bij het opslaan', 'error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.setItem('loginSuccessful', false);
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <h2 className="account-manage-title">{greeting}</h2>
      <div className="account-manage-container">
        <form className="account-manage-form" onSubmit={handleSave} noValidate>
          <FormField
            label="Voornaam"
            name="first_name"
            placeholder="Voornaam"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            icon={FaUser}
          />
          <FormField
            label="Achternaam"
            name="last_name"
            placeholder="Achternaam"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            icon={FaUser}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={FaEnvelope}
          />
          <FormField
            label="Telefoonnummer"
            name="phone_number"
            type="tel"
            placeholder="Telefoonnummer"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            icon={FaPhone}
          />
          <div className="form-row">
            <FormField
              label="Straat"
              name="street"
              placeholder="Straat"
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
              icon={FaHome}
              halfWidth={true}
            />
            <FormField
              label="Huisnummer"
              name="house_number"
              placeholder="Huisnummer"
              value={formData.house_number}
              onChange={handleChange}
              error={errors.house_number}
              icon={FaHome}
              halfWidth={true}
            />
          </div>
          <div className="form-row">
            <FormField
              label="Stad"
              name="city"
              placeholder="Stad"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              icon={FaCity}
              halfWidth={true}
            />
            <FormField
              label="Postcode"
              name="postal_code"
              placeholder="Postcode"
              value={formData.postal_code}
              onChange={handleChange}
              error={errors.postal_code}
              icon={FaMapPin}
              halfWidth={true}
            />
          </div>
          <FormField
            label="Naam restaurant"
            name="restaurant_name"
            placeholder="Naam restaurant"
            value={formData.restaurant_name}
            onChange={handleChange}
            error={errors.restaurant_name}
            icon={FaUtensils}
          />
          <div className="button-row">
            <button type="submit" className="button-style-3" disabled={loading}>
              {loading ? 'Opslaan...' : 'Opslaan'}
            </button>
            <button
              type="button"
              className="button-style-3 button-style-logout"
              onClick={handleLogout}
            >
              Uitloggen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountManage;
