// usePagination.js

import { useMemo } from 'react';

const usePagination = (data, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, currentPage, itemsPerPage]);

  return { currentData, totalPages };
};

export default usePagination;
