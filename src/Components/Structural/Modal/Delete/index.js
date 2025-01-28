// src/components/Common/ConfirmationModal.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './css/confirmationModal.css';

const ConfirmationModal = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'discard-button red',
  cancelButtonClass = 'cancel-button',
}) => {
  if (!isVisible) return null;

  return (
	<div className='confirmation-modal-component'>
    <div className="modal confirmation-modal">
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="secondary-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button
            type="button"
            className={`button ${cancelButtonClass}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`button ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
	</div>
  );
};

export default ConfirmationModal;
