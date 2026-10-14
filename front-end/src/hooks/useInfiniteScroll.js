import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to trigger a callback when an element scrolls into view.
 * Attach the returned `observerRef` to the target anchor element.
 * @param {Function} onLoadMore - The callback function to execute
 * @param {boolean} hasMore - If true, the observer stays active
 * @param {boolean} isFetching - If true, prevents triggering loader again
 * @returns {Object} observerRef to attach to the UI element
 */
export function useInfiniteScroll(onLoadMore, hasMore, isFetching) {
  const observerRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isFetching) {
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  return observerRef;
}
