import React, { useState } from 'react';
import './css/addGiftCardSection.css';
import { FaUser, FaEnvelope, FaImage, FaPlus } from 'react-icons/fa';
import ValueSelector from './ValueSelector';
import useApi from '../../../../Hooks/useApi';

const AddGiftCardSection = () => {
  const api = useApi();

  const [formData, setFormData] = useState({
    value: '',
    firstName: '',
    lastName: '',
    email: '',
    design: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const giftCardDesigns = [
    { value: '', label: 'Selecteer Ontwerp' },
    { value: 'design1', label: 'Klassiek' },
    { value: 'design2', label: 'Modern' },
    { value: 'design3', label: 'Feestelijk' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Voer een geldig bedrag in Euro in.';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Voornaam is verplicht.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Achternaam is verplicht.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in.';
    }

    if (!formData.design) {
      newErrors.design = 'Selecteer een ontwerp voor de kaart.';
    }

    return newErrors;
  };

  const generateUniqueCode = () => {
    // Simple code generation logic (you can make it more complex if needed)
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const uniqueCode = generateUniqueCode(); // Generate the unique code here

        // Get current date in CEST and format as YYYY-MM-DD
        const creationDate = new Date();
        const options = {
          timeZone: 'Europe/Amsterdam', // CEST timezone
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        };
        const formatter = new Intl.DateTimeFormat('nl-NL', options);
        const formattedDate = formatter.format(creationDate); // Gives DD-MM-YYYY

        // Reformat to YYYY-MM-DD
        const [day, month, year] = formattedDate.split('-');
        const formattedCreationDate = `${year}-${month}-${day}`;

        const giftCardData = {
          code: uniqueCode, // Include the code in the data sent to the server
          value: parseFloat(formData.value),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          design: formData.design,
          status: 'Admin Cadeaubon', // Set the status to "Admin Cadeaubon"
          creationDate: formattedCreationDate, // Include the creation date
        };

        const response = await api.post(window.baseDomain + 'api/giftcards', giftCardData);

        if (response) {
          setSuccessMessage(`Cadeaubon succesvol aangemaakt! Uw code is: ${uniqueCode}`);
          setFormData({
            value: '',
            firstName: '',
            lastName: '',
            email: '',
            design: '',
          });
          setErrors({});
        } else {
          setErrors({ server: 'Er is een fout opgetreden bij het aanmaken van de cadeaubon.' });
        }
      } catch (error) {
        console.error(error);
        setErrors({ server: 'Er is een fout opgetreden bij het aanmaken van de cadeaubon.' });
      }
    }
  };

  return (
    <div className="add-gift-card-section">
      <h2 className="add-gift-card-section__title">Cadeaubon Toevoegen</h2>
      <form className="add-gift-card-section__form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <ValueSelector value={formData.value} onChange={handleChange} />
          {errors.value && <p className="form-error">{errors.value}</p>}
        </div>

        <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Voornaam Ontvanger"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Achternaam Ontvanger"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@voorbeeld.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <div className="input-container select-container">
            <FaImage className="input-icon" />
            <select
              id="design"
              name="design"
              value={formData.design}
              onChange={handleChange}
            >
              {giftCardDesigns.map((design) => (
                <option key={design.value} value={design.value}>
                  {design.label}
                </option>
              ))}
            </select>
          </div>
          {errors.design && <p className="form-error">{errors.design}</p>}
        </div>

        {successMessage && (
          <p className="form-success">
            <FaPlus /> {successMessage}
          </p>
        )}

        <button type="submit" className="button-style-3">
          Aanmaken
        </button>
      </form>
    </div>
  );
};

export default AddGiftCardSection;
