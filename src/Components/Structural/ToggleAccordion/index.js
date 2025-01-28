// src/components/ToggleAccordion.jsx

import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './css/toggleAccordion.css'; // Ensure you have corresponding CSS

const ToggleAccordion = ({
  label,
  enabled,
  onToggle,
  children,
  initialExpanded = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Expand when enabled is set to true
  useEffect(() => {
    if (enabled) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [enabled]);

  const handleHeaderClick = () => {
    if (enabled) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className={`toggle-accordion ${className}`}>
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleHeaderClick}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {/* Conditionally render the chevron icon when enabled */}
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          {label}
        </div>
        {/* ToggleSwitch remains on the right and stops event propagation */}
        <div className="toggle-middle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={onToggle} label={`${label} Toggle`} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && enabled && (
          <motion.div
            className="item-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ToggleAccordion.propTypes = {
  label: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
  initialExpanded: PropTypes.bool,
  className: PropTypes.string,
};

ToggleAccordion.defaultProps = {
  children: null,
  initialExpanded: false,
  className: '',
};

export default ToggleAccordion;
