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

  function handleTripChanged() {
    let newTrip = { ...trip };
    newTrip.name = (
      document.getElementById("trip-name-textarea") as HTMLInputElement
    ).value;
    newTrip.description = (
      document.getElementById("trip-description-textarea") as HTMLInputElement
    ).value;

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTrip),
    };
    fetch(`/api/core/trip/updateTrip`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        } else {
          alert("wotf?");
        }
      })
      .then(() => {
        if (socket) {
          socket.emit(
            "UPDATE",
            trip.id + ":" + username + ":TRIP_PARAMS_UPDATED"
          );
        }
      });
  }

  function handleEnterKeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  return (
    <>
      <div className="border border-black">
        Trip name:
        <textarea
          id="trip-name-textarea"
          contentEditable="true"
          rows={1}
          onKeyDownCapture={handleEnterKeyPress}
          onBlur={handleTripChanged}
          suppressContentEditableWarning={true}
        >
          {trip.name}
        </textarea>
        <br />
        Trip description:
        <textarea
          id="trip-description-textarea"
          contentEditable="true"
          rows={1}
          onKeyDownCapture={handleEnterKeyPress}
          onBlur={handleTripChanged}
          suppressContentEditableWarning={true}
        >
          {trip.description}
        </textarea>
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
