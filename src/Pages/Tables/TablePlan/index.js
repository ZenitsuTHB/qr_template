import React, { useState, useEffect } from 'react';
import FloorPlanGeneral from './FloorPlan.js';
import Sidebar from './Sidebar.js';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useReservations from './Hooks/useReservations.js';
import './css/app.css';
import TableSlots from './TableSlots.js';

const TablePlan = () => {
  const fetchedReservations = useReservations();

  const [reservations, setReservations] = useState([]);
  const [floorPlanWidth, setFloorPlanWidth] = useState(800);

  useEffect(() => {
    if (fetchedReservations.length > 0 && reservations.length === 0) {
      setReservations(fetchedReservations);
    }
  }, [fetchedReservations, reservations]);

  const assignReservation = (reservationId, targetTableId) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: targetTableId } : res
      )
    );
  };

  const removeReservation = (reservationId) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: null } : res
      )
    );
  };

  const updateNotes = (reservationId, newNotes) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, notes: newNotes } : res
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-display-component">
        <TableSlots
          selectedSlot={null}
          onSelectSlot={null}
          currentDate={new Date()}
          floorPlanWidth={floorPlanWidth} // Pass floor plan width
        />
        <div className="app-container">
          <FloorPlanGeneral
            reservations={reservations}
            assignReservation={assignReservation}
            removeReservation={removeReservation}
            updateNotes={updateNotes}
          />
          <Sidebar reservations={reservations} />
        </div>
      </div>
    </DndProvider>
  );
};

export default withHeader(TablePlan);
