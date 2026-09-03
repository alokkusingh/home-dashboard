import { refreshToken } from '../utils/SessionUtils';

/**
 * Generic fetch wrapper to eliminate duplication across all API managers
 * Handles authentication, retries, and error handling
 * @param {string} url - API endpoint URL
 * @param {object} headers - Request headers
 * @param {function} originalFetch - Original fetch function for retry
 * @returns {Promise} API response JSON
 */
export async function fetchWithAuth(url, headers, originalFetch = null) {
  try {
    const requestOptions = {
      method: 'GET',
      headers: headers
    };

    const response = await fetch(url, requestOptions);

    // Handle 401 - unauthorized, refresh token and retry once
    if (response.status === 401) {
      refreshToken();
      if (originalFetch) {
        return await originalFetch();
      }
      return null;
    }

    // Handle 403 - forbidden
    if (response.status === 403) {
      console.warn(`Access forbidden: ${url}`);
      return null;
    }

    // Handle other error status codes
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${url}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    return null;
  }
}

/**
 * Build query string from parameters
 * @param {object} params - Key-value pairs for query string
 * @returns {string} Query string (e.g., "?key1=val1&key2=val2")
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
}
