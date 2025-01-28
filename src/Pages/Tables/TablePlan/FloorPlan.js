// FloorPlan.js
import React, { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import FloorPlanElement from './FloorPlanElement.js';
import useApi from '../../../Hooks/useApi.js'; // Ensure correct path

const FloorPlanGeneral = ({
  reservations,
  assignReservation,
  removeReservation,
  updateNotes,
}) => {
  const floorPlanRef = useRef(null);
  const [floorPlanSize, setFloorPlanSize] = useState({ width: 800, height: 600 });
  const [tables, setTables] = useState([]);

  const api = useApi(); // Initialize useApi hook

  // Update floor plan size on mount and when resized
  useEffect(() => {
    const updateSize = () => {
      if (floorPlanRef.current) {
        const { width, height } = floorPlanRef.current.getBoundingClientRect();
        setFloorPlanSize({ width, height });
      }
    };

    // Initial size
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Load tables from API on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        console.log("Floorplan GET");
        const data = await api.get(window.baseDomain + 'api/tables', { noCache: true });
        // Ensure that data is an array
        if (Array.isArray(data)) {
          setTables(data);
        } else if (data && Array.isArray(data.tables)) {
          // If API returns { tables: [...] }
          setTables(data.tables);
        } else {
          setTables([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        setTables([]); // Fallback to empty array on error
      }
    };

    fetchTables();
  }, [api]);

  const [, drop] = useDrop({
    accept: 'GUEST',
    drop: (item, monitor) => {
      // Dropping on the floor plan background does nothing
      // You might want to implement additional functionality here if needed
    },
  });

  return (
    <ResizableBox
      width={800}
      height={600}
      minConstraints={[400, 300]}
      maxConstraints={[1600, 1200]}
      className="resizable-floor-plan"
      onResizeStop={(e, data) => {
        // Directly set the new size without snapping
        setFloorPlanSize({ width: data.size.width, height: data.size.height });
      }}
      resizeHandles={['se']} // Optional: specify resize handles if needed
    >
      <div
        id="floor-plan-container"
        className="floor-plan"
        ref={(node) => {
          drop(node);
          floorPlanRef.current = node;
        }}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        {tables.map((table) => (
          <FloorPlanElement
            key={table.id}
            table={table}
            reservations={reservations.filter((res) => res.tableId === table.id)}
            assignReservation={assignReservation}
            removeReservation={removeReservation}
            updateNotes={updateNotes}
            floorPlanSize={floorPlanSize}
          />
        ))}
      </div>
    </ResizableBox>
  );
};

export default FloorPlanGeneral;
