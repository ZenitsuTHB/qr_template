import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import routesConfig from '../../../Config/sidebarConfig';
import './css/secondaryTopBar.css';

const SecondaryTopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activePath, setActivePath] = useState(null);

  const findCurrentRoute = () => {
    const sortedRoutes = [...routesConfig].sort((a, b) => b.path.length - a.path.length);
    return sortedRoutes.find(route => currentPath.startsWith(route.path));
  };

  const currentRoute = findCurrentRoute();
  const secondaryTopBarConfig = currentRoute?.secondaryTopBar || [];

  useEffect(() => {
    if (secondaryTopBarConfig.length > 0) {
      const matchingTab = secondaryTopBarConfig.find(tab => currentPath === tab.path);
      if (matchingTab) {
        setActivePath(matchingTab.path); // Set active tab based on current path
      } else if (!activePath) {
        setActivePath(secondaryTopBarConfig[0].path); // Default to the first tab
        navigate(secondaryTopBarConfig[0].path);
      }
    }
  }, [secondaryTopBarConfig, activePath, navigate, currentPath]);

  if (secondaryTopBarConfig.length === 0) {
    return null;
  }

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  return (
	<div className="secondary-top-bar-component">
      <div className="secondary-top-bar">
        <div className="buttons-container">
          {secondaryTopBarConfig.map((button) => (
            <motion.button
              key={button.path}
              className={clsx('secondary-button', {
                'active': activePath === button.path,
              })}
              onClick={() => handleNavigation(button.path)}
              aria-label={button.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={button.path} className="button-link">
                {button.icon && <span className="button-icon">{button.icon}</span>}
                <span className="button-label">{button.label}</span>
                {activePath === button.path && (
                  <motion.div
                    layoutId="underline"
                    className="underline"
                    initial={false}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                  />
                )}
              </Link>
            </motion.button>
          ))}
        </div>
      </div>
	</div>
  );
};

export default SecondaryTopBar;
