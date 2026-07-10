# Idempotency Key Implementation for Form Submissions

## Overview
This document describes the idempotency key system implemented for form submissions in the home-dashboard application. Idempotency keys ensure that duplicate form submissions result in the same outcome, preventing unintended side effects like duplicate entries in the database.

## Implementation Details

### 1. Utility Module: `src/utils/IdempotencyUtils.js`
This module provides utility functions for managing idempotency keys:

- **`generateIdempotencyKey()`**: Generates a UUID v4 that serves as a unique identifier for each form submission
- **`getOrCreateIdempotencyKey(formId)`**: Retrieves an existing idempotency key for a form or creates a new one if it doesn't exist. Keys are stored in `sessionStorage` to persist across component re-renders but are cleared when the browser tab closes.
- **`clearIdempotencyKey(formId)`**: Removes the idempotency key after a successful form submission
- **`resetIdempotencyKey(formId)`**: Generates a new idempotency key for a form (useful for retry scenarios)

### 2. API Utilities: `src/api/APIUtils.js`
Updated header functions to accept and include idempotency keys:

- **`postHeadersNoAuthJson(idempotencyKey)`**: Adds `Idempotency-Key` header to POST requests when provided
- **`uploadHeadersJson(idempotencyKey)`**: Adds `Idempotency-Key` header to file upload requests when provided

### 3. Updated Form Components

#### File Upload Forms
- **`src/UploadFile.js`**: File upload form with idempotency support
- **`src/UploadFileCopy.js`**: Alternative file upload form with idempotency support
- **`src/archive/UploadStatement.js`**: Bank statement upload form with idempotency support
- **`src/archive/UploadExpense.js`**: Expense file upload form with idempotency support

#### Data Entry Forms
- **`src/FormEstate.js`**: Real estate transaction entry form with idempotency support
- **`src/FormExpense.js`**: Expense entry form with idempotency support

#### API Manager
- **`src/api/FormAPIManager.js`**: Updated to pass idempotency keys to API endpoints

## Usage Pattern

### For New Form Submissions
1. When a form is submitted, call `getOrCreateIdempotencyKey(formId)` to get or generate a key
2. Pass the idempotency key to the API call (either via headers or in the request options)
3. Upon successful submission, call `clearIdempotencyKey(formId)` to reset the key for the next submission
4. If the form submission fails, the key is retained, allowing the user to retry with the same key

### Form IDs Used
- `'upload-file-form'` - UploadFile.js
- `'upload-file-copy-form'` - UploadFileCopy.js
- `'upload-statement-form'` - UploadStatement.js
- `'upload-expense-form'` - UploadExpense.js
- `'form-estate'` - FormEstate.js
- `'form-expense'` - FormExpense.js

## How It Works

### Session Storage
- Idempotency keys are stored in the browser's `sessionStorage` under the key `idempotency_{formId}`
- Keys persist across page reloads within the same browser tab
- Keys are cleared when the browser tab is closed or the user logs out
- Keys are cleared after a successful submission

### HTTP Header
The idempotency key is sent in the `Idempotency-Key` HTTP header:
```
Idempotency-Key: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
```

### Server-Side Handling (Expected)
The backend API should:
1. Extract the `Idempotency-Key` header from the request
2. Check if a request with this key has been processed before
3. If yes, return the cached response (idempotent behavior)
4. If no, process the request and cache the response for future calls with the same key

## Benefits

1. **Prevents Duplicate Entries**: Users who accidentally submit a form twice will not create duplicate database entries
2. **Network Resilience**: Retrying a failed request with the same key guarantees the same result
3. **User Experience**: Users can safely click submit multiple times without fear of side effects
4. **Browser Tab Safety**: Keys are session-scoped, preventing unwanted state sharing across browser tabs

## Testing Recommendations

1. **Basic Functionality**: Submit a form, then submit again immediately - verify only one entry is created
2. **Network Failure**: Submit a form, disconnect from the network, then retry - verify the same result
3. **Multiple Forms**: Ensure different forms have different idempotency keys
4. **Session Isolation**: Open the same form in two browser tabs - verify they have different idempotency keys

## Future Enhancements

1. **Persistent Storage**: Consider using IndexedDB for longer-term key persistence
2. **Key Expiration**: Implement automatic key expiration after a certain time period
3. **User-Specific Keys**: Consider including user ID in the key generation for better tracking
4. **Monitoring**: Add logging to track idempotency key usage for debugging and analytics
