// MaxCapacityAccordion.js

import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch';
import './css/maxCapacityAccordion.css';

const MaxCapacityAccordion = ({
  enabled,
  setEnabled,
  maxCapacity,
  setMaxCapacity,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(enabled);

  React.useEffect(() => {
    setIsExpanded(enabled);
  }, [enabled]);

  const handleHeaderClick = () => {
    if (enabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div className="max-capacity-accordion">
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleHeaderClick}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          <span>Max Capaciteit</span>
        </div>
        <div className="toggle-middle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={handleToggle} />
        </div>
      </div>
      {isExpanded && enabled && (
        <div className="item-content">
          <label htmlFor="maxCapacity">Max Capaciteit</label>
          <input
            type="number"
            id="maxCapacity"
            name="maxCapacity"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            min="1"
          />
        </div>
      )}
    </div>
  );
};

export default MaxCapacityAccordion;
