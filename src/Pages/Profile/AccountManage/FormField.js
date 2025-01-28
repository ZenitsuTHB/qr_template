// src/components/Profile/FormField.jsx

import React from 'react';

const FormField = ({ label, name, type = 'text', icon: Icon, value, onChange, error, placeholder, halfWidth }) => (
  <div className={`form-group ${halfWidth ? 'half-width' : ''}`}>
    <div className="input-container">
      {Icon && <Icon className="input-icon" />}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={label}
      />
    </div>
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default FormField;
