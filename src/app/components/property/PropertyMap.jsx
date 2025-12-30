// src/app/components/property/PropertyMap.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function PropertyMap({ latitude, longitude, address }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const handleGetDirections = () => {
    // For mobile devices, open in Google Maps app
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
    } else {
      // For desktop, open in new tab with the address
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
    }
  };

  useEffect(() => {
    if (window.google && latitude && longitude) {
      const location = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        position: location,
        title: address,
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <p class="font-semibold">${address}</p>
          </div>
        `
      });

      markerInstance.addListener('click', () => {
        infoWindow.open(mapInstance, markerInstance);
      });

      infoWindow.open(mapInstance, markerInstance);

      setMap(mapInstance);
      setMarker(markerInstance);

      return () => {
        if (markerInstance) {
          markerInstance.setMap(null);
        }
        if (infoWindow) {
          infoWindow.close();
        }
      };
    }
  }, [latitude, longitude, address]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      />
      <button
        onClick={handleGetDirections}
        className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-md shadow-md
          hover:shadow-lg transition-all duration-300 flex items-center space-x-2
          text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <span>Get Directions</span>
      </button>
    </div>
  );
}