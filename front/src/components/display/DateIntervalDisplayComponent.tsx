import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import TimeSlotDisplayComponent from "./TimeSlotDisplayComponent";

interface Props {
  jwt: string;
  dateInterval: any;
  dateIntervals: any;
  timeslots: any;
  dateIntervalTimeslots: any;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
}

function DateIntervalDisplayComponent(props: Props) {
  const {
    jwt,
    dateInterval,
    dateIntervals,
    timeslots,
    dateIntervalTimeslots,
    setTimeslots,
    tripId,
    editable,
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
        {editable && (
          <RemoveDateIntervalComponent
            jwt={jwt}
            dateIntervalId={dateInterval.id}
            dateIntervals={dateIntervals}
            tripId={tripId}
          />
        )}
      </div>
      {editable && (
        <TimeSlotCreateComponent
          jwt={jwt}
          dateIntervalId={dateInterval.id}
          timeslots={timeslots}
          dateIntervalTimeslots={dateIntervalTimeslots}
          setTimeslots={setTimeslots}
          tripId={tripId}
        />
      )}
      {dateIntervalTimeslots.map(function (timeslot: any) {
        return (
          <TimeSlotDisplayComponent
            key={timeslot.id as string}
            jwt={jwt}
            timeslot={timeslot}
            timeslots={dateIntervalTimeslots}
            tripId={tripId}
            editable={editable}
          />
        );
      })}
    </>
  );
}

export default DateIntervalDisplayComponent;
