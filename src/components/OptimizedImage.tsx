import React, { useState, useEffect, ImgHTMLAttributes } from 'react';
import { getOptimizedImageUrl, generateSrcSet, imageSizes } from '../utils/imageOptimization';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  src: string;
  size?: number | 'original';
  lazyLoad?: boolean;
  fallbackSrc?: string;
  placeholderColor?: string;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  size = 'original',
  lazyLoad = true,
  fallbackSrc,
  placeholderColor = '#f3f4f6',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  alt = '',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [srcSet, setSrcSet] = useState<string>('');

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    
    const optimizedSrc = getOptimizedImageUrl(src, size);
    setImageSrc(optimizedSrc);
    
    const srcSetValue = generateSrcSet(src);
    setSrcSet(srcSetValue);
  }, [src, size]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: !isLoaded ? placeholderColor : 'transparent',
        transition: 'background-color 0.3s ease'
      }}
    >
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg 
            className="animate-pulse text-gray-300" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24"
          >
            <path d="M19.999 4h-16c-1.103 0-2 0.897-2 2v12c0 1.103 0.897 2 2 2h16c1.103 0 2-0.897 2-2v-12c0-1.103-0.897-2-2-2zm-13.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm12.5 10h-14l3.5-4.5 2.5 3 3.5-4.5 4.5 6z" />
          </svg>
        </div>
      )}
      
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={lazyLoad ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
