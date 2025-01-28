// Sidebar.js
import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import './css/sidebar.css';

const Sidebar = ({ reservations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reservations based on search term and only show unassigned
  const filteredReservations = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return reservations.filter(
      (guest) =>
        guest.tableId === null &&
        (guest.firstName.toLowerCase().includes(lowerSearch) ||
          guest.lastName.toLowerCase().includes(lowerSearch) ||
          guest.numberOfGuests.toString().includes(lowerSearch) ||
          guest.time.includes(lowerSearch))
    );
  }, [searchTerm, reservations]);

  // Guest Block Component
  const GuestBlock = ({ guest }) => {
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: 'GUEST',
        item: { id: guest.id, ...guest },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }),
      [guest]
    );

    return (
      <div
        className="guest-block"
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <p className="guest-name">
          {guest.firstName} {guest.lastName}
        </p>
        <p className="guest-details">
          {guest.numberOfGuests}p • {guest.time}
        </p>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Zoek gasten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Zoek gasten"
        />
      </div>
      <div className="guests-list">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((guest) => (
            <GuestBlock key={guest.id} guest={guest} />
          ))
        ) : (
          <p className="no-results">Geen gasten gevonden.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
