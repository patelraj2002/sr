// src/app/utils/amenities.js
export const amenitiesIcons = {
  wifi: {
    label: 'Free Wifi',
    icon: '📶'
  },
  nonveg_food: {
    label: 'Non-veg Food',
    icon: '🍖'
  },
  nonveg_cooking: {
    label: 'Non-veg Food Cooking',
    icon: '🍳'
  },
  smoking: {
    label: 'Smoking',
    icon: '🚬'
  },
  late_night: {
    label: 'Late Night Coming And Going',
    icon: '🌙'
  },
  lift: {
    label: 'Lift Facility',
    icon: '🛗'
  },
  car_parking: {
    label: 'Car Parking',
    icon: '🚗'
  },
  electricity_24x7: {
    label: '24*7 Electricity',
    icon: '⚡'
  },
  laundry: {
    label: 'Laundry',
    icon: '🧺'
  },
  cooking: {
    label: 'Cooking',
    icon: '👨‍🍳'
  },
  ac: {
    label: 'Air Conditioner',
    icon: '❄️'
  },
  water_24x7: {
    label: '24*7 Water',
    icon: '💧'
  },
  electricity_included: {
    label: 'Electricity Included in rent',
    icon: '💡'
  },
  fridge: {
    label: 'Fridge',
    icon: '🧊'
  },
  tv: {
    label: 'T.V.',
    icon: '📺'
  },
  geyser: {
    label: 'Gyser',
    icon: '🚿'
  },
  police_verification: {
    label: 'Police Verification',
    icon: '👮'
  },
  cctv: {
    label: 'CCTV',
    icon: '📹'
  },
  fire_safety: {
    label: 'Fire Safety',
    icon: '🧯'
  },
  two_wheeler: {
    label: 'Two Wheeler Parking',
    icon: '🛵'
  },
  electricity_ac_excluded: {
    label: 'Electricity Bill Included (Excluding A/C)',
    icon: '💰'
  },
  electricity_ac_included: {
    label: 'Electricity Bill Included (Including A/C)',
    icon: '💵'
  },
  temple: {
    label: 'Temple',
    icon: '🕉️'
  },
  balcony: {
    label: 'Seating Balcony',
    icon: '🏠'
  },
  indoor_games: {
    label: 'Indoor Games',
    icon: '🎮'
  },
  outdoor_games: {
    label: 'Outdoor games',
    icon: '⚽'
  },
  gym: {
    label: 'Gym',
    icon: '💪'
  },
  yoga: {
    label: 'Yoga',
    icon: '🧘'
  },
  shop: {
    label: 'Shop',
    icon: '🏪'
  },
  ro_water: {
    label: 'RO water',
    icon: '🚰'
  },
  library: {
    label: 'Library',
    icon: '📚'
  },
  washing_machine: {
    label: 'Washing Machine',
    icon: '🧺'
  },
  laundry_ironing: {
    label: 'Laundry And Ironing',
    icon: '👕'
  }
};

// Re-export as amenitiesData for backward compatibility
export const amenitiesData = amenitiesIcons;

// Helper function to get all amenities as an array
export const getAmenitiesArray = () => {
  return Object.entries(amenitiesIcons).map(([key, value]) => ({
    id: key,
    ...value
  }));
};

// Helper function to get amenity by ID
export const getAmenityById = (id) => {
  return amenitiesIcons[id] || null;
};
