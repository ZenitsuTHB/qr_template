// SearchBar.js

import React from 'react';
import './css/searchBar.css'

const SearchBar = ({ value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default SearchBar;
