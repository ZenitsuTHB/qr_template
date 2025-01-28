// src/Components/Standard/index.js

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import './css/tabs.css';

const ModalWithoutTabs = ({ content, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="modal-standard-component">
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            <IoCloseOutline size={24} />
          </button>

          <div className="modal-body">
            {content}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModalWithoutTabs;
