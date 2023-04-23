import { useState } from "react";

function useStorage<T>(
  storage: { getItem: Function; setItem: Function },
  key: string,
  initialValue: any,
): [T, (value: T) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local/session storage by key
      const item = storage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage/sessionStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local/session storage
      if (typeof window !== "undefined") {
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

function useSessionStorage<T>(key: string, initialValue: any): [T, (value: T) => void, string] {
  return [...useStorage<T>(window.sessionStorage, key, initialValue), key];
}

function useLocalStorage<T>(key: string, initialValue: any): [T, (value: T) => void, string] {
  return [...useStorage<T>(window.localStorage, key, initialValue), key];
}

export { useSessionStorage, useLocalStorage };
