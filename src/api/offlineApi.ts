import { isOnline } from '../registerServiceWorker';

interface CachedResponse<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const DEFAULT_CACHE_EXPIRY = 60 * 60 * 1000;

const CACHE_PREFIX = 'wolfpack_api_cache_';

const getCacheKey = (endpoint: string, params?: Record<string, any>): string => {
  const paramsString = params ? `_${JSON.stringify(params)}` : '';
  return `${CACHE_PREFIX}${endpoint}${paramsString}`;
};

const saveToCache = <T>(
  endpoint: string,
  data: T,
  params?: Record<string, any>,
  expiry: number = DEFAULT_CACHE_EXPIRY
): void => {
  const cacheKey = getCacheKey(endpoint, params);
  const cacheData: CachedResponse<T> = {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + expiry,
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

const getFromCache = <T>(endpoint: string, params?: Record<string, any>): T | null => {
  const cacheKey = getCacheKey(endpoint, params);
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }
    
    const parsedData = JSON.parse(cachedData) as CachedResponse<T>;
    
    if (parsedData.expiry < Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return parsedData.data;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

export const clearCache = (endpoint: string, params?: Record<string, any>): void => {
  const cacheKey = getCacheKey(endpoint, params);
  localStorage.removeItem(cacheKey);
};

export const clearAllCache = (): void => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};

export const fetchWithOfflineSupport = async <T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, any>,
  cacheExpiry: number = DEFAULT_CACHE_EXPIRY
): Promise<T> => {
  if (isOnline()) {
    try {
      const response = await fetch(endpoint, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      saveToCache<T>(endpoint, data, params, cacheExpiry);
      
      return data;
    } catch (error) {
      console.error('Network request failed:', error);
      
      const cachedData = getFromCache<T>(endpoint, params);
      
      if (cachedData) {
        console.log('Using cached data due to network error');
        return cachedData;
      }
      
      throw error;
    }
  } else {
    const cachedData = getFromCache<T>(endpoint, params);
    
    if (cachedData) {
      console.log('Using cached data while offline');
      return cachedData;
    }
    
    throw new Error('No internet connection and no cached data available');
  }
};

export const offlineApi = {
  get: <T>(url: string, params?: Record<string, any>, cacheExpiry?: number): Promise<T> => {
    return fetchWithOfflineSupport<T>(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      params,
      cacheExpiry
    );
  },
  
  post: <T>(url: string, data: any, params?: Record<string, any>): Promise<T> => {
    return fetchWithOfflineSupport<T>(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      params
    );
  },
  
  put: <T>(url: string, data: any, params?: Record<string, any>): Promise<T> => {
    return fetchWithOfflineSupport<T>(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      params
    );
  },
  
  delete: <T>(url: string, params?: Record<string, any>): Promise<T> => {
    return fetchWithOfflineSupport<T>(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      params
    );
  },
  
  clearCache,
  clearAllCache,
};
