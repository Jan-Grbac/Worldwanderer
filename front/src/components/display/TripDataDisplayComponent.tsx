import DateIntervalDisplayComponent from "./DateIntervalDisplayComponent";
import DateIntervalCreateComponent from "../create/DateIntervalCreateComponent";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

interface Props {
  jwt: string;
  trip: Trip;
  username: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
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
      <div className="border border-black">
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
      {dateIntervals &&
        dateIntervals.map(function (dateInterval: DateInterval, index: number) {
          return (
            <DateIntervalDisplayComponent
              key={dateInterval.id as string}
              jwt={jwt}
              username={username}
              dateInterval={dateInterval}
              dateIntervals={dateIntervals}
              setDateIntervals={setDateIntervals}
              timeslots={timeslots}
              setTimeslots={setTimeslots}
              dateIntervalTimeslots={timeslots[index]}
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
