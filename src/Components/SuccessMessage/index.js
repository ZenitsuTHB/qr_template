import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './css/successMessage.css';

const SuccessMessage = ({ message }) => {
  return (
	<div className="success-component">
		<div className="success-message">
		<FaCheckCircle className="success-icon" />
		<p>{message}</p>
		</div>
	</div>
  );
};

export default SuccessMessage;
