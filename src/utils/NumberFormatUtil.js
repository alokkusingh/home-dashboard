/**
 * Unified number formatting utility to replace 4 separate files
 */

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "INR";

/**
 * Format number based on options
 * @param {number} value - The value to format
 * @param {object} options - Formatting options
 * @param {boolean} options.currency - Include currency symbol (default: false)
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number
 */
export const formatNumber = (value, options = {}) => {
  if (value === undefined || value === null) {
    return "-";
  }

  const {
    currency = false,
    decimals = 2
  } = options;

  const formatOptions = {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals === 0 ? 0 : decimals
  };

  if (currency) {
    formatOptions.style = "currency";
    formatOptions.currency = DEFAULT_CURRENCY;
  }

  return new Intl.NumberFormat(DEFAULT_LOCALE, formatOptions).format(value);
};

// Legacy exports for backward compatibility
export const NumberFormat = (value) => formatNumber(value, { currency: true, decimals: 2 });
export const NumberFormatNoDecimal = (value) => formatNumber(value, { currency: true, decimals: 0 });
export const NumberFormatNoCurrency = (value) => formatNumber(value, { currency: false, decimals: 0 });
export const NumberFormatNoCurrencyFraction2 = (value) => formatNumber(value, { currency: false, decimals: 2 });
