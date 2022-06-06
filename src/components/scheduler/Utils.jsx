function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isDisabledDate(date, disabledDays) {
  return disabledDays.includes(date.toLocaleDateString("en-GB"));
}

function isPastDate(date) {
  return date < new Date();
}

function isValidAppointment(date, disabledDays) {
  return (
    !isWeekend(date) && !isDisabledDate(date, disabledDays) && !isPastDate(date)
  );
}
export { isWeekend, isDisabledDate, isPastDate, isValidAppointment };
