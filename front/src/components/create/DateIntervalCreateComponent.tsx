import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  tripId: string;
  username: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  socket: Socket | undefined;
}

function DateIntervalCreateComponent(props: Props) {
  const {
    jwt,
    tripId,
    username,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    socket,
  } = {
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
    if (param === "name") {
      newDateIntervalChanged[param] = value;
      setNewDateInterval(newDateIntervalChanged);
    }
    if (param === "budget") {
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
        (
          document.getElementById(`dateinterval-name-input`) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `dateinterval-budget-input`
          ) as HTMLInputElement
        ).value = "";

        let newTimeslots = [...timeslots];
        let newTimeslot = {
          id: "",
          name: "",
          notes: "",
          startTime: "",
          endTime: "",
          lat: 0,
          lng: 0,
          dateIntervalId: "",
          pos: 0,
        } as TimeSlot;

        let newTimeslotsArray = [];
        newTimeslotsArray.push(newTimeslot);
        newTimeslots.push(newTimeslotsArray);
        console.log(newTimeslots);

        setTimeslots(newTimeslots);

        setDateIntervals(newDateIntervals);
        setNewDateInterval({} as DateInterval);

        if (socket) {
          socket.emit(
            "UPDATE",
            tripId + ":" + username + ":ADDED_DATE_INTERVAL"
          );
        }
      });
  }

  function toggleCreateDiv() {
    let div = document.getElementById("dateinterval-create-div");
    if (div?.classList.contains("hidden")) {
      div.classList.remove("hidden");
    } else {
      div?.classList.add("hidden");
    }
  }

  return (
    <>
      <div className="rounded-md bg-gray-200 m-2 ml-4">
        <div className="flex flex-row justify-between">
          <div
            className="flex-grow hover:bg-gray-300 cursor-pointer rounded-md"
            onClick={toggleCreateDiv}
          >
            <h2 className="pl-4 font-bold italic">Add new trip section</h2>
          </div>
        </div>
        <div id="dateinterval-create-div" className="flex flex-col hidden">
          <div className="p-2 ml-2">
            Name (optional):
            <input
              id="dateinterval-name-input"
              className="ml-4 rounded-md pl-4 pr-4"
              type="text"
              onChange={(event) =>
                handleInputChange("name", event.target.value)
              }
            ></input>
          </div>
          <div className="flex flex-row justify-start gap-2">
            <div className="p-2 ml-2">
              Start date:
              <input
                id="dateinterval-startdate-input"
                className="rounded-md pl-4 pr-4"
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
                className="rounded-md pl-4 pr-4"
                type="date"
                onChange={(event) =>
                  handleInputChange("endDate", event.target.value)
                }
              ></input>
            </div>
          </div>
          <div className="p-2 ml-2">
            Budget (optional):
            <input
              id="dateinterval-budget-input"
              className="ml-4 rounded-md pl-4 pr-4"
              type="number"
              placeholder="0.0$"
              onChange={(event) =>
                handleInputChange("budget", event.target.value)
              }
            ></input>
          </div>

          <button
            className="confirmButton mb-2 w-max self-center"
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
