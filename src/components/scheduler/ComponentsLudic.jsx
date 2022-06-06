import { alpha } from "@material-ui/core";
import { WeekView } from "@devexpress/dx-react-scheduler-material-ui";
import ScheduleDialog from "../ScheduleDialogLudic";
import { useState } from "react";
import { isWeekend, isDisabledDate, isPastDate } from "./Utils";
const PREFIX = "Calendar";

const classes = {
  todayCell: `${PREFIX}-todayCell`,
  weekendCell: `${PREFIX}-weekendCell`,
  today: `${PREFIX}-today`,
  weekend: `${PREFIX}-weekend`,
};

const TimeTableCell = (props) => {
  const {
    startDate,
    disabledDates,
    availableHours,
    currentBookings,
    setLoading,
    ludicResourceExistenceId,
  } = props;
  const date = new Date(startDate);
  const [open, setOpen] = useState(false);
  let dates = disabledDates || [];

  if (isWeekend(date) || isDisabledDate(date, dates) || isPastDate(date)) {
    return (
      <WeekView.TimeTableCell
        startDate={startDate}
        onDoubleClick={undefined}
        style={{
          backgroundColor: alpha("rgba(0,0,0)", 0.06),
          "&:hover": {
            backgroundColor: alpha("rgba(0,0,0)", 0.06),
          },
          "&:focus": {
            backgroundColor: alpha("rgba(0,0,0)", 0.06),
          },
        }}
        className={classes.weekendCell}
      />
    );
  }

  if (
    date.toLocaleDateString("en-GB") === new Date().toLocaleDateString("en-GB")
  ) {
    return (
      <>
        <ScheduleDialog
          open={open}
          startHour={startDate}
          setOpen={setOpen}
          availableHours={availableHours}
          currentBookings={currentBookings}
          setLoading={setLoading}
          ludicResourceExistenceId={ludicResourceExistenceId}
        />
        <WeekView.TimeTableCell
          startDate={startDate}
          onDoubleClick={() => {
            let appointment = currentBookings.filter(
              (e) =>
                new Date(e.startDate) <= date &&
                new Date(e.endDate) >= new Date(date.getTime() + 30 * 60000)
            );
            if (appointment.length === 0) {
              setOpen(true);
            }
          }}
          className={classes.todayCell}
        />
      </>
    );
  }

  return (
    <>
      <ScheduleDialog
        setLoading={setLoading}
        open={open}
        startHour={startDate}
        setOpen={setOpen}
        availableHours={availableHours}
        currentBookings={currentBookings}
        ludicResourceExistenceId={ludicResourceExistenceId}
      />
      <WeekView.TimeTableCell
        startDate={startDate}
        onDoubleClick={() => {
          let appointment = currentBookings.filter(
            (e) =>
              new Date(e.startDate) <= date &&
              new Date(e.endDate) >= new Date(date.getTime() + 30 * 60000)
          );
          if (appointment.length === 0) {
            setOpen(true);
          }
        }}
      />
    </>
  );
};

const DayScaleCell = (props) => {
  const { startDate, today, disabledDates, formatDate } = props;
  if (today) {
    return (
      <WeekView.DayScaleCell
        {...props}
        style={{
          backgroundColor: alpha("rgb(173, 216, 230)", 0.16),
        }}
        className={classes.today}
      />
    );
  }
  let dates = [];
  if (disabledDates) {
    dates = disabledDates().map((e) => e.fecha.toLocaleDateString("en-GB"));
  }
  let date = startDate.toLocaleDateString("en-GB");
  if (
    startDate.getDay() === 0 ||
    startDate.getDay() === 6 ||
    dates.includes(date) ||
    startDate < new Date()
  ) {
    return (
      <WeekView.DayScaleCell
        formatDate={formatDate}
        startDate={startDate}
        className={classes.weekend}
      />
    );
  }
  return (
    <WeekView.DayScaleCell formatDate={formatDate} startDate={startDate} />
  );
};

export { DayScaleCell, TimeTableCell };
