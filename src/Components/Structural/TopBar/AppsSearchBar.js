// AppsSearchBar.js
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './css/appsSearchBar.css';

const AppsSearchBar = ({ searchTerm, setSearchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, setSearchTerm]);

  return (
    <div className="apps-search-bar">
      <FaSearch className="apps-search-icon" />
      <input
        type="text"
        className="apps-search-input"
        placeholder="Zoeken"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        aria-label="Zoeken"
      />
    </div>
  );
};

export default AppsSearchBar;
