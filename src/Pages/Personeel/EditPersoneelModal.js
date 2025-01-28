// src/Pages/Personeel/EditPersoneelModal.js
import React, { useState } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import './css/personeel.css';

const EditPersoneelModal = ({
  isVisible,
  personeel,
  api,
  triggerNotification,
  refreshPersoneel,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    voornaam: personeel.voornaam || '',
    achternaam: personeel.achternaam || '',
    startDate: personeel.startDate || '',
    endDate: personeel.endDate || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.voornaam.trim()) validationErrors.voornaam = 'Voornaam is verplicht.';
    if (!formData.achternaam.trim()) validationErrors.achternaam = 'Achternaam is verplicht.';
    if (!formData.startDate) validationErrors.startDate = 'Startdatum is verplicht.';
    if (!formData.endDate) validationErrors.endDate = 'Einddatum is verplicht.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
    };

    try {
      const response = await api.put(`${window.baseDomain}api/personeel/${personeel._id}`, payload);
      if (response) {
        triggerNotification('Personeel succesvol bijgewerkt', 'success');
        refreshPersoneel();
        onClose();
      } else {
        triggerNotification('Fout bij het bijwerken van het personeel', 'error');
      }
    } catch (error) {
      console.error('Error updating personeel:', error);
      triggerNotification('Fout bij het bijwerken van het personeel', 'error');
    }
  };

  if (!isVisible) return null;

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="personeel-component__edit-modal">
          <form className="personeel-component__form" onSubmit={handleSubmit}>
            <div className="personeel-component__form-group">
              <label>Voornaam</label>
              <input
                type="text"
                name="voornaam"
                value={formData.voornaam}
                onChange={handleChange}
                className="personeel-component__input"
              />
              {errors.voornaam && <p className="personeel-component__error">{errors.voornaam}</p>}
            </div>

            <div className="personeel-component__form-group">
              <label>Achternaam</label>
              <input
                type="text"
                name="achternaam"
                value={formData.achternaam}
                onChange={handleChange}
                className="personeel-component__input"
              />
              {errors.achternaam && <p className="personeel-component__error">{errors.achternaam}</p>}
            </div>

            <div className="personeel-component__form-group">
              <label>Start Datum</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="personeel-component__input"
              />
              {errors.startDate && <p className="personeel-component__error">{errors.startDate}</p>}
            </div>

            <div className="personeel-component__form-group">
              <label>Eind Datum</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="personeel-component__input"
              />
              {errors.endDate && <p className="personeel-component__error">{errors.endDate}</p>}
            </div>

            <button type="submit" className="button-style-3">
              Personeel Bijwerken
            </button>
          </form>
        </div>
      }
    />
  );
};

export default EditPersoneelModal;
