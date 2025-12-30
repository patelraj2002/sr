// src/app/contexts/GoogleMapsContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GoogleMapsContext = createContext({
  isLoaded: false,
  setIsLoaded: () => {},
});

export function GoogleMapsProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export const useGoogleMaps = () => useContext(GoogleMapsContext);