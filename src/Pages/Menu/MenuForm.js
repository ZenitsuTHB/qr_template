import React, { useState } from 'react';
import './css/menu.css';

const MenuForm = ({ api, triggerNotification, refreshMenus }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
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
    if (!formData.name.trim()) validationErrors.name = 'Menu naam is verplicht.';
    if (!formData.startDate) validationErrors.startDate = 'Startdatum is verplicht.';
    if (!formData.endDate) validationErrors.endDate = 'Einddatum is verplicht.';
    if (!formData.startHour) validationErrors.startHour = 'Startuur is verplicht.';
    if (!formData.endHour) validationErrors.endHour = 'Einduur is verplicht.';
    if (formData.daysOfWeek.length === 0) validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      daysOfWeek: formData.daysOfWeek,
    };

    try {
      const response = await api.post(`${window.baseDomain}api/menu`, payload);
      if (response) {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          startHour: '',
          endHour: '',
          daysOfWeek: [],
        });
        setErrors({});
        triggerNotification('Menu succesvol toegevoegd', 'success');
        refreshMenus();
      } else {
        triggerNotification('Fout bij het toevoegen van het menu', 'error');
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      triggerNotification('Fout bij het toevoegen van het menu', 'error');
    }
  };

  return (
    <form className="menu-component__form" onSubmit={handleSubmit}>
      <div className="menu-component__form-group">
        <label>Menu Naam</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Menu Naam"
          className="menu-component__input"
        />
        {errors.name && <p className="menu-component__error">{errors.name}</p>}
      </div>

      <div className="menu-component__form-group">
        <label>Start Datum</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="menu-component__input"
        />
        {errors.startDate && <p className="menu-component__error">{errors.startDate}</p>}
      </div>

      <div className="menu-component__form-group">
        <label>Eind Datum</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="menu-component__input"
        />
        {errors.endDate && <p className="menu-component__error">{errors.endDate}</p>}
      </div>

      <div className="menu-component__form-group">
        <label>Start Uur</label>
        <input
          type="time"
          name="startHour"
          value={formData.startHour}
          onChange={handleChange}
          className="menu-component__input"
        />
        {errors.startHour && <p className="menu-component__error">{errors.startHour}</p>}
      </div>

      <div className="menu-component__form-group">
        <label>Eind Uur</label>
        <input
          type="time"
          name="endHour"
          value={formData.endHour}
          onChange={handleChange}
          className="menu-component__input"
        />
        {errors.endHour && <p className="menu-component__error">{errors.endHour}</p>}
      </div>

      <div className="menu-component__form-group">
        <label>Dagen van de week</label>
        <div className="menu-component__checkbox-group">
          {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(
            (day) => (
              <label key={day} className="menu-component__checkbox-label">
                <input
                  type="checkbox"
                  name="daysOfWeek"
                  value={day}
                  checked={formData.daysOfWeek.includes(day)}
                  onChange={handleChange}
                  className="menu-component__checkbox"
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            )
          )}
        </div>
        {errors.daysOfWeek && <p className="menu-component__error">{errors.daysOfWeek}</p>}
      </div>

      <button type="submit" className="button-style-3">
        Menu Toevoegen
      </button>
    </form>
  );
};

export default MenuForm;
