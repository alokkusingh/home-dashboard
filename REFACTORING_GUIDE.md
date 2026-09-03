# Refactoring Quick Reference Guide

## New Centralized Utilities

### 1. DateUtils - Date Calculations
**Location:** `src/utils/DateUtils.js`

```javascript
import { getPreviousMonthYearMonth, getPreviousMonthDisplay, getCurrentYear } from './utils/DateUtils'

// Examples:
getPreviousMonthYearMonth()  // "2026-08" (current date: Sept 2026)
getPreviousMonthDisplay()    // "Aug 2026"
getCurrentYear()             // 2026
```

**Use this instead of:**
- Duplicating date logic in components
- Reinventing date formatting

---

### 2. Number Formatters - Unified API
**Location:** `src/utils/NumberFormatUtil.js`

**Recommended (New):**
```javascript
import { formatNumber } from './utils/NumberFormatUtil'

formatNumber(1000)                              // "1,000.00"
formatNumber(1000, { currency: true })         // "₹1,000.00"
formatNumber(1000, { decimals: 0 })            // "1,000"
formatNumber(1000, { currency: true, decimals: 0 })  // "₹1,000"
```

**Still Supported (Legacy):**
```javascript
import { NumberFormat, NumberFormatNoDecimal, NumberFormatNoCurrency } from './utils/NumberFormat*'

// These still work, but prefer formatNumber() going forward
```

---

### 3. API Fetch Wrapper (Ready to Use)
**Location:** `src/api/FetchUtils.js`

**When refactoring API managers:**
```javascript
import { fetchWithAuth, buildQueryString } from './FetchUtils'

// Before: 10+ lines per function with error handling
export async function fetchExpenses() {
  const requestOptions = { method: 'GET', headers: getHeadersNoAuthJson() };
  const response = await fetch('/home/api/expense', requestOptions);
  if (response.status === 401) { refreshToken(); return fetchExpenses(); }
  if (response.status === 403) { return; }
  return await response.json();
}

// After: 1 line
export function fetchExpenses() {
  return fetchWithAuth('/home/api/expense', getHeadersNoAuthJson(), fetchExpenses);
}

// With query params
const params = { yearMonth: '2026-08', category: 'Groceries' };
const url = '/home/api/expense' + buildQueryString(params);  // "/home/api/expense?yearMonth=2026-08&category=Groceries"
return fetchWithAuth(url, getHeadersNoAuthJson(), () => fetchExpenses(yearMonth, category));
```

---

## Migration Checklist

### Phase 1 ✅ COMPLETE
- [x] Centralized date utilities
- [x] Unified number formatters
- [x] Created API fetch wrapper
- [x] Updated ExpenseList to use DateUtils

### Phase 2 (Next - High Priority)
- [ ] **Refactor API Managers** to use `FetchUtils.js`
  - [ ] ExpensesAPIManager.js
  - [ ] InvestmentAPIManager.js
  - [ ] Other API files...
  - Estimated effort: 2-3 hours

- [ ] **Add React Keys** to list items
  - [ ] EstateTransactionList.js
  - [ ] HomeCards.js
  - Estimated effort: 30 minutes

- [ ] **Extract Inline Styles** to CSS classes
  - [ ] Create src/css/tables.css
  - [ ] Create src/css/common.css
  - Estimated effort: 2-3 hours

### Phase 3 (Later)
- [ ] Split large components (ExpenseList, HomeCards)
- [ ] Remove console.logs
- [ ] Update var → const

---

## Common Patterns

### Adding a New Date Utility
**File:** `src/utils/DateUtils.js`

```javascript
// Add at bottom of file
export const getStartOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};
```

Then import and use:
```javascript
import { getStartOfMonth } from './utils/DateUtils'
const start = getStartOfMonth()
```

### Adding a New Number Format
**File:** `src/utils/NumberFormatUtil.js`

```javascript
// Just add a new export
export const NumberFormatCurrency = (value) => formatNumber(value, { currency: true, decimals: 2 });
```

### Creating a New API Function
**File:** `src/api/NewAPIManager.js`

```javascript
import { fetchWithAuth, buildQueryString } from './FetchUtils'
import { getHeadersNoAuthJson } from './APIUtils'
import { refreshToken } from '../utils/SessionUtils'

export async function fetchData(params) {
  const url = '/home/api/endpoint' + buildQueryString(params);
  return fetchWithAuth(url, getHeadersNoAuthJson(), () => fetchData(params));
}
```

---

## Performance Tips

1. **Use centralized utilities instead of duplicating logic**
   - Reduces bundle size
   - Easier to maintain
   - Better for caching

2. **Add React keys to all dynamic lists**
   - Prevents rendering bugs
   - Improves performance with large lists

3. **Avoid inline styles - use CSS classes**
   - Reduces JSX verbosity
   - Better theme support
   - Easier to maintain

4. **Use FetchUtils for all API calls**
   - Consistent error handling
   - Easier to debug
   - Single point for adding features like retries

---

## Testing Refactored Code

```bash
# Run build to ensure no errors
npm run build

# Test date utilities
node -e "
const { getPreviousMonthDisplay, getCurrentYear } = require('./src/utils/DateUtils');
console.log('Previous month:', getPreviousMonthDisplay());
console.log('Current year:', getCurrentYear());
"

# Test number formatters
node -e "
const { formatNumber } = require('./src/utils/NumberFormatUtil');
console.log('Format 1000:', formatNumber(1000, { currency: true }));
"
```

---

## Questions?

Refer to `REFACTORING.md` for detailed analysis and architecture decisions.
