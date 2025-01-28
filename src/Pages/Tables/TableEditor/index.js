// index.js
import React from 'react';
import FloorPlan from './FloorPlan.js';
import Sidebar from './Sidebar.js';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './css/app.css';

const TableEditor = () => {
  const tables = [
    { id: 1, numberOfGuests: 1 },
    { id: 2, numberOfGuests: 2 },
    { id: 3, numberOfGuests: 3 },
    { id: 4, numberOfGuests: 4 },
    { id: 5, numberOfGuests: 5 },
    { id: 6, numberOfGuests: 6 },
    { id: 7, numberOfGuests: 7 },
    { id: 8, numberOfGuests: 8 },
  ];

  const walls = [
    { id: 1, length: 3 },
    { id: 2, length: 5 },
    { id: 3, length: 2 },
    { id: 4, length: 4 },
    { id: 5, length: 6 },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-plan-component">
        <div className="app-container">
          <FloorPlan />
          <Sidebar tables={tables} walls={walls} />
        </div>
      </div>
    </DndProvider>
  );
};

export default withHeader(TableEditor);
