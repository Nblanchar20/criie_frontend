import moment from "moment";

let getDayHours = (startHour, endHour, startMinute) => {
  let hours = [];
  let minutes = ["00", "30"];
  for (let i = startHour; i <= endHour; i++) {
    if (i === startHour && startMinute !== "") {
      if (startMinute === 0) {
        ["30"].forEach((j) => {
          hours.push(`${i < 10 ? `0${i}` : i}:${j}`);
        });
      }
    } else {
      minutes.forEach((j) => {
        hours.push(`${i < 10 ? `0${i}` : i}:${j}`);
      });
    }
  }
  return hours;
};

let getDayAvailableHours = (day, data) => {
  let _day = moment(day).format().split("T")[0];
  let appointments = data
    .filter((e) => e.startDate.split("T")[0] === _day)
    .map((e) => ({
      ...e,
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate),
    }));
  let hours = getDayHours(8, 17, "");
  hours = hours.filter(
    (e) =>
      appointments.filter(
        (e2) =>
          e2.startDate < new Date(`${_day} ${e}`) &&
          e2.endDate > new Date(`${_day} ${e}`)
      ).length === 0
  );
  return hours;
};

export { getDayHours, getDayAvailableHours };
