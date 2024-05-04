import React, { useEffect, useState } from "react";

interface Props {
  jwt: string;
  dateIntervalId: string;
  timeslots: any;
  setTimeslots: Function;
}

function TimeSlotCreateComponent(props: Props) {
  const { jwt, dateIntervalId, timeslots, setTimeslots } = { ...props };

  const [timeslot, setTimeslot] = useState({
    id: "",
    startTime: undefined,
    endTime: undefined,
  });

  useEffect(() => {
    console.log(jwt);
    console.log(dateIntervalId);
    console.log(timeslots);
  }, [props]);

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
        let newTimeslots = timeslots + data;
        setTimeslots(newTimeslots);

        let cleanTimeslot = {
          id: "",
          startTime: undefined,
          endTime: undefined,
        };
        setTimeslot(cleanTimeslot);
        window.location.reload();
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
