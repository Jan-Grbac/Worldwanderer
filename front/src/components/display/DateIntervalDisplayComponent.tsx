import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeslotDisplayComponent from "./TimeslotDisplayComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";

interface Props {
  jwt: string;
  dateInterval: any;
  dateIntervals: any;
  setDateIntervals: Function;
  timeslots: any;
  setTimeslots: Function;
  tripId: string;
}

function DateIntervalDisplayComponent(props: Props) {
  const {
    jwt,
    dateInterval,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    tripId,
  } = { ...props };

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    <>
      <div className="flex">
        <p>
          Start date: {formatDate(dateInterval.startDate)} <br />
          End date: {formatDate(dateInterval.endDate)}
        </p>
        <RemoveDateIntervalComponent
          jwt={jwt}
          dateIntervalId={dateInterval.id}
          dateIntervals={dateIntervals}
          setDateIntervals={setDateIntervals}
          tripId={tripId}
        />
      </div>
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
