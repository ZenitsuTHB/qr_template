// Table.js
import React, { useState } from 'react';
import './css/table.css';
import { FaSyncAlt, FaEdit, FaClone, FaTrash } from 'react-icons/fa';

const Table = ({
  numberOfGuests,
  tableNumber,
  rotate,
  duplicate,
  deleteTable,
  editTable, // **Added editTable prop**
  showActions = true, // **Default to true**
}) => { 
  const [isHovered, setIsHovered] = useState(false);
  const isSquare = numberOfGuests === 4;

  const tableWidth = isSquare ? 70 : 70 + (numberOfGuests - 4) * 15;
  const tableHeight = 70;

  const chairsPerSide = Math.ceil(numberOfGuests / 2);

  const topChairs = [];
  const bottomChairs = [];

  for (let i = 0; i < chairsPerSide; i++) {
    topChairs.push(i);
    bottomChairs.push(i);
  }

  return (
    <div
      className="table-plan-component table-container"
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action Buttons */}
      {showActions && isHovered && (
        <div className="table-plan-component action-buttons">
          <button
            className="table-plan-component action-button rotate-button"
            onClick={rotate}
            aria-label="Rotate Table"
          >
            <FaSyncAlt color="#555555" />
          </button>
          <button
            className="table-plan-component action-button duplicate-button"
            onClick={editTable}
            aria-label="Edit Table"
          >
            <FaEdit color="#555555" />
          </button>
          <button
            className="table-plan-component action-button duplicate-button"
            onClick={duplicate}
            aria-label="Duplicate Table"
          >
            <FaClone color="#555555" />
          </button>
          <button
            className="table-plan-component action-button delete-button"
            onClick={deleteTable}
            aria-label="Delete Table"
          >
            <FaTrash color="red" />
          </button>
        </div>
      )}
      <div
        className="table-plan-component chairs top-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.slice(0, Math.floor(numberOfGuests / 2)).map((chair, index) => (
          <div key={`top-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
      <div
        className="table-plan-component table"
        style={{
          width: `${tableWidth}px`,
          height: `${tableHeight}px`,
        }}
      ></div>
      <div
        className="table-plan-component chairs bottom-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.slice(0, Math.ceil(numberOfGuests / 2)).map((chair, index) => (
          <div key={`bottom-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
      {/* **Render the table number if it exists** */}
      {tableNumber && (
        <div className="table-plan-component table-number">T{tableNumber}</div>
      )}
    </div>
  );
};

export default Table;
