import React, { useRef, useEffect } from 'react';
import './css/tableslots.css';

const slotToTime = (slot) => {
  const totalMinutes = (slot - 14) * 30 + 420;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getDateInDutch = (date) => {
  const day = date.getDate();
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  const month = months[date.getMonth()];
  return `${day} ${month}`;
};

const TableSlots = ({ selectedSlot, onSelectSlot, currentDate, floorPlanWidth }) => {
  const slotsContainerRef = useRef(null);
  const dateInDutch = getDateInDutch(currentDate);

  const handleSlotClick = (slot) => {
    if (onSelectSlot) {
      onSelectSlot(slot);
    }
    centerSelectedSlot(slot - 14);
  };

  const centerSelectedSlot = (slotIndex) => {
    const slotsContainer = slotsContainerRef.current;
    const slotWidth = 120.85;
    const containerWidth = slotsContainer.offsetWidth;
    const newScrollPosition = slotIndex * slotWidth - (containerWidth / 2 - slotWidth / 2);
    slotsContainer.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedSlot) {
      centerSelectedSlot(selectedSlot - 14);
    }
  }, [selectedSlot]);

  return (
    <div
      className="tableslot-timeline-container"
      ref={slotsContainerRef}
      style={{ width: `${floorPlanWidth}px` }}
    >
      <div className="tableslot-timeline" style={{ width: `${34 * 120.85}px` }}>
        {Array.from({ length: 34 }, (_, i) => i + 14).map((slot) => (
          <div
            key={slot}
            className={`tableslot-timeline-slot ${selectedSlot === slot ? 'selected' : ''}`}
            onClick={() => handleSlotClick(slot)}
          >
            <div className="tableslot-slot-content">
              <div className="tableslot-slot-subtitle">{dateInDutch}</div>
              <div className="tableslot-slot-title">{slotToTime(slot)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSlots;
