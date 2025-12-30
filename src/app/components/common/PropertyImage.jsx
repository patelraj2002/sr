'use client';

import Image from 'next/image';
import { getRandomPlaceholder } from '@/app/utils/imageUtils';

export default function PropertyImage({ imageUrl, title, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl || getRandomPlaceholder()}
        alt={title || 'Property'}
        fill
        className="object-cover"
        onError={(e) => {
          e.currentTarget.src = getRandomPlaceholder();
        }}
      />
    </div>
  );
}