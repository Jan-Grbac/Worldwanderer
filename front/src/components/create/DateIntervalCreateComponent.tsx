import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  tripId: string;
  username: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  socket: Socket | undefined;
}

function DateIntervalCreateComponent(props: Props) {
  const { jwt, tripId, username, dateIntervals, setDateIntervals, socket } = {
    ...props,
  };
  const [newDateInterval, setNewDateInterval] = useState<DateInterval>();

  function handleInputChange(param: string, value: any) {
    let newDateIntervalChanged = { ...newDateInterval } as DateInterval;
    if (param === "startDate") {
      newDateIntervalChanged[param] = value;
      setNewDateInterval(newDateIntervalChanged);
    }
    if (param === "endDate") {
      newDateIntervalChanged[param] = value;
      setNewDateInterval(newDateIntervalChanged);
    }
  }

  function handleNewDateIntervalCreation() {
    if (!newDateInterval) return;

    if (newDateInterval.startDate === undefined) {
      alert("Start date must be selected!");
      return;
    }
    if (newDateInterval.endDate === undefined) {
      alert("End date must be selected!");
      return;
    }
    if (newDateInterval.startDate > newDateInterval.endDate) {
      alert("End date must be after start date.");
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newDateInterval),
    };
    fetch(`/api/core/dateInterval/createDateInterval/${tripId}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        let newDateIntervals = [...dateIntervals] as Array<DateInterval>;

        newDateIntervals.push(data);

        setDateIntervals(newDateIntervals);
        setNewDateInterval({} as DateInterval);

        (
          document.getElementById(
            `dateinterval-startdate-input`
          ) as HTMLInputElement
        ).value = "mm/dd/yyyy";
        (
          document.getElementById(
            `dateinterval-enddate-input`
          ) as HTMLInputElement
        ).value = "mm/dd/yyyy";

        if (socket) {
          socket.emit(
            "UPDATE",
            tripId + ":" + username + ":ADDED_DATE_INTERVAL"
          );
        }
      });
  }

  return (
    <>
      <div className="border border-black">
        Create new trip interval:
        <div className="p-2">
          Start date:
          <input
            id="dateinterval-startdate-input"
            type="date"
            onChange={(event) =>
              handleInputChange("startDate", event.target.value)
            }
          ></input>
        </div>
        <div className="p-2">
          End date:
          <input
            id="dateinterval-enddate-input"
            type="date"
            onChange={(event) =>
              handleInputChange("endDate", event.target.value)
            }
          ></input>
        </div>
        <button onClick={handleNewDateIntervalCreation}>
          Add new date interval to itinerary
        </button>
      </div>
    </>
  );
}

export default DateIntervalCreateComponent;
