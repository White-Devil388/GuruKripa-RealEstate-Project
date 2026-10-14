import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook to cleanly paginate arrays locally.
 * Can be extended to trigger backend offsets.
 * @param {Array} data - The array to be paginated
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} paginated items, page utilities
 */
export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const nextPage = useCallback(() => {
    setCurrentPage((curr) => Math.min(curr + 1, maxPage));
  }, [maxPage]);

  const prevPage = useCallback(() => {
    setCurrentPage((curr) => Math.max(curr - 1, 1));
  }, []);

  const jumpToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(pageNumber);
  }, [maxPage]);

  // Ensure current page doesn't exceed bounds if filtered data suddenly shrinks
  useMemo(() => {
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (currentPage === 0 && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, maxPage]);

  return {
    paginatedData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    jumpToPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === maxPage || maxPage === 0,
    totalItems: data.length
  };
}
