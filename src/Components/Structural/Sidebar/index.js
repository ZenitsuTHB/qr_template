// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { useNavigate, useLocation } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig.js';
import { FaChevronRight, FaChevronLeft, FaPencilAlt, FaCog } from 'react-icons/fa';
import './css/sidebar.css';
import './css/mobile.css';

const Sidebar = ({ onToggleExpand }) => {
  const isIframe = typeof window !== 'undefined' && window.isIframe;
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 900);
  const [collapseTimeout, setCollapseTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const colors = [
    "#48aaaf",
    "#4bb0b5",
    "#4fb5ba",
    "#53bbbf",
    "#56c0c4",
    "#5ac6c9",
    "#5ecbce",
    "#62d1d3",
    "#66d6d8",
    "#69dcdd"
  ];

  const handleItemClick = (path) => {
    setActiveTab(path);
    navigate(path);
    if (isExpanded) {
      setIsExpanded(false);
    }
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleOntwerpClick = () => {
    const username = localStorage.getItem('username');
    const ontwerpUrl = 'https://preview.reservaties.net/?restaurantId=' + username + '&admin=true';
    window.open(ontwerpUrl, '_blank');
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseEnter = () => {
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    if (isExpanded) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setCollapseTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (collapseTimeout) clearTimeout(collapseTimeout);
    };
  }, [collapseTimeout]);

  useEffect(() => {
    const adjustPadding = () => {
      const elements = document.querySelectorAll('.withHeader');
      elements.forEach((el) => {
        el.style.paddingLeft = isExpanded ? '200px' : '60px';
      });
    };

    const timeoutId = setTimeout(adjustPadding, 0);
    return () => {
      clearTimeout(timeoutId);
      document.querySelectorAll('.withHeader').forEach((el) => {
        el.style.paddingLeft = '';
      });
    };
  }, [isExpanded, activeTab, location.pathname]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const mobile = window.innerWidth < 900;
      if (mobile) {
        setIsExpanded(false);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (onToggleExpand) {
      onToggleExpand(isExpanded);
    }
  }, [isExpanded, onToggleExpand]);

  if (isIframe) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <motion.div
      className={`sidebar-component ${isExpanded ? 'expanded' : ''}`}
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {routesConfig
        .filter((route) => route.isMenu)
        .map((route, index) => (
          <React.Fragment key={route.path}>
            <SidebarItem
              item={{ id: route.path, title: route.label, icon: route.icon }}
              activeTab={activeTab}
              handleItemClick={handleItemClick}
              isExpanded={isExpanded}
              activeColor={colors[index % colors.length]}
            />
            {index === 0 && isExpanded && !isMobile && (
              <div className="sidebar-subsection-title">
                MODULES
              </div>
            )}
          </React.Fragment>
        ))}

      {isExpanded && !isMobile && (
        <div className="sidebar-subsection-title">
          ONTWERP
        </div>
      )}

      {/* Hardcoded Ontwerp item with pencil icon */}
      <SidebarItem
        item={{ id: 'ontwerp', title: 'Ontwerp', icon: FaPencilAlt }}
        activeTab={activeTab}
        handleItemClick={handleOntwerpClick}
        isExpanded={isExpanded}
        activeColor={colors[0]}
      />

      {isExpanded && !isMobile && (
        <div className="sidebar-subsection-title">
          ADMINISTRATIE
        </div>
      )}

      {/* Administratie Item that leads to /settings */}
      <SidebarItem
        item={{ id: '/settings', title: 'Administratie', icon: FaCog }}
        activeTab={activeTab}
        handleItemClick={() => handleItemClick('/settings')}
        isExpanded={isExpanded}
        activeColor={colors[0]}
      />

      <div className="sidebar-controls">
        <div className="sidebar-toggle-group">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
