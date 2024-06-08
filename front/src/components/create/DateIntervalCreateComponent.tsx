import { useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

interface Props {
  jwt: string;
  tripId: string;
  username: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  socket: Socket | undefined;
  renderArray: Array<boolean>;
  setRenderArray: Function;
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
    renderArray,
    setRenderArray,
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
      toast.error("Start date must be selected!");
      return;
    }
    if (newDateInterval.endDate === undefined) {
      newDateInterval.endDate = newDateInterval.startDate;
    }
    if (newDateInterval.startDate > newDateInterval.endDate) {
      toast.error("End date must be after start date.");
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

        let newTimeslots: Array<Array<TimeSlot>>;
        if (timeslots.length === 0) {
          newTimeslots = [];
        } else {
          newTimeslots = [...timeslots];
        }

        let newTimeslot = {
          id: "",
          name: "",
          notes: "",
          startTime: "",
          endTime: "",
          lat: 0,
          lng: 0,
          dateIntervalId: "",
          pos: data.pos,
        } as TimeSlot;
        console.log(newTimeslot);

        let newTimeslotsArray = [];
        newTimeslotsArray.push(newTimeslot);
        newTimeslots.push(newTimeslotsArray);

        let newRenderArray = [...renderArray];
        newRenderArray.push(true);
        setRenderArray(newRenderArray);

        setTimeslots(newTimeslots);

        setDateIntervals(newDateIntervals);
        setNewDateInterval({} as DateInterval);

        console.log("date interval created, ", newDateIntervals);
        console.log("new timeslots", newTimeslots);

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
            <h2 className="pl-4 font-semibold">Add new trip section</h2>
          </div>
        </div>
        <div
          id="dateinterval-create-div"
          className="ml-2 mt-1 p-2 grid grid-rows-5 grid-cols-3 hidden"
        >
          <strong className="pl-2 pt-2">Name (optional):</strong>
          <input
            id="dateinterval-name-input"
            className="rounded-md pl-4 pr-4 m-1 col-span-2"
            type="text"
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
          <strong className="pl-2 pt-2">Start date:</strong>
          <input
            id="dateinterval-startdate-input"
            className="rounded-md pl-4 pr-4 m-1 col-span-2"
            type="date"
            onChange={(event) =>
              handleInputChange("startDate", event.target.value)
            }
          ></input>
          <strong className="pl-2 pt-2">End date (optional):</strong>
          <input
            id="dateinterval-enddate-input"
            className="rounded-md pl-4 pr-4 m-1 col-span-2"
            type="date"
            onChange={(event) =>
              handleInputChange("endDate", event.target.value)
            }
          ></input>
          <strong className="pl-2 pt-2">Budget (optional):</strong>
          <input
            id="dateinterval-budget-input"
            className="rounded-md pl-4 pr-4 m-1 col-span-2"
            type="number"
            placeholder="0.0$"
            onChange={(event) =>
              handleInputChange("budget", event.target.value)
            }
          ></input>

          <div className="col-start-2 flex flex-row justify-center">
            <button
              className="confirmButton mb-2 mt-1"
              onClick={handleNewDateIntervalCreation}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DateIntervalCreateComponent;
