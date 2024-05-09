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
          console.log(newTimeslots);
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
      <button onClick={removeTimeslot}>X</button>
    </>
  );
}

export default RemoveTimeSlotComponent;
