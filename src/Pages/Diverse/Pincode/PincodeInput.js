// src/components/PincodeScreen/PincodeInput.jsx

import React, { useState, useRef } from 'react';
import './css/pincodeInput.css';

const PincodeInput = ({ length }) => {
  const [digits, setDigits] = useState(
    Array.from({ length }, () => ({ value: '', masked: false }))
  );

  const timeoutRefs = useRef(Array(length).fill(null));

  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index].value = value;
    newDigits[index].masked = false;
    setDigits(newDigits);

    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    timeoutRefs.current[index] = setTimeout(() => {
      const updatedDigits = [...digits];
      updatedDigits[index].masked = true;
      setDigits(updatedDigits);
      timeoutRefs.current[index] = null;
    }, 500);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (digits[index].value === '' && index > 0) {
        newDigits[index - 1].value = '';
        newDigits[index - 1].masked = false;
        setDigits(newDigits);
        inputRefs.current[index - 1].focus();

        if (timeoutRefs.current[index - 1]) {
          clearTimeout(timeoutRefs.current[index - 1]);
          timeoutRefs.current[index - 1] = null;
        }
      } else {
        newDigits[index].value = '';
        newDigits[index].masked = false;
        setDigits(newDigits);

        if (timeoutRefs.current[index]) {
          clearTimeout(timeoutRefs.current[index]);
          timeoutRefs.current[index] = null;
        }
      }
    }
  };

  const handleFocus = (index) => {
    if (digits[index].masked) {
      const newDigits = [...digits];
      newDigits[index].masked = false;
      setDigits(newDigits);
    }
  };

  return (
    <div className="pincode-input-container">
      {digits.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          className="pincode-input"
          value={digit.masked ? '•' : digit.value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default PincodeInput;
