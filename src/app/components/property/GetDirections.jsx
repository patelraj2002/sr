// src/app/components/property/GetDirections.jsx
'use client';

export default function GetDirections({ latitude, longitude, address }) {
  const handleGetDirections = () => {
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`);
    }
  };

  return (
    <button
      onClick={handleGetDirections}
      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md
        hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium
        flex items-center justify-center gap-2"
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
      Get Directions
    </button>
  );
}