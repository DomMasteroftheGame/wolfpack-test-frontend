import React, { lazy, Suspense, ComponentType } from 'react';

export const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen p-5 bg-gray-100 min-w-screen">
    <div className="flex space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
    </div>
  </div>
);

export const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100 min-w-screen">
    <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
    >
      Try again
    </button>
  </div>
);

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export const preloadComponent = (importFunc: () => Promise<any>) => {
  importFunc();
};

export const usePreloadOnHover = (importFunc: () => Promise<any>) => {
  return {
    onMouseEnter: () => preloadComponent(importFunc),
    onFocus: () => preloadComponent(importFunc)
  };
};
