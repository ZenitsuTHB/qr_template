// Sidebar.js
import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import Table from './Table.js';
import Walls from './Walls.js';
import './css/sidebar.css';

const TableItem = ({ table }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      elementType: 'table',
      subtype: 'round',
      width: 70,
      height: 70,
      capacity: table.numberOfGuests,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [table]);

  return (
    <div className="table-plan-component item" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Pass showActions={false} to hide action buttons in Sidebar */}
      <Table numberOfGuests={table.numberOfGuests} showActions={false} />
      <div className="table-plan-component item-info">
        <p>Tafel {table.id}</p>
        <p>Gasten: {table.numberOfGuests}</p>
      </div>
    </div>
  );
};

const WallItem = ({ wall }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      elementType: 'wall',
      subtype: 'wall',
      width: wall.length * 20,
      height: 20,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [wall]);

  return (
    <div className="table-plan-component item" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Walls length={wall.length} />
      <div className="table-plan-component item-info">
        <p>Muur {wall.id}</p>
        <p>Lengte: {wall.length} eenheden</p>
      </div>
    </div>
  );
};

const Sidebar = ({ tables, walls }) => {
  const [activeTab, setActiveTab] = useState('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTab, setPendingTab] = useState(null);

  const tablesRef = useRef();
  const wallsRef = useRef();

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const tabs = [
    { id: 'tables', label: 'Tafels', title: "Beheer Tafels" },
    { id: 'walls', label: 'Muren', title: "Beheer Muren" },
  ];

  const filteredTables = tables.filter(
    (table) =>
      table.id.toString().includes(searchTerm) ||
      table.numberOfGuests.toString().includes(searchTerm)
  );

  const filteredWalls = walls.filter(
    (wall) =>
      wall.id.toString().includes(searchTerm) ||
      wall.length.toString().includes(searchTerm)
  );

  const handleTabClick = async (tabId, tabTitle) => {
    let currentRef;
    if (activeTab === 'tables') {
      currentRef = tablesRef;
    } else if (activeTab === 'walls') {
      currentRef = wallsRef;
    }

    if (currentRef && currentRef.current && currentRef.current.isDirty) {
      if (isIframe) {
        try {
          await currentRef.current.handleSave();
          setActiveTab(tabId);
        } catch (error) {
          console.error('Error saving before tab switch:', error);
        }
      } else {
        setPendingTab({ id: tabId, title: tabTitle });
      }
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="table-plan-component sidebar">
      <div className="table-plan-component tabs">
        <div className="table-plan-component buttons-container">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              type="button"
              className={`table-plan-component tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id, tab.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="table-plan-component tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline-sidebar-tabs"
                  className="table-plan-component tab-underline"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="table-plan-component search-bar">
        <input
          type="text"
          placeholder={`Zoek ${activeTab === 'tables' ? 'Tafels' : 'Muren'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={`Zoek ${activeTab === 'tables' ? 'Tafels' : 'Muren'}`}
        />
      </div>
      <div className="table-plan-component items-list">
        {activeTab === 'tables' && filteredTables.length > 0 ? (
          <div className="table-plan-component grid-container">
            {filteredTables.map((table) => (
              <TableItem key={table.id} table={table} />
            ))}
          </div>
        ) : activeTab === 'walls' && filteredWalls.length > 0 ? (
          <div className="table-plan-component grid-container">
            {filteredWalls.map((wall) => (
              <WallItem key={wall.id} wall={wall} />
            ))}
          </div>
        ) : (
          <p className="table-plan-component no-results">Geen {activeTab === 'tables' ? 'tafels' : 'muren'} gevonden.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
