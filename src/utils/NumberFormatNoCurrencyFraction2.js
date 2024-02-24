export const NumberFormatNoCurrencyFraction2 = value =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(value);