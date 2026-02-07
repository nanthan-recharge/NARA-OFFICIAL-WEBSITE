import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading images with Intersection Observer
 * Optimized for mobile performance
 */
export const useImageLazyLoad = (options = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E'
  } = options;

  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [rootMargin, threshold]);

  return {
    imgRef,
    isLoaded,
    isInView,
    setIsLoaded,
    placeholder
  };
};

/**
 * Optimized Image component with lazy loading
 */
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  srcSet,
  sizes,
  ...props 
}) => {
  const { imgRef, isLoaded, isInView, setIsLoaded, placeholder } = useImageLazyLoad();

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      srcSet={isInView ? srcSet : undefined}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default useImageLazyLoad;
