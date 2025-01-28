// SearchBar.js

import React from 'react';

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
