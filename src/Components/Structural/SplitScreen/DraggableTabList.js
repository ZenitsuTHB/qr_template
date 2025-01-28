import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTimes } from 'react-icons/fa';

const DraggableTabList = ({ tabs, selectedIndex, setSelectedIndex, closeTab }) => (
  <Droppable droppableId="droppable-tabs" direction="horizontal">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="react-tabs__tab-list"
      >
        {tabs.map((tab, index) => (
          <Draggable key={tab.id} draggableId={tab.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => setSelectedIndex(index)}
                className={`react-tabs__tab ${
                  selectedIndex === index ? 'react-tabs__tab--selected' : ''
                }`}
              >
                <span>{tab.label}</span>
                <FaTimes
                  className="close-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id, index);
                  }}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default DraggableTabList;
