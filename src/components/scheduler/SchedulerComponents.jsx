import React from "react";
import { isWeekend, isDisabledDate, isPastDate } from "./Utils";
import "./components.css";

function DataCell(props) {
  const { startDate, disabledDates } = props.itemData;
  const weekend = isWeekend(startDate);
  const past = isPastDate(startDate);
  const disabled = isDisabledDate(startDate, disabledDates);

  return (
    <div className={weekend || past || disabled ? "disable-date" : null}>
      {props.children}
    </div>
  );
}

export { DataCell };
