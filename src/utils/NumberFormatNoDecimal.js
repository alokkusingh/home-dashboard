export const NumberFormatNoDecimal = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0
  }).format(value);