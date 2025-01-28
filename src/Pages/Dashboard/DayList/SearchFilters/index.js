// SearchFilters.js

import React from 'react';
import SearchBar from './SearchBar';

const SearchFilters = ({
  nameSearch,
  setNameSearch,
  guestsSearch,
  setGuestsSearch,
  timeSearch,
  setTimeSearch,
}) => {
  return (
    <div className="search-bars-container">
      <SearchBar
        placeholder="Zoeken op naam"
        value={nameSearch}
        onChange={(e) => setNameSearch(e.target.value)}
        className="search-bar"
      />
      <SearchBar
        placeholder="Zoeken op gasten..."
        value={guestsSearch}
        onChange={(e) => setGuestsSearch(e.target.value)}
        className="search-bar"
      />
      <SearchBar
        placeholder="Zoeken op uur"
        value={timeSearch}
        onChange={(e) => setTimeSearch(e.target.value)}
        className="search-bar"
      />
    </div>
  );
};

export default SearchFilters;
