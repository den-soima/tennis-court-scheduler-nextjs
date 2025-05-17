import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      // If SSR, return initial value directly (no access to localStorage)
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);

      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Handle errors here if needed (quota exceeded, etc)
      console.error(error);
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      // localStorage update moved to useEffect for better consistency and SSR safety
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
