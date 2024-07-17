export function getCurrentMonth() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[new Date().getMonth()];
}

export function getPreviousMonth() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  return monthNames[date.getMonth()];
}

export function getCurrentMonthFull() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[new Date().getMonth()];
}

export function getPreviousMonthFull() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  return monthNames[date.getMonth()];
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getPreviousYear() {
  return new Date().getFullYear() - 1;
}