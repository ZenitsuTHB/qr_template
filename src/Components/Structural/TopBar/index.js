// TopBar.jsx

import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu';
import { SearchContext } from '../../../Context/SearchContext.js';
import './css/topBar.css';
import './css/mobile.css';
import './css/animations.css';
import logoImage from '../../../Assets/logos/logo.webp';
import { FaUser, FaChevronDown } from 'react-icons/fa';
import Profile from '../../../Pages/Profile'; 
import useNotification from '../../../Components/Notification';

const TopBar = () => {
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Get the restaurant name from localStorage or default to "Mijn Restaurant"
  const [restaurantName, setRestaurantName] = useState('Mijn Restaurant');

  // Use notification at the top level
  const { triggerNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const storedName = localStorage.getItem('restaurantName');
    if (storedName) {
      setRestaurantName(storedName);
    }
  }, []);

  const handleAppsMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAppsMenuOpen(true);
  };

  const handleAppsMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAppsMenuOpen(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = (e) => {
    if (e.target.classList.contains('profile-modal-overlay')) {
      setIsProfileModalOpen(false);
    }
  };

  return (
    <div className="top-bar-component">
      <NotificationComponent /> {/* Notification at the top level */}
      <div className="top-bar">
        {/* Left Side */}
        <div
          className="top-bar-left"
          onMouseEnter={handleAppsMouseEnter}
          onMouseLeave={handleAppsMouseLeave}
        >
          <div className={`nine-dots-wrapper ${isAppsMenuOpen ? 'active' : ''}`}>
            <div className="nine-dots">
              {[...Array(9)].map((_, index) => (
                <span key={index} className={`dot dot-${index + 1}`}></span>
              ))}
            </div>
          </div>
          <h3 className="top-bar-title">Mateza Booking</h3>
          <img src={logoImage} alt="Logo" className="title-image" />
        </div>

        {/* Middle Side */}
        <div className="top-bar-middle">
          {location.pathname === '/day-list' ? (
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Zoeken"
            />
          ) : (
            <SearchBar />
          )}
        </div>

        {/* Right Side */}
        <div className="top-bar-right">
          <div className="user-box" onClick={openProfileModal}>
            <FaUser className="user-icon" />
            <span className="user-name">{restaurantName || 'Mijn Restaurant'}</span>
            <FaChevronDown className="user-chevron" />
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={closeProfileModal}>
          <div className="profile-modal-content">
            <span className="profile-modal-close" onClick={() => setIsProfileModalOpen(false)}>
              &times;
            </span>
            {/* Pass triggerNotification down to Profile */}
            <Profile triggerNotification={triggerNotification} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
