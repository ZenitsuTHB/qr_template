// src/components/GiftCard/ValidationSection/index.js

import React, { useState } from 'react';
import ModalWithoutTabs from '../../../../Components/Structural/Modal/Standard'; // Adjusted import path
import './css/validationSection.css';
import { FaTimesCircle } from 'react-icons/fa';
import ValidationPopup from './ValidationPopup'; // Import the ValidationPopup component

const ValidationSection = () => {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(null); // null: no attempt, true: valid, false: invalid
  const [showPopup, setShowPopup] = useState(false);
  const [deductValue, setDeductValue] = useState('');
  const [deductError, setDeductError] = useState('');

  // Mock data for demonstration purposes
  const giftCardData = {
    status: 'Active',
    initialValue: '€100', // Aangepast naar Euro-teken
    availableBalance: 100,
    expirationDate: '31-12-2025', // Formaat aangepast indien nodig
    monthsValid: 24,
    reservationDate: '27-04-2024', // Formaat aangepast indien nodig
  };

  const handleValidateCode = () => {
    // Simple validation logic (for demonstration)
    if (code.trim().toUpperCase() === 'GIFT2024') { // Case-insensitive vergelijking
      setIsValid(true);
      setShowPopup(true);
    } else {
      setIsValid(false);
    }
  };

  const handleDeduct = () => {
    const value = parseFloat(deductValue);
    if (isNaN(value) || value <= 0) {
      setDeductError('Voer een geldig bedrag in.');
      return;
    }
    if (value > giftCardData.availableBalance) {
      setDeductError('Afschrijving overschrijdt beschikbaar saldo.');
      return;
    }
    // Proceed with deduction logic (e.g., API call)
    // For demonstration, we'll just close the popup
    setDeductError('');
    setShowPopup(false);
    alert(`€${value} is afgeschreven van uw cadeaubon.`);
  };

  return (
    <div className="validation-section">
      <h2 className="validation-section__title">Valideer</h2>
      <p className="validation-section__description">
        Voer hier uw cadeaubon code in
      </p>
      <input
        type="text"
        className="validation-section__input"
        placeholder="Voer Cadeaubon Code in"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="button-style-3"
        onClick={handleValidateCode}
      >
        Code Valideren
      </button>
      {isValid === false && (
        <p className="validation-section__error">
          <FaTimesCircle /> Voer een geldige code in
        </p>
      )}

      {showPopup && (
        <ModalWithoutTabs
          onClose={() => setShowPopup(false)}
          content={
            <ValidationPopup
              giftCardData={giftCardData}
              code={code} // Nieuwe prop toegevoegd
              onClose={() => setShowPopup(false)}
              deductValue={deductValue}
              setDeductValue={setDeductValue}
              deductError={deductError}
              handleDeduct={handleDeduct}
            />
          }
        />
      )}
    </div>
  );
};

export default ValidationSection;
