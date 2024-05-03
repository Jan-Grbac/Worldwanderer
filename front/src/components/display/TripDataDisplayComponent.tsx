import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateIntervalDisplayComponent from "./DateIntervalDisplayComponent";
import DateIntervalCreateComponent from "../create/DateIntervalCreateComponent";

interface Props {
  jwt: string;
  trip: any;
  dateIntervals: any;
  setDateIntervals: Function;
  timeslots: any;
  setTimeslots: Function;
}

function TripDataDisplayComponent(props: Props) {
  const {
    jwt,
    trip,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
  } = { ...props };

  return (
    <>
      <DateIntervalCreateComponent
        jwt={jwt}
        tripId={trip.id}
        dateIntervals={dateIntervals}
        setDateIntervals={setDateIntervals}
      />
      {dateIntervals.map(function (dateInterval: any, index: number) {
        return (
          <DateIntervalDisplayComponent
            key={dateInterval.id as string}
            jwt={jwt}
            dateInterval={dateInterval}
            timeslots={timeslots[index]}
            setTimeslots={setTimeslots}
          />
        );
      })}
    </>
  );
}

export default TripDataDisplayComponent;
