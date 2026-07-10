/**
 * Utility functions for managing idempotency keys for form submissions.
 * Ensures that duplicate form submissions are prevented at the API level.
 */

/**
 * Generate a UUID v4 for use as an idempotency key
 */
export function generateIdempotencyKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create an idempotency key for a given form ID.
 * Keys are stored in sessionStorage to persist across component re-renders
 * but are cleared when the browser tab is closed.
 */
export function getOrCreateIdempotencyKey(formId) {
  const key = `idempotency_${formId}`;
  let idempotencyKey = sessionStorage.getItem(key);
  
  if (!idempotencyKey) {
    idempotencyKey = generateIdempotencyKey();
    sessionStorage.setItem(key, idempotencyKey);
  }
  
  return idempotencyKey;
}

/**
 * Clear the idempotency key for a given form ID (call after successful submission)
 */
export function clearIdempotencyKey(formId) {
  const key = `idempotency_${formId}`;
  sessionStorage.removeItem(key);
}

/**
 * Reset the idempotency key for a given form ID (generates a new one)
 */
export function resetIdempotencyKey(formId) {
  clearIdempotencyKey(formId);
  return getOrCreateIdempotencyKey(formId);
}
