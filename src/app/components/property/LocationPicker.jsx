// src/app/components/property/LocationPicker.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function LocationPicker({ onLocationSelect, initialLocation = null }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.google && !map) {
      initializeMap();
    }
  }, [map]);

  const initializeMap = () => {
    // Default center (Ahmedabad)
    const defaultCenter = { 
      lat: 23.0225, 
      lng: 72.5714 
    };

    // Create map instance
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialLocation ? 
        { lat: initialLocation.latitude, lng: initialLocation.longitude } : 
        defaultCenter,
      zoom: initialLocation ? 15 : 12,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Add Current Location button
    const locationButton = document.createElement("button");
    locationButton.textContent = "📍 Use My Location";
    locationButton.className = "bg-primary-500 text-white px-4 py-2 rounded-md shadow hover:bg-primary-600 transition-colors m-2 flex items-center";
    
    // Add loading spinner
    const loadingSpinner = document.createElement("span");
    loadingSpinner.className = "hidden animate-spin ml-2";
    loadingSpinner.textContent = "⌛";
    locationButton.appendChild(loadingSpinner);

    mapInstance.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(locationButton);

    locationButton.addEventListener("click", () => {
      getCurrentLocation(mapInstance, loadingSpinner, locationButton);
    });

    // Handle map clicks
    mapInstance.addListener('click', (e) => {
      updateMarker(mapInstance, e.latLng);
    });

    setMap(mapInstance);

    // If initial location exists, set marker
    if (initialLocation) {
      const position = new window.google.maps.LatLng(
        initialLocation.latitude,
        initialLocation.longitude
      );
      updateMarker(mapInstance, position, initialLocation.address);
    }
  };

  const getCurrentLocation = (mapInstance, loadingSpinner, locationButton) => {
    if (navigator.geolocation) {
      setLoading(true);
      loadingSpinner.classList.remove('hidden');
      locationButton.disabled = true;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Create a geocoder instance
          const geocoder = new window.google.maps.Geocoder();

          try {
            // Get address for the location
            const result = await geocoder.geocode({ location: pos });
            if (result.results[0]) {
              mapInstance.setCenter(pos);
              mapInstance.setZoom(17);
              
              // Update marker with formatted address
              await updateMarker(
                mapInstance, 
                new google.maps.LatLng(pos.lat, pos.lng),
                result.results[0].formatted_address
              );
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            alert('Failed to get address for your location');
          }

          setLoading(false);
          loadingSpinner.classList.add('hidden');
          locationButton.disabled = false;
        },
        (error) => {
          setLoading(false);
          loadingSpinner.classList.add('hidden');
          locationButton.disabled = false;
          
          let errorMessage = 'Error: Unable to fetch your location.';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please allow location access to use this feature.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const updateMarker = async (mapInstance, position, address = null) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      map: mapInstance,
      position: position,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Get address if not provided
    if (!address) {
      const geocoder = new window.google.maps.Geocoder();
      try {
        const result = await geocoder.geocode({ location: position });
        if (result.results[0]) {
          address = result.results[0].formatted_address;
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    }

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <p class="font-semibold">${address || 'Selected location'}</p>
        </div>
      `
    });

    // Show info window on marker click
    newMarker.addListener('click', () => {
      infoWindow.open(mapInstance, newMarker);
    });

    // Update state and parent component
    const location = {
      address: address || 'Location selected',
      latitude: position.lat(),
      longitude: position.lng()
    };

    setSelectedLocation(location);
    onLocationSelect(location);
    setMarker(newMarker);

    // Handle marker drag
    newMarker.addListener('dragend', async () => {
      const newPosition = newMarker.getPosition();
      const geocoder = new window.google.maps.Geocoder();
      
      try {
        const result = await geocoder.geocode({ location: newPosition });
        const newLocation = {
          address: result.results[0]?.formatted_address || 'Location selected',
          latitude: newPosition.lat(),
          longitude: newPosition.lng()
        };
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);

        // Update info window content
        infoWindow.setContent(`
          <div class="p-2">
            <p class="font-semibold">${newLocation.address}</p>
          </div>
        `);
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    });

    // Show info window initially
    infoWindow.open(mapInstance, newMarker);
  };

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg shadow-md"
      />
      {selectedLocation && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Selected Location:</h4>
          <p className="text-sm text-gray-600">{selectedLocation.address}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
            <p>Latitude: {selectedLocation.latitude.toFixed(6)}</p>
            <p>Longitude: {selectedLocation.longitude.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
}