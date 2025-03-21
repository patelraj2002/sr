// src/app/components/property/PropertyMap.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function PropertyMap({ latitude, longitude, address }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
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
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    />
  );
}