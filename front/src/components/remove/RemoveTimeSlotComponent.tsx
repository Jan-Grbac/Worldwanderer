import React from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  timeslotId: string;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  tripId: string;
  socket: Socket | undefined;
}

function RemoveTimeSlotComponent(props: Props) {
  const { jwt, username, timeslotId, timeslots, setTimeslots, tripId, socket } =
    {
      ...props,
    };

  function removeTimeslot() {
    console.log("Timeslot removal:");
    console.log(timeslots);
    let newTimeslots = [...timeslots] as Array<Array<TimeSlot>>;

    for (let i = 0; i < timeslots.length; i++) {
      for (let j = 0; j < timeslots[i].length; j++) {
        if (timeslots[i][j].id === timeslotId) {
          newTimeslots[i].splice(j, 1);
          if (newTimeslots[i].length === 0) {
            newTimeslots[i].push({
              id: "",
              name: "",
              notes: "",
              startTime: "",
              endTime: "",
              lat: 0,
              lng: 0,
              dateIntervalId: "",
              pos: 0,
            } as TimeSlot);
          }
          break;
        }
      }
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    };
    fetch(`/api/core/timeslot/deleteTimeslot/${timeslotId}`, fetchData);

    setTimeslots(newTimeslots);

    if (socket) {
      socket.emit("UPDATE", tripId + ":" + username + ":DELETED_TIMESLOT");
    }
  }

  return (
    <>
      <button onClick={removeTimeslot} className="w-max mr-2">
        🗑️
      </button>
    </>
  );
}

export default RemoveTimeSlotComponent;
