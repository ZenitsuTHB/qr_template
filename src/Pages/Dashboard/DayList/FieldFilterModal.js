// src/Components/ReservationsList/FieldFilterModal.js

import React, { useState } from 'react';
import './css/fieldFilterModal.css';
import FIELD_CONFIG from './fieldConfig.js';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard/index.js';

const FieldFilterModal = ({ isOpen, onClose, visibleFields, setVisibleFields }) => {
  const [selectedFields, setSelectedFields] = useState(visibleFields);

  const handleFieldChange = (fieldKey) => {
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter((key) => key !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const handleConfirm = () => {
    setVisibleFields(selectedFields);
    onClose();
  };

  return (
    isOpen && (
      <ModalWithoutTabs
        content={
          <div className="field-filter-modal">
            <h2>Selecteer velden om weer te geven</h2>
            <div className="field-options">
              {FIELD_CONFIG.map((field) => (
                <label key={field.key} className="field-option">
                  <input
                    type="checkbox"
                    disabled={field.alwaysVisible}
                    checked={selectedFields.includes(field.key)}
                    onChange={() => handleFieldChange(field.key)}
                  />
                  {field.label}
                </label>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirm}>
                Bevestigen
              </button>
            </div>
          </div>
        }
        onClose={onClose}
      />
    )
  );
};

export default FieldFilterModal;
