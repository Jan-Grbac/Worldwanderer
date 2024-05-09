import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateIntervalDisplayComponent from "./DateIntervalDisplayComponent";
import DateIntervalCreateComponent from "../create/DateIntervalCreateComponent";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  trip: any;
  username: string;
  dateIntervals: any;
  setDateIntervals: Function;
  timeslots: any;
  setTimeslots: Function;
  editable: boolean;
  socket: Socket | undefined;
}

function TripDataDisplayComponent(props: Props) {
  const {
    jwt,
    trip,
    username,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    editable,
    socket,
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
          username={username}
          dateIntervals={dateIntervals}
          setDateIntervals={setDateIntervals}
          socket={socket}
        />
      )}
      {dateIntervals.map(function (dateInterval: any, index: number) {
        return (
          <DateIntervalDisplayComponent
            key={dateInterval.id as string}
            jwt={jwt}
            username={username}
            dateInterval={dateInterval}
            dateIntervals={dateIntervals}
            timeslots={timeslots}
            dateIntervalTimeslots={timeslots[index]}
            setTimeslots={setTimeslots}
            tripId={trip.id}
            editable={editable}
            socket={socket}
          />
        );
      })}
    </>
  );
}

export default TripDataDisplayComponent;
