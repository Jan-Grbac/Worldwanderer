import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeslotDisplayComponent from "./TimeslotDisplayComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";

interface Props {
  jwt: string;
  dateInterval: any;
  timeslots: any;
  setTimeslots: Function;
}

function DateIntervalDisplayComponent(props: Props) {
  const { jwt, dateInterval, timeslots, setTimeslots } = { ...props };

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    <>
      <p>
        Start date: {formatDate(dateInterval.startDate)} <br />
        End date: {formatDate(dateInterval.endDate)}
      </p>
      <TimeSlotCreateComponent
        jwt={jwt}
        dateIntervalId={dateInterval.id}
        timeslots={timeslots}
        setTimeslots={setTimeslots}
      />
      {timeslots.map(function (timeslot: any) {
        return (
          <TimeslotDisplayComponent
            key={timeslot.id as string}
            jwt={jwt}
            timeslot={timeslot}
          />
        );
      })}
    </>
  );
}

export default DateIntervalDisplayComponent;
