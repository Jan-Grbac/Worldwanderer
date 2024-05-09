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
  editable: boolean;
}

function TripDataDisplayComponent(props: Props) {
  const {
    jwt,
    trip,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    editable,
  } = { ...props };

  return (
    <>
      <div>
        Trip name: {trip.name}
        <br />
        Trip description: {trip.description}
        <br />
        Created by: {trip.ownerUsername}
      </div>
      {editable && (
        <DateIntervalCreateComponent
          jwt={jwt}
          tripId={trip.id}
          dateIntervals={dateIntervals}
          setDateIntervals={setDateIntervals}
        />
      )}
      {dateIntervals.map(function (dateInterval: any, index: number) {
        return (
          <DateIntervalDisplayComponent
            key={dateInterval.id as string}
            jwt={jwt}
            dateInterval={dateInterval}
            dateIntervals={dateIntervals}
            timeslots={timeslots}
            dateIntervalTimeslots={timeslots[index]}
            setTimeslots={setTimeslots}
            tripId={trip.id}
            editable={editable}
          />
        );
      })}
    </>
  );
}

export default TripDataDisplayComponent;
