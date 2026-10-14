import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for data fetching with loading states and error handling.
 * @param {Function} apiFunc - The async API function to call
 * @param {Array} initialParams - Parameters to pass to the API function
 * @param {any} initialData - Default data structure before fetch completes
 * @param {boolean} fetchOnMount - Whether to immediately fetch on first render
 * @returns {Object} { data, loading, error, refetch, setData }
 */
export function useFetchData(apiFunc, initialParams = [], initialData = null, fetchOnMount = true) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use a ref to track mount status and prevent state updates on unmounted components
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refetch = useCallback(async (...params) => {
    const fetchParams = params.length ? params : initialParams;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...fetchParams);
      if (isMounted.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'An error occurred while fetching data.');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiFunc]); // We depend on the function stability, so caller should wrap apiFunc in useCallback if dynamic

  useEffect(() => {
    if (fetchOnMount) {
      refetch().catch(() => {}); // Catch handled in refetch
    }
  }, [fetchOnMount, refetch]);

  return { data, setData, loading, error, refetch };
}
