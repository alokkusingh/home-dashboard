import { formatYearMonth } from './FormatYearMonth';

// Month name utilities
const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getCurrentMonth() {
  return MONTH_NAMES_SHORT[new Date().getMonth()];
}

export function getPreviousMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return MONTH_NAMES_SHORT[date.getMonth()];
}

export function getCurrentMonthFull() {
  return MONTH_NAMES_FULL[new Date().getMonth()];
}

export function getPreviousMonthFull() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return MONTH_NAMES_FULL[date.getMonth()];
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getPreviousYear() {
  return new Date().getFullYear() - 1;
}

export const getPreviousMonthYearMonth = () => {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = String(prevMonth.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getPreviousMonthDisplay = () => {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = prevMonth.getMonth() + 1;
  return formatYearMonth(year, month);
};