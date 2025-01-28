// AppsMenu.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/appsMenu.css';
import AppsSearchBar from './AppsSearchBar';
import icon1 from '../../../Assets/logos/1.webp';
import icon2 from '../../../Assets/logos/2.webp';
import icon3 from '../../../Assets/logos/3.webp';
import icon4 from '../../../Assets/logos/4.webp';
import icon5 from '../../../Assets/logos/5.webp';
import icon6 from '../../../Assets/logos/6.webp';

const apps = [
  { name: 'Gasten', link: '', icon: icon1 },
  { name: 'Tafels', link: 'https://mateza.be/menu', icon: icon2 },
  { name: 'Email', link: 'https://mateza.be/tables', icon: icon3 },
  { name: 'Statistieken', link: 'https://mateza.be/websites', icon: icon4 },
  { name: 'Cadeaubonnen', link: 'https://mateza.be/predict', icon: icon5 },
  { name: 'Instellingen', link: 'https://mateza.be/supply', icon: icon6 },
];

const enabledApps = ['Gasten', 'Tafels', 'Email', 'Statistieken', 'Cadeaubonnen', 'Instellingen'];

const AppsMenu = ({ onMouseEnter, onMouseLeave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightMatch = (name) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onMouseLeave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onMouseLeave]);

  // Define animation variants for the container
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: '-20px',
    },
    visible: {
      opacity: 1,
      y: '0',
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: '-20px',
      transition: {
        duration: 0.3,
      },
    },
  };

  // Define animation variants for each app item
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: '-10px',
    },
    visible: {
      opacity: 1,
      y: '0',
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: '-10px',
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        className="apps-menu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <AppsSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <motion.div
          className="apps-flex-container"
          variants={containerVariants}
        >
          {filteredApps.map((app, index) => {
            const isEnabled = enabledApps.includes(app.name);

            return (
              <motion.a
                key={app.name} // Use app.name as key for better performance
                href={isEnabled ? app.link : '#'}
                className={`app-item ${isEnabled ? '' : 'disabled'}`}
                target={isEnabled ? '_blank' : ''}
                rel={isEnabled ? 'noopener noreferrer' : ''}
                onClick={(e) => !isEnabled && e.preventDefault()}
                aria-label={isEnabled ? `Open ${app.name}` : `${app.name} is disabled`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.img
                  src={app.icon}
                  alt={app.name}
                  className="app-icon"
                  style={{
                    filter: isEnabled ? 'none' : 'blur(2px)',
                    opacity: isEnabled ? 1 : 0.5,
                  }}
                  // Optional: Add hover animation for icons
                  whileHover={{ scale: isEnabled ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="app-name">{highlightMatch(app.name)}</span>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppsMenu;
