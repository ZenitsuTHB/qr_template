// src/components/ReservationsList/Pagination.jsx

import React from 'react';
import './css/pagination.css';

const Pagination = ({
  totalPages,
  currentPage,
  handlePageClick,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <span className="page-numbers">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </button>
        ))}
      </span>
    </div>
  );
};

export default Pagination;
