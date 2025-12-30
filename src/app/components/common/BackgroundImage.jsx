'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

export default function BackgroundImage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-0 bg-gray-900 animate-pulse" />
      )}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/background.jpg"
          alt="Background"
          fill
          priority
          className={`object-cover object-center transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          quality={85}
          sizes="100vw"
          onLoad={handleImageLoad}
          loading="eager"
        />
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}