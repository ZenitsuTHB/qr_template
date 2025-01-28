// LinesLayer.js
import React, { useRef } from 'react';
import './css/floorPlan.css'; // Ensure to import necessary styles

const LinesLayer = ({
  elements,
  lines,
  isDrawingLine,
  startTableId,
  currentMousePosition,
  handleLineClick,
}) => {
  const lineRefs = useRef({});

  const renderLines = () => {
    const renderedLines = [];

    // Render existing lines
    lines.forEach((line) => {
      const fromElement = elements.find((el) => el.id === line.from);
      const toElement = elements.find((el) => el.id === line.to);

      if (!fromElement || !toElement) return;

      const fromCenter = getElementCenter(fromElement);
      const toCenter = getElementCenter(toElement);

      // Apply translation: 10px left and 50px down
      const translatedFromX = fromCenter.x - 10;
      const translatedFromY = fromCenter.y + 50;
      const translatedToX = toCenter.x - 10;
      const translatedToY = toCenter.y + 50;

      const length = Math.hypot(translatedToX - translatedFromX, translatedToY - translatedFromY);
      const angle = Math.atan2(translatedToY - translatedFromY, translatedToX - translatedFromX) * (180 / Math.PI);

      const lineStyle = {
        position: 'absolute',
        left: `${translatedFromX}px`,
        top: `${translatedFromY}px`,
        width: `${length}px`,
        height: '2px',
        backgroundColor: '#d2b48c', // Same as table border color
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        pointerEvents: 'auto',
        cursor: 'pointer',
        zIndex: 0,
      };

      renderedLines.push(
        <div
          key={line.id}
          className="table-plan-component line"
          style={lineStyle}
          onClick={() => handleLineClick(line.id)}
          ref={(el) => {
            lineRefs.current[line.id] = el;
          }}
        ></div>
      );
    });

    // Render the line being drawn
    if (isDrawingLine && startTableId) {
      const fromElement = elements.find((el) => el.id === startTableId);
      if (fromElement) {
        const fromCenter = getElementCenter(fromElement);

        // Apply translation: 10px left and 50px down
        const translatedFromX = fromCenter.x - 10;
        const translatedFromY = fromCenter.y + 50;

        const toX = currentMousePosition.x - 10;
        const toY = currentMousePosition.y + 50;

        const length = Math.hypot(toX - translatedFromX, toY - translatedFromY);
        const angle = Math.atan2(toY - translatedFromY, toX - translatedFromX) * (180 / Math.PI);

        const lineStyle = {
          position: 'absolute',
          left: `${translatedFromX}px`,
          top: `${translatedFromY}px`,
          width: `${length}px`,
          height: '2px',
          backgroundColor: '#d2b48c',
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
          zIndex: 0,
        };

        renderedLines.push(
          <div key="drawing-line" className="table-plan-component line" style={lineStyle}></div>
        );
      }
    }

    return renderedLines;
  };

  const getElementCenter = (element) => {
    const { x, y, width, height, rotation } = element;

    // Calculate center based on current position and size
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return { x: centerX, y: centerY };
  };

  return <>{renderLines()}</>;
};

export default LinesLayer;
