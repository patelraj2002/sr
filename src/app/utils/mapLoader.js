// src/app/utils/mapLoader.js
let googleMapsPromise = null;

export const loadGoogleMaps = () => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        window.initMap = () => {
          resolve(window.google.maps);
        };
      }
    });
  }
  return googleMapsPromise;
};