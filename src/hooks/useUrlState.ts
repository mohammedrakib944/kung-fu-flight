import { useCallback, useMemo } from 'react';

/**
 * A custom hook to manage state in the URL query parameters.
 * Supports strings, numbers, and boolean arrays.
 */
export function useUrlState<T extends Record<string, any>>(initialState: T) {
  const params = useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);

  const getUrlValue = useCallback((key: string, defaultValue: any) => {
    const value = params.get(key);
    if (value === null) return defaultValue;

    if (Array.isArray(defaultValue)) {
      return value === '' ? [] : value.split(',').map(v => isNaN(Number(v)) ? v : Number(v));
    }

    if (typeof defaultValue === 'number') {
      return isNaN(Number(value)) ? defaultValue : Number(value);
    }

    if (typeof defaultValue === 'boolean') {
      return value === 'true';
    }

    return value;
  }, [params]);

  const urlState = useMemo(() => {
    const state: any = {};
    Object.keys(initialState).forEach(key => {
      state[key] = getUrlValue(key, initialState[key]);
    });
    return state as T;
  }, [initialState, getUrlValue]);

  const setUrlState = useCallback((newState: Partial<T>) => {
    const newParams = new URLSearchParams(window.location.search);
    
    Object.entries(newState).forEach(([key, value]) => {
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, String(value));
      }
    });

    const newRelativePathQuery = window.location.pathname + '?' + newParams.toString();
    window.history.pushState(null, '', newRelativePathQuery);
  }, []);

  return [urlState, setUrlState] as const;
}
