import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateIntervalId: string;
  timeslots: any;
  dateIntervalTimeslots: any;
  setTimeslots: Function;
  tripId: string;
  socket: Socket | undefined;
}

function TimeSlotCreateComponent(props: Props) {
  const {
    jwt,
    username,
    dateIntervalId,
    timeslots,
    dateIntervalTimeslots,
    setTimeslots,
    tripId,
    socket,
  } = {
    ...props,
  };

  const [timeslot, setTimeslot] = useState({
    id: "",
    startTime: undefined,
    endTime: undefined,
  });

  function handleInputChange(param: string, value: any) {
    let newTimeslot = { ...timeslot };
    if (param === "startTime") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
    if (param === "endTime") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
  }

  function handleSubmit() {
    if (timeslot.startTime === undefined) {
      alert("Start time cannot be undefined.");
      return;
    }
    if (timeslot.endTime === undefined) {
      alert("End time cannot be undefined.");
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(timeslot),
    };
    fetch(`/api/core/timeslot/createTimeslot/${dateIntervalId}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Timeslot already exists?!");
          return;
        }
      })
      .then((data) => {
        let newTimeslots = [...timeslots];
        let newDateIntervalTimeslots = [...dateIntervalTimeslots];

        newDateIntervalTimeslots.push(data);

        if (timeslots.length === 0) {
          newTimeslots.push(newDateIntervalTimeslots);
        } else {
          for (let i = 0; i < timeslots.length; i++) {
            if (timeslots[i] === dateIntervalTimeslots) {
              newTimeslots[i] = newDateIntervalTimeslots;
              break;
            }
          }
        }

        setTimeslots(newTimeslots);
        setTimeslot({
          id: "",
          startTime: undefined,
          endTime: undefined,
        });
        document.querySelector("input")?.setAttribute("value", null as any);

        if (socket) {
          socket.emit("UPDATE", tripId + ":" + username + ":ADDED_TIMESLOT");
        }
      });
  }

  return (
    <>
      Start time:
      <input
        type="time"
        value={timeslot.startTime}
        onChange={(event) => handleInputChange("startTime", event.target.value)}
      ></input>
      End time:
      <input
        type="time"
        value={timeslot.endTime}
        onChange={(event) => handleInputChange("endTime", event.target.value)}
      ></input>
      <button onClick={handleSubmit}>Add new timeslot</button>
    </>
  );
}

export default TimeSlotCreateComponent;
