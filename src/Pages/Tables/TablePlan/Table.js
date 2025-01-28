// Table.js
import React from 'react';
import { useDrag } from 'react-dnd';
import './css/table.css';

const Table = ({
  capacity,
  reservations,
  tableId,
  tableName,
  removeReservation,
  updateNotes,
  isActive,
}) => {
  const isOccupied = reservations.length > 0;

  // Calculate table width based on capacity
  const tableWidth = 70 + (capacity > 4 ? (capacity - 4) * 10 : 0);
  const tableHeight = 70;

  const chairsPerSide = Math.ceil(capacity / 2);

  const topChairs = [];
  const bottomChairs = [];

  for (let i = 0; i < chairsPerSide; i++) {
    topChairs.push(i);
    bottomChairs.push(i);
  }

  return (
    <div
      className={`table-container ${isOccupied ? 'occupied' : ''} ${isActive ? 'active' : ''}`}
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }}
    >
      {/* Tooltip */}
      {isOccupied && (
        <div className="tooltip">
          {reservations.map((res) => (
            <div key={res.id} className="tooltip-content">
              <div className="reservation-summary">
                <span className="reservation-name">
                  {res.firstName} {res.lastName}
                </span>{' '}
                ({res.numberOfGuests}p) - {res.time}
              </div>
              <div className="reservation-notes">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={res.notes}
                  onChange={(e) => updateNotes(res.id, e.target.value)}
                  aria-label={`Add a note for reservation of ${res.firstName} ${res.lastName}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="table-plan-component chairs top-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.slice(0, Math.floor(capacity / 2)).map((chair, index) => (
          <div key={`top-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
      <div
        className={`table ${isOccupied ? 'table-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
          height: `${tableHeight}px`,
        }}
      >
        {/* Display Reservations Assigned to This Table */}
        {reservations.map((res) => (
          <Reservation
            key={res.id}
            reservation={res}
            tableId={tableId}
            removeReservation={removeReservation}
          />
        ))}
        {/* Table Name */}
        <div className="table-number">{tableName}</div>
      </div>
      <div
        className="table-plan-component chairs bottom-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.slice(0, Math.ceil(capacity / 2)).map((chair, index) => (
          <div key={`bottom-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
    </div>
  );
};

// Reservation Component
const Reservation = ({ reservation, tableId, removeReservation }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'GUEST',
      item: { id: reservation.id, ...reservation },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [reservation]
  );

  return (
    <div
      className="reservation"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <span className="reservation-name">
        {reservation.firstName} {reservation.lastName}
      </span>{' '}
      ({reservation.numberOfGuests}p) - {reservation.time}
    </div>
  );
};

export default Table;
