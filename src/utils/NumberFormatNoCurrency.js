export const NumberFormatNoCurrency = value =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(value);