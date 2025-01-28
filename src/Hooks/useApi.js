// src/Hooks/useApi.js

import { useCallback, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs'; // For query string serialization

// Cache durations
const TEN_MINUTES = 60 * 10 * 1000;
const CACHE_EXPIRY = TEN_MINUTES;
const MIN_CACHE_EXPIRY = 1000; // 15 seconds

// Singleton in-memory cache
const cache = new Map();

// Singleton pending requests map to handle deduplication
const pendingRequests = new Map();

// Request queue for throttling
const requestQueue = [];
let isProcessing = false;

// Utility function to serialize query parameters
const serializeParams = (params) => qs.stringify(params, { arrayFormat: 'brackets' });

// Function to generate a unique cache key based on endpoint and params
const generateCacheKey = (endpoint, config) => {
  const { params } = config;
  const serializedParams = params ? `?${serializeParams(params)}` : '';
  return `cache_${endpoint}${serializedParams}`;
};

// Function to process the request queue with throttling
const processQueue = async (log) => {
  if (isProcessing) {
    return;
  }
  isProcessing = true;

  while (requestQueue.length > 0) {
    const { requestFn, resolve, reject, cacheKey } = requestQueue.shift();
    try {
      const result = await requestFn();
      // Save to cache if applicable
      if (result && cacheKey) {
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        log('Cached response for:', cacheKey);
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
    // Throttle: wait 200ms before processing next request
    await new Promise((res) => setTimeout(res, 200));
  }

  isProcessing = false;
};

const useApi = () => {
  const isProduction = window.isProduction === true;

  const log = useCallback(
    (...args) => {
      if (!isProduction) {
        console.log(...args);
      }
    },
    [isProduction]
  );

  const getJwtToken = useCallback(() => {
    return localStorage.getItem('accessToken');
  }, []);

  const getStoredNumber = useCallback(() => {
    const storedNumber = localStorage.getItem('storedNumber');
    return storedNumber ? parseInt(storedNumber, 10) : 0;
  }, []);

  const updateStoredNumber = useCallback(() => {
    let currentNumber = getStoredNumber();
    currentNumber += Math.floor(Math.random() * 3) + 1;

    if (currentNumber > 100) {
      currentNumber = 0;
    }

    localStorage.setItem('storedNumber', currentNumber);
    return currentNumber;
  }, [getStoredNumber]);

  // GET method with improved caching and deduplication
  const get = useCallback(
    (endpoint, config = {}) => {
      const { noCache, params, ...axiosConfig } = config;
      const cacheKey = generateCacheKey(endpoint, { params });

      const now = Date.now();

      console.log(endpoint);

      // Check in-memory cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        const { data, timestamp } = cached;
        const cacheExpiryTime = noCache ? MIN_CACHE_EXPIRY : CACHE_EXPIRY;
        if (now - timestamp < cacheExpiryTime) {
          log('Returning in-memory cache for:', cacheKey);
          return Promise.resolve(data);
        } else {
          // Remove expired cache
          cache.delete(cacheKey);
          log('Cache expired for:', cacheKey);
        }
      }

      // Check if a request is already pending for this endpoint
      if (pendingRequests.has(cacheKey)) {
        log('Awaiting pending request for:', cacheKey);
        return pendingRequests.get(cacheKey);
      }

      // Create a new promise for the request
      const requestPromise = new Promise((resolve, reject) => {
        const requestFn = async () => {
          try {
            log('Making GET request to:', endpoint, 'with config:', axiosConfig);
            const response = await axios.get(endpoint, {
              ...axiosConfig,
              params,
              headers: {
                ...axiosConfig.headers,
                Authorization: `Bearer ${getJwtToken()}`,
              },
            });
            log(
              'Received response for GET:',
              endpoint,
              'Status:',
              response.status,
              'Data:',
              response.data
            );

            updateStoredNumber();

            return response.data;
          } catch (error) {
            log('Error fetching data from GET:', endpoint, 'Error:', error);
            console.error('Error fetching data:', error);

            if (error.response && error.response.status === 403) {
              localStorage.removeItem('accessToken');
              localStorage.setItem('loginSuccessful', 'false');
              log('403 Forbidden: Redirecting to login.');
              window.location.href = '/login';
            }

            throw error;
          }
        };

        // Enqueue the request
        requestQueue.push({
          requestFn,
          resolve,
          reject,
          cacheKey,
        });
        processQueue(log);
      });

      // Store the pending request
      pendingRequests.set(cacheKey, requestPromise);

      // Once the request is settled, remove it from pendingRequests
      requestPromise
        .then(() => {
          pendingRequests.delete(cacheKey);
        })
        .catch(() => {
          pendingRequests.delete(cacheKey);
        });

      return requestPromise;
    },
    [getJwtToken, updateStoredNumber, log]
  );

  const mutate = useCallback(
    (method, endpoint, data = null, config = {}) => {
      return new Promise((resolve, reject) => {
        const requestFn = async () => {
          try {
            const storedNumber = updateStoredNumber();
            let modifiedData;

            if (data instanceof FormData) {
              modifiedData = data;
              // If your server expects storedNumber, handle it differently
            } else if (data) {
              modifiedData = { ...data, storedNumber };
            }

            log(
              `${method} request to:`,
              endpoint,
              'Data:',
              modifiedData,
              'Config:',
              config
            );

            // Determine the Content-Type
            let contentType = config.headers?.['Content-Type'];
            if (!contentType) {
              if (modifiedData instanceof FormData) {
                // Let Axios set the Content-Type for FormData
                contentType = undefined;
              } else {
                // Default to 'application/json' for other data types
                contentType = 'application/json';
              }
            }

            const response = await axios({
              method,
              url: endpoint,
              data: modifiedData,
              ...config,
              headers: {
                ...config.headers,
                ...(contentType && { 'Content-Type': contentType }),
                Authorization: `Bearer ${getJwtToken()}`,
              },
            });

            log(
              `Received response for ${method}:`,
              endpoint,
              'Status:',
              response.status,
              'Data:',
              response.data
            );

            // Invalidate cache for this endpoint
            // Generate cacheKey for all possible GET requests to this endpoint
            // Assuming GET requests may have different params, you might need a more sophisticated invalidation
            // For simplicity, we'll delete all cache entries that start with `cache_${endpoint}`
            for (let key of cache.keys()) {
              if (key.startsWith(`cache_${endpoint}`)) {
                cache.delete(key);
                log('Cleared cache for:', key);
              }
            }

            return response.data;
          } catch (error) {
            log(`Error with ${method} request to:`, endpoint, 'Error:', error);
            console.error(`Error with ${method} request:`, error);

            if (error.response && error.response.status === 403) {
              localStorage.removeItem('accessToken');
              localStorage.setItem('loginSuccessful', 'false');
              log(`${method} 403 Forbidden: Redirecting to login.`);
              window.location.href = '/login';
            }

            throw error;
          }
        };

        // Enqueue the mutation request
        requestQueue.push({ requestFn, resolve, reject, cacheKey: null });
        processQueue(log);
      });
    },
    [getJwtToken, updateStoredNumber, log]
  );

  const apiMethods = useMemo(
    () => ({
      get,
      post: (endpoint, data, config) => mutate('POST', endpoint, data, config),
      put: (endpoint, data, config) => mutate('PUT', endpoint, data, config),
      patch: (endpoint, data, config) => mutate('PATCH', endpoint, data, config),
      delete: (endpoint, config) => mutate('DELETE', endpoint, null, config),
    }),
    [get, mutate]
  );

  return apiMethods;
};

export default useApi;
