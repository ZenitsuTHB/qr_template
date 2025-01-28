// ToggleSwitch.jsx

import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ checked, onChange, label, className }) => (
  <div className={`day-header ${className || ''}`}>
    <span className="day-label">{label}</span>
    <label className="switch" aria-label={label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
        aria-labelledby={`${label}-toggle`}
      />
      <span className="slider round"></span>
    </label>
  </div>
);

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  className: '',
};

export default ToggleSwitch;
