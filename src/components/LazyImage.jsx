
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  srcSet, 
  sizes,
  width,
  height,
  objectPosition = 'center',
  objectFit = 'cover',
  placeholderColor = 'bg-zinc-800',
  loading = 'lazy',
  fetchPriority = 'auto',
}) => {
  const FALLBACK_IMAGE = '/images/hero-carousel-2.png';
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(loading === 'eager');
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setResolvedSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (loading === 'eager') {
      setIsVisible(true);
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

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

    const observedNode = containerRef.current;
    if (observedNode) {
      observer.observe(observedNode);
    }

    return () => {
      if (observedNode) {
        observer.unobserve(observedNode);
      }
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };
  const handleError = () => {
    // Seamlessly recover by switching to a stable local fallback image.
    if (resolvedSrc !== FALLBACK_IMAGE) {
      setResolvedSrc(FALLBACK_IMAGE);
      setHasError(false);
      setIsLoaded(false);
      return;
    }
    setIsLoaded(true);
    setHasError(true);
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
      
      {hasError && <div className="absolute inset-0 z-10 bg-zinc-800" />}

      {isVisible && (
        <img
          ref={imgRef}
          src={resolvedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition, objectFit }}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
