
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  srcSet, 
  sizes,
  width,
  height,
  objectPosition = 'center', // Default objectPosition is 'center'
  placeholderColor = 'bg-zinc-800' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading when image is 50px away from viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setIsLoaded(true); // Stop loading spinner
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${placeholderColor} ${className}`}
      style={{ ...style }}
    >
      {(!isLoaded || !isVisible) && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-800/50">
          <Loader2 className="w-8 h-8 text-[#7FD856] animate-spin" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-10 p-4 text-center bg-zinc-800">
          <ImageOff className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs">Image unavailable</span>
        </div>
      )}

      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition }}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
