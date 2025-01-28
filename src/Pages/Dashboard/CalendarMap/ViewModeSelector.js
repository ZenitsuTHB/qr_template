// ViewModeSelector.js

import React, { useRef, useEffect } from 'react';
import { FaLayerGroup } from 'react-icons/fa';
import './css/viewModeSelector.css';

const ViewModeSelector = ({
  selectedViewMode,
  setSelectedViewMode,
}) => {
  const [isViewModeOptionsOpen, setIsViewModeOptionsOpen] = React.useState(false);
  const viewModeButtonRef = useRef(null);
  const viewModeOptionsRef = useRef(null);

  const viewModes = ['Algemeen', 'Weer'];

  // Handle Click Outside for View Mode Options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewModeOptionsRef.current &&
        !viewModeOptionsRef.current.contains(event.target) &&
        viewModeButtonRef.current &&
        !viewModeButtonRef.current.contains(event.target)
      ) {
        setIsViewModeOptionsOpen(false);
      }
    };

    if (isViewModeOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewModeOptionsOpen]);

  const handleViewModeSelection = (mode) => {
    setSelectedViewMode(mode);
    setIsViewModeOptionsOpen(false);
  };

  const toggleViewModeOptions = () => {
    setIsViewModeOptionsOpen(!isViewModeOptionsOpen);
  };

  return (
    <div className="view-mode-selector">
      <button
        onClick={toggleViewModeOptions}
        className="standard-button blue view-mode-button"
        ref={viewModeButtonRef}
      >
        <FaLayerGroup className="view-mode-button-icon" />
        {selectedViewMode}
      </button>

      {isViewModeOptionsOpen && (
        <div className="view-mode-options-container" ref={viewModeOptionsRef}>
          {viewModes.map((mode) => (
            <div
              key={mode}
              className="view-mode-option"
              onClick={() => handleViewModeSelection(mode)}
            >
              {mode}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewModeSelector;
