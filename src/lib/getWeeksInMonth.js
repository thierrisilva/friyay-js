
function getWeeksInMonth(month) {
  const weekdaysBefore =
    month
      .clone()
      .startOf('month')
      .weekday() - 1;
  const totalDays = month.daysInMonth() + weekdaysBefore;

  return Math.ceil(totalDays / 7);
}


export default getWeeksInMonth;