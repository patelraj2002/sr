// src/app/utils/amenities.js
export const amenitiesIcons = {
  wifi: {
    label: 'WiFi',
    icon: '📶'
  },
  ac: {
    label: 'Air Conditioning',
    icon: '❄️'
  },
  parking: {
    label: 'Parking',
    icon: '🅿️'
  },
  laundry: {
    label: 'Laundry',
    icon: '🧺'
  },
  security: {
    label: '24/7 Security',
    icon: '👮'
  },
  gym: {
    label: 'Gym',
    icon: '💪'
  },
  kitchen: {
    label: 'Kitchen',
    icon: '🍳'
  },
  cleaning: {
    label: 'Cleaning Service',
    icon: '🧹'
  },
  cctv: {
    label: 'CCTV',
    icon: '📹'
  },
  power_backup: {
    label: 'Power Backup',
    icon: '🔋'
  },
  lift: {
    label: 'Lift',
    icon: '🛗'
  },
  water_supply: {
    label: '24/7 Water Supply',
    icon: '💧'
  }
};

// Re-export as amenitiesData for backward compatibility
export const amenitiesData = amenitiesIcons;