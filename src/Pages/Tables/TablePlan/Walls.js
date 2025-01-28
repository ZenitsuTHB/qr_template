// Walls.js
import React from 'react';
import './css/walls.css';

const Walls = ({ length }) => {
  const wallWidth = (length - 1) * 20;
  const wallHeight = 20;

  return (
    <div
      className="walls-container"
      style={{ width: `${wallWidth}px`, height: `${wallHeight}px` }}
    >
      <div className="wall"></div>
    </div>
  );
};

export default Walls;
