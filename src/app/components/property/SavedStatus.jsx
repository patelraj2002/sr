// src/app/components/property/SavedStatus.jsx
'use client';

import { useState, useEffect } from 'react';

export function useSavedStatus({ propertyId, userId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSavedStatus() {
      if (!userId || !propertyId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${userId}/saved-properties/${propertyId}`);
        const data = await response.json();
        setIsSaved(data.isSaved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSavedStatus();
  }, [propertyId, userId]);

  return { isSaved, loading };
}