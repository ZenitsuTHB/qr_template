// src/components/SearchBar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig'; // Adjust the path as needed
import './css/searchBar.css';

const SearchBar = ({ value: externalValue, onChange: externalOnChange, placeholder }) => {
  const [searchValue, setSearchValue] = useState(externalValue || '');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Update internal state when externalValue changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredRoutes([]);
      return;
    }

    const results = routesConfig.filter(route =>
      route.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredRoutes(results);
  }, [searchValue]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFilteredRoutes([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  const handleResultClick = (path) => {
    setSearchValue('');
    setFilteredRoutes([]);
    if (externalOnChange) {
      externalOnChange({ target: { value: '' } });
    }
    navigate(path);
  };

  // Function to highlight matched text
  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder || "Zoeken"}
          aria-label="Zoeken"
          value={searchValue}
          onChange={handleInputChange}
        />
      </div>
      {filteredRoutes.length > 0 && (
        <div className="search-results">
          {filteredRoutes.map((route, index) => {
            const IconComponent = route.icon; // Retrieve the icon component
            return (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleResultClick(route.path)}
              >
                {IconComponent && <IconComponent className="result-icon" />}
                <span className="result-label">
                  {getHighlightedText(route.label, searchValue)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
