// FloorPlan.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import FloorPlanElement from './FloorPlanElement.js';
import LinesLayer from './LinesLayer.js'; // New component
import TableEditModalContent from './TableEditModalContent.js'; // Ensure correct path
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard/index.js'; // Ensure correct path
import useApi from '../../../Hooks/useApi.js'; // Ensure correct path

// Import custom hooks
import useElementActions from './Hooks/useElementsActions.js';
import useLineActions from './Hooks/useLineActions.js';

const ALIGN_THRESHOLD = 15; // Threshold in pixels for alignment detection

const FloorPlan = () => {
  const [elements, setElements] = useState([]);
  const [lines, setLines] = useState([]); // State to store lines
  const floorPlanRef = useRef(null);
  const [floorPlanSize, setFloorPlanSize] = useState({ width: 800, height: 600 });
  const [nextTableNumber, setNextTableNumber] = useState(1);

  const api = useApi(); // Initialize useApi hook

  // State for modal
  const [selectedElement, setSelectedElement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for line drawing
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [startTableId, setStartTableId] = useState(null);
  const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
  const [isAltPressed, setIsAltPressed] = useState(false);

  // Use custom hooks for element and line actions
  const {
    addElement,
    updateElement,
    moveElement,
    rotateElement,
    duplicateElement,
    deleteElement,
  } = useElementActions(setElements, setLines, floorPlanSize, nextTableNumber, setNextTableNumber, api);

  const { addLine, deleteLine } = useLineActions(setLines, api);

  // Define handleMouseUp in the component's scope
  const handleMouseUp = useCallback(() => {
    if (isDrawingLine) {
      setIsDrawingLine(false);
      setStartTableId(null);
    }
  }, [isDrawingLine]);

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

  // Load tables and lines from API on mount
  useEffect(() => {
    const fetchTablesAndLines = async () => {
      try {
        console.log("TableEditor GET");
        const data = await api.get(`${window.baseDomain}api/tables`, { noCache: true });
        // Ensure that data is an array
        if (Array.isArray(data)) {
          const elementsData = data.filter((item) => item.type !== 'line');
          const linesData = data.filter((item) => item.type === 'line');
          setElements(elementsData);
          setLines(linesData);
        } else if (data && Array.isArray(data.tables)) { // If API returns { tables: [...] }
          const elementsData = data.tables.filter((item) => item.type !== 'line');
          const linesData = data.tables.filter((item) => item.type === 'line');
          setElements(elementsData);
          setLines(linesData);
        } else {
          setElements([]); // Fallback to empty array
          setLines([]);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        setElements([]); // Fallback to empty array on error
        setLines([]);
      }
    };

    fetchTablesAndLines();
  }, [api]);

  // Handle keydown and keyup events for Alt key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
        setIsDrawingLine(false);
        setStartTableId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse move when drawing line
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDrawingLine) {
        const floorPlanRect = floorPlanRef.current.getBoundingClientRect();
        setCurrentMousePosition({
          x: e.clientX - floorPlanRect.left,
          y: e.clientY - floorPlanRect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDrawingLine]);

  // Attach the global handleMouseUp
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const snapToGrid = (x, y, gridSize = 50) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return [snappedX, snappedY];
  };

  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = floorPlanRef.current.getBoundingClientRect();

      let x = offset.x - floorPlanRect.left;
      let y = offset.y - floorPlanRect.top;

      // Apply snapping only if the element is not a wall
      if (item.elementType !== 'wall') {
        const [snappedX, snappedY] = snapToGrid(x, y);
        x = Math.max(0, Math.min(snappedX, floorPlanSize.width - item.width));
        y = Math.max(0, Math.min(snappedY, floorPlanSize.height - item.height));
      } else {
        // For walls, ensure they stay within boundaries without snapping
        x = Math.max(0, Math.min(x, floorPlanSize.width - item.width));
        y = Math.max(0, Math.min(y, floorPlanSize.height - item.height));
      }

      if (item.id) {
        moveElement(item.id, x, y);
      } else {
        const id = Date.now();
        const newElement = {
          id,
          type: item.elementType,
          subtype: item.subtype,
          x,
          y,
          width: item.width,
          height: item.height,
          capacity: item.capacity,
          name:
            item.elementType === 'table'
              ? `T${nextTableNumber}`
              : `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Decoration ${id}`,
          minCapacity: item.minCapacity || 1,
          maxCapacity: item.maxCapacity || 10,
          priority: 'Medium',
          rotation: 0, // Initialize rotation
        };

        // Assign a tableNumber if the element is a table
        if (item.elementType === 'table') {
          newElement.tableNumber = nextTableNumber;
          setNextTableNumber((prev) => prev + 1);
        }

        addElement(newElement);

        // Open modal to edit table details only if needed
        setSelectedElement(newElement);
        setShowModal(true);
      }
    },
  });

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedElement(null);
  };

  const handleModalSave = (updatedElement) => {
    // Update the element in state
    updateElement(updatedElement);
    setShowModal(false);
    setSelectedElement(null);

    // Save the element to API
    const saveElement = async () => {
      try {
        if (updatedElement.type === 'line') {
          // Lines are handled separately
          return;
        }
        if (updatedElement._id) {
          // Existing table: use PUT request
          await api.put(`${window.baseDomain}api/tables/${updatedElement._id}`, updatedElement);
        } else {
          // New table: use POST request
          await api.post(`${window.baseDomain}api/tables`, updatedElement);
        }
      } catch (error) {
        console.error('Error saving table:', error);
      }
    };

    saveElement();
  };

  const handleTableMouseDown = (tableId, e) => {
    if (!isAltPressed) return;
    e.stopPropagation();
    setIsDrawingLine(true);
    setStartTableId(tableId);

    const floorPlanRect = floorPlanRef.current.getBoundingClientRect();
    setCurrentMousePosition({
      x: e.clientX - floorPlanRect.left,
      y: e.clientY - floorPlanRect.top,
    });
  };

  const handleTableMouseUp = (tableId, e) => {
    if (isDrawingLine && startTableId && startTableId !== tableId) {
      // Create a new line
      const newLine = {
        id: `line-${Date.now()}`,
        type: 'line',
        from: startTableId,
        to: tableId,
      };
      addLine(newLine);
    }
    setIsDrawingLine(false);
    setStartTableId(null);
  };

  const handleLineClick = (lineId) => {
    // Remove the line
    deleteLine(lineId);
  };

  return (
    <>
      <ResizableBox
        width={800}
        height={600}
        minConstraints={[400, 300]}
        maxConstraints={[1600, 1200]}
        className="table-plan-component resizable-floor-plan"
        onResizeStop={(e, data) => {
          // Directly set the new size without snapping
          setFloorPlanSize({ width: data.size.width, height: data.size.height });
        }}
        resizeHandles={['se']} // Optional: specify resize handles if needed
      >
        <div
          id="floor-plan-container"
          className="table-plan-component floor-plan"
          ref={(node) => {
            drop(node);
            floorPlanRef.current = node;
          }}
          style={{ position: 'relative', width: '100%', height: '100%' }}
          onMouseUp={handleMouseUp} // Now handleMouseUp is defined
        >
          <LinesLayer
            elements={elements}
            lines={lines}
            isDrawingLine={isDrawingLine}
            startTableId={startTableId}
            currentMousePosition={currentMousePosition}
            handleLineClick={handleLineClick} // Pass handleLineClick
          />
          {Array.isArray(elements) &&
            elements.map((el) => (
              <FloorPlanElement
                key={el.id}
                element={el}
                moveElement={moveElement}
                rotateElement={rotateElement}
                duplicateElement={duplicateElement}
                deleteElement={deleteElement}
                floorPlanSize={floorPlanSize}
                tableNumber={el.tableNumber}
                openModal={(element) => {
                  setSelectedElement(element);
                  setShowModal(true);
                }}
                handleTableMouseDown={handleTableMouseDown}
                handleTableMouseUp={handleTableMouseUp}
                isAltPressed={isAltPressed}
              />
            ))}
        </div>
      </ResizableBox>
      {showModal && selectedElement && (
        <ModalWithoutTabs
          onClose={handleModalClose}
          content={
            <TableEditModalContent
              element={selectedElement}
              onSave={handleModalSave}
              onClose={handleModalClose}
            />
          }
        />
      )}
    </>
  );
};

export default FloorPlan;
