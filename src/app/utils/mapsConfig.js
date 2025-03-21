// src/app/utils/mapsConfig.js
export const defaultMapConfig = {
    mapOptions: {
      disableDefaultUI: true,
      zoomControl: true,
      scrollwheel: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    },
    libraries: ['places'],
    defaultCenter: {
      lat: 23.0225, // Ahmedabad
      lng: 72.5714
    },
    defaultZoom: 13
  };
  
  export const autocompleteOptions = {
    componentRestrictions: { country: 'IN' },
    types: ['geocode', 'establishment'],
    fields: ['address_components', 'geometry', 'formatted_address', 'place_id']
  };