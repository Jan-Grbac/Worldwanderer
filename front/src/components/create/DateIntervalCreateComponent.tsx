import React, { useState } from "react";

interface Props {
  jwt: string;
  tripId: string;
  dateIntervals: Array<any>;
  setDateIntervals: Function;
}

function DateIntervalCreateComponent(props: Props) {
  const { jwt, tripId, dateIntervals, setDateIntervals } = { ...props };
  const [newDateInterval, setNewDateInterval] = useState({
    startDate: undefined,
    endDate: undefined,
  });

  function handleInputChange(param: string, value: any) {
    let newDateIntervalChanged = { ...newDateInterval };
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
    if (newDateInterval.startDate === undefined) {
      alert("Start date must be selected!");
      return;
    }
    if (newDateInterval.endDate === undefined) {
      alert("End date must be selected!");
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
        let newDateIntervals = dateIntervals.concat(data);
        setDateIntervals(newDateIntervals);
        setNewDateInterval({
          startDate: undefined,
          endDate: undefined,
        });
        window.location.reload();
      });
  }

  return (
    <>
      <div>
        Create new trip interval:
        <div className="p-2">
          Start date:
          <input
            type="date"
            onChange={(event) =>
              handleInputChange("startDate", event.target.value)
            }
          ></input>
        </div>
        <div className="p-2">
          End date:
          <input
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
