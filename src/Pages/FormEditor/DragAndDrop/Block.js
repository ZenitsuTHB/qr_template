// src/components/DragAndDropEditor/Block.jsx

import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaGripHorizontal, FaSave } from 'react-icons/fa';
import './css/block.css';
import './css/animations.css';
import './css/style.css';
import './css/mobile.css';

const Block = ({
  type,
  label,
  id,
  placeholder: initialPlaceholder,
  required: initialRequired,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldLabel, setFieldLabel] = useState(label);
  const [placeholder, setPlaceholder] = useState(initialPlaceholder || '');
  const [isRequired, setIsRequired] = useState(initialRequired || false);

  // Determine if the block is a default block
  const isDefault = id.startsWith('default-');

  const renderLabel = () => (
    <label>
      {fieldLabel}
      {isRequired && <span className="required-warning">(*)</span>}
    </label>
  );

  const renderStaticContent = () => {
    // Render static content without input fields for default blocks
    return (
      <div className="static-content">
        <span className="static-placeholder">
          {fieldLabel || 'Informatie beschikbaar'}
        </span>
      </div>
    );
  };

  const renderEditableField = () => {
    // Render editable input fields for non-default blocks
    const commonProps = {
      placeholder: placeholder || 'Voer hier uw tekst in',
      required: isRequired,
    };

    return (
      <>
        {renderLabel()}
        {type === 'textarea' ? (
          <textarea {...commonProps}></textarea>
        ) : (
          <input type={type} {...commonProps} />
        )}
      </>
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add additional logic here to save changes if necessary
  };

  return (
    <div
      className={`block ${isHovered ? 'selected' : ''} ${isDefault ? 'default-block' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsEditing(false);
      }}
    >
      {/* Conditionally render the drag handle only if not a default block */}
        <div className="drag-handle">
          <FaGripHorizontal />
        </div>
      

      <div className="block-content">
        {isEditing && !isDefault ? (
          <div className="editing-interface">
            <input
              type="text"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              placeholder="Naam"
            />
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Placeholder"
            />
            <div className="required-switch">
              <label className="switch-label">Verplicht:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={() => setIsRequired(!isRequired)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <button className="button standard-button" onClick={handleSave}>
              <FaSave /> Opslaan
            </button>
          </div>
        ) : isDefault ? (
          renderStaticContent()
        ) : (
          renderEditableField()
        )}
      </div>

      {/* Conditionally render action icons for non-default blocks */}
      {isHovered && !isDefault && !isEditing && (
        <div className="action-icons">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FaEdit />
          </button>
          <button className="delete-button" onClick={() => onDelete(id)}>
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

export default Block;
