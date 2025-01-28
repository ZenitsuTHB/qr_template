// src/components/PincodeScreen/PincodeScreen.jsx

import React from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import PincodeInput from './PincodeInput';
import './css/pincodeScreen.css';
import './css/mobile.css';

const PincodeScreen = () => {
  return (
    <div className="pincode-page">
      <div className="pincode-screen">
        <div className="pincode-container">
			<h2>Vul Uw Pincode In</h2>
          <PincodeInput length={6} />
        </div>
      </div>
    </div>
  );
};

export default withHeader(PincodeScreen);
