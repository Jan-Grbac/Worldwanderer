import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateIntervalId: string;
  timeslots: Array<Array<TimeSlot>>;
  dateIntervalTimeslots: Array<TimeSlot>;
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
    setTimeslots,
    dateIntervalTimeslots,
    tripId,
    socket,
  } = {
    ...props,
  };

  const [timeslot, setTimeslot] = useState<TimeSlot>();

  function handleInputChange(param: string, value: any) {
    let newTimeslot = { ...timeslot } as TimeSlot;
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
    if (!timeslot) return;

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
        let newTimeslots = [...timeslots] as Array<Array<TimeSlot>>;
        let newDateIntervalTimeslots = dateIntervalTimeslots as Array<TimeSlot>;

        newDateIntervalTimeslots.push(data);

        if (timeslots.length === 0) {
          newTimeslots.push(newDateIntervalTimeslots);
        } else {
          for (let i = 0; i < timeslots.length; i++) {
            if (
              JSON.stringify(timeslots[i]) ===
              JSON.stringify(dateIntervalTimeslots)
            ) {
              newTimeslots[i] = newDateIntervalTimeslots;
              break;
            }
          }
        }

        setTimeslots(newTimeslots);
        setTimeslot(undefined);

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
        value={timeslot?.startTime}
        onChange={(event) => handleInputChange("startTime", event.target.value)}
      ></input>
      End time:
      <input
        type="time"
        value={timeslot?.endTime}
        onChange={(event) => handleInputChange("endTime", event.target.value)}
      ></input>
      <button onClick={handleSubmit}>Add new timeslot</button>
    </>
  );
}

export default TimeSlotCreateComponent;
