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
      newDateInterval.endDate = newDateInterval.startDate;
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

  function showCreateDiv() {
    let div = document.getElementById("dateinterval-create-div");
    if (div?.classList.contains("hidden")) {
      div.classList.remove("hidden");
    } else {
      div?.classList.add("hidden");
    }
  }

  return (
    <>
      <div className="rounded-md bg-gray-200 pl-4 m-2">
        <div className="flex flex-row justify-between">
          <h2 className="font-bold italic">Add new trip section</h2>
          <button className="mr-4 font-extrabold" onClick={showCreateDiv}>
            -
          </button>
        </div>
        <div id="dateinterval-create-div" className="hidden">
          <div className="p-2">
            Name (optional):
            <input
              id="dateinterval-name-input"
              type="date"
              onChange={(event) =>
                handleInputChange("name", event.target.value)
              }
            ></input>
          </div>
          <div className="flex flex-row justify-start gap-2">
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
              End date (optional):
              <input
                id="dateinterval-enddate-input"
                type="date"
                onChange={(event) =>
                  handleInputChange("endDate", event.target.value)
                }
              ></input>
            </div>
          </div>
          <div className="p-2">
            Budget (optional):
            <input
              id="dateinterval-budget-input"
              type="date"
              onChange={(event) =>
                handleInputChange("budget", event.target.value)
              }
            ></input>
          </div>

          <button
            className="confirmButton mb-2"
            onClick={handleNewDateIntervalCreation}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}

export default DateIntervalCreateComponent;
