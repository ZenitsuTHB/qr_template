// TableEditModalContent.js
import React, { useState } from 'react';
import './css/tableEditModalContent.css';

const TableEditModalContent = ({ element, onSave, onClose }) => {
  const [tableNumber, setTableNumber] = useState(element.tableNumber || '');
  const [name, setName] = useState(element.name || '');
  const [shape, setShape] = useState(element.shape || 'rond');
  const [minCapacity, setMinCapacity] = useState(element.minCapacity || 1);
  const [maxCapacity, setMaxCapacity] = useState(element.maxCapacity || 10);
  const [priority, setPriority] = useState(element.priority || 'Medium');

  const handleSave = () => {
    const updatedElement = {
      ...element,
      tableNumber,
      name,
      shape,
      minCapacity,
      maxCapacity,
      priority,
    };
    onSave(updatedElement);
  };

  return (
    <div className="table-edit-modal-content">
      <h2>Bewerk Tafel</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Tafelnummer</label>
          <div className="input-container">
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Voer het tafelnummer in"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Naam</label>
          <div className="input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Voer de naam in"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Vorm</label>
          <div className="input-container">
            <select value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="rond">Rond</option>
              <option value="vierkant">Vierkant</option>
              <option value="metStoelen">Met Stoelen</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Min capaciteit</label>
          <div className="input-container">
            <input
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(parseInt(e.target.value, 10))}
              min="1"
              placeholder="Minimum aantal gasten"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Max capaciteit</label>
          <div className="input-container">
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(parseInt(e.target.value, 10))}
              min={minCapacity}
              placeholder="Maximum aantal gasten"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Prioriteit</label>
          <div className="input-container">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="metVoorangInvullen">Met Voorang Invullen</option>
              <option value="snellerInvullen">Sneller Invullen</option>
              <option value="tragerInvullen">Trager Invullen</option>
              <option value="alsLaatsteIndelen">Als Laatste Indelen</option>
            </select>
          </div>
        </div>
        <button className="settings-button save-button" onClick={handleSave}>
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default TableEditModalContent;
