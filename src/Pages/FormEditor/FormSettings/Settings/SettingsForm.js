// src/components/FormSettings/SettingsForm.jsx

import React from 'react';

const SettingsForm = ({ formData, handleChange, handleBlur }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="pageTitle">Titel:</label>
        <input
          type="text"
          id="pageTitle"
          name="pageTitle"
          value={formData.pageTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Voer de paginatitel in"
        />
      </div>

      <div className="form-group">
        <label htmlFor="generalNotification">Mededeling:</label>
        <textarea
          id="generalNotification"
          name="generalNotification"
          value={formData.generalNotification}
          onChange={handleChange}
          placeholder="Voer een algemene mededeling in"
        ></textarea>
      </div>
    </>
  );
};

export default SettingsForm;
