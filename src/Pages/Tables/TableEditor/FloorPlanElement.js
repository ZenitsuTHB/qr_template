// FloorPlanElement.js
import React from 'react';
import Table from './Table.js';
import Walls from './Walls.js';

const FloorPlanElement = ({
  element,
  moveElement,
  rotateElement,
  duplicateElement,
  deleteElement,
  floorPlanSize,
  tableNumber,
  openModal,
  handleTableMouseDown,
  handleTableMouseUp,
  isAltPressed,
}) => {
  const [position, setPosition] = React.useState({ x: element.x, y: element.y });
  const [isDragging, setIsDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setPosition({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  const handleMouseDown = (e) => {
    if (isAltPressed) {
      handleTableMouseDown(element.id, e);
      return;
    }
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseUp = (e) => {
    if (isAltPressed) {
      handleTableMouseUp(element.id, e);
      return;
    }
    // Do nothing
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Constrain within floor plan boundaries
        newX = Math.max(0, Math.min(newX, floorPlanSize.width - element.width));
        newY = Math.max(0, Math.min(newY, floorPlanSize.height - element.height));

        setPosition({
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);

        // Apply snapping on mouse release for non-wall elements
        if (element.type !== 'wall') {
          const snappedX = Math.round(position.x / 50) * 50; // Assuming grid size 50
          const snappedY = Math.round(position.y / 50) * 50;
          const finalX = Math.max(0, Math.min(snappedX, floorPlanSize.width - element.width));
          const finalY = Math.max(0, Math.min(snappedY, floorPlanSize.height - element.height));

          setPosition({ x: finalX, y: finalY });
          moveElement(element.id, finalX, finalY);
        } else {
          // For walls, no snapping
          moveElement(element.id, position.x, position.y);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging,
    offset,
    position.x,
    position.y,
    moveElement,
    element.id,
    floorPlanSize,
    element.width,
    element.height,
    element.type,
  ]);

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    transition: isDragging ? 'none' : 'left 0.2s, top 0.2s',
    zIndex: isDragging ? 1000 : 'auto', // Bring to front when dragging
  };

  // Hide action buttons when Alt is pressed
  const showActions = !isAltPressed;

  return (
    <div
      className="table-plan-component floor-plan-element"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={style}
    >
      {/* Rotated Content */}
      <div
        style={{
          transform: `rotate(${element.rotation || 0}deg)`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {element.type === 'table' ? (
          <Table
            numberOfGuests={element.capacity}
            tableNumber={tableNumber}
            rotate={() => rotateElement(element.id)}
            duplicate={() => duplicateElement(element.id)}
            deleteTable={() => deleteElement(element.id)}
            editTable={() => openModal(element)}
            showActions={showActions}
            rotation={element.rotation || 0} // Pass rotation to Table
            id={`table-${element.id}`} // Pass id to Table component
          />
        ) : element.type === 'wall' ? (
          <Walls length={element.width / 20 + 1} />
        ) : null}
      </div>
      {/* Action Buttons are handled within Table component */}
    </div>
  );
};

export default FloorPlanElement;
