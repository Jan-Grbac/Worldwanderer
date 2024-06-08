import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import TimeSlotDisplayComponent from "./TimeslotDisplayComponent";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { colorDict } from "../../assets/colors/colorDictionary";
import eyeIcon from "../../assets/eye.svg";
import eyeIconCrossed from "../../assets/eye-slash.svg";
import { render } from "react-dom";

interface Props {
  jwt: string;
  username: string;
  dateInterval: DateInterval;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  dateIntervalTimeslots: Array<TimeSlot>;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
  selectedTimeslot: TimeSlot;
  setSelectedTimeslot: Function;
  selectedDateInterval: DateInterval;
  selectOnMap: boolean;
  setSelectOnMap: Function;
  map: google.maps.Map;
  renderArray: Array<boolean>;
  setRenderArray: Function;
}

function DateIntervalDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    dateInterval,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    dateIntervalTimeslots,
    tripId,
    editable,
    socket,
    selectedTimeslot,
    setSelectedTimeslot,
    selectedDateInterval,
    selectOnMap,
    setSelectOnMap,
    map,
    renderArray,
    setRenderArray,
  } = { ...props };

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  function dateSubstring(date: string) {
    return date.substring(0, 10);
  }

  function allowDateEditing() {
    if (!editable) return;

    document
      .getElementById("dateinterval-date-view-" + dateInterval.id)
      ?.classList.add("hidden");
    document
      .getElementById("dateinterval-date-edit-" + dateInterval.id)
      ?.classList.remove("hidden");
    document
      .getElementById("dateinterval-date-edit-startdate-" + dateInterval.id)
      ?.focus();
  }

  function finishDateEditing(event: any) {
    if (!editable) return;

    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    if (dateInterval.name === "") {
      dateInterval.name = "unnamed";
      let view = document.getElementById(
        "dateinterval-name-view-" + dateInterval.id
      );
      if (view) {
        view.innerHTML = "unnamed";
      }
    }

    document
      .getElementById("dateinterval-date-view-" + dateInterval.id)
      ?.classList.remove("hidden");
    document
      .getElementById("dateinterval-name-view-" + dateInterval.id)
      ?.classList.remove("hidden");
    document
      .getElementById("dateinterval-budget-view-" + dateInterval.id)
      ?.classList.remove("hidden");

    document
      .getElementById("dateinterval-date-edit-" + dateInterval.id)
      ?.classList.add("hidden");
    document
      .getElementById("dateinterval-name-edit-" + dateInterval.id)
      ?.classList.add("hidden");
    document
      .getElementById("dateinterval-budget-edit-" + dateInterval.id)
      ?.classList.add("hidden");

    if (dateInterval.endDate < dateInterval.startDate) {
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dateInterval),
    };
    fetch(`/api/core/dateInterval/updateDateInterval`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        }
      })
      .then(() => {
        if (socket) {
          socket.emit(
            "UPDATE",
            tripId + ":" + username + ":UPDATED_DATE_INTERVAL"
          );
        }
      });
  }

  function handleEnterKeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  function dateIntervalChanged(param: string, value: any) {
    let newDateIntervals = [...dateIntervals];

    for (let i = 0; i < dateIntervals.length; i++) {
      if (dateInterval === dateIntervals[i]) {
        let newDateInterval = { ...dateInterval };
        if (param === "name") {
          newDateInterval.name = value;
        }
        if (param === "startDate") {
          newDateInterval.startDate = value;
        }
        if (param === "endDate") {
          newDateInterval.endDate = value;
        }
        if (param === "budget") {
          newDateInterval.budget = value;
        }
        newDateIntervals[i] = newDateInterval;
        break;
      }
    }

    setDateIntervals(newDateIntervals);
  }

  function handleTimeslotClicked(timeslot: TimeSlot) {
    if (selectedTimeslot) {
      if (timeslot.id === selectedTimeslot.id) return;
    }
    setSelectedTimeslot({ ...timeslot });
    map.panTo(new google.maps.LatLng(timeslot.lat, timeslot.lng));
  }

  function allowNameEditing() {
    if (!editable) return;

    let view = document.getElementById(
      "dateinterval-name-view-" + dateInterval.id
    );
    view?.classList.add("hidden");
    let edit = document.getElementById(
      "dateinterval-name-edit-" + dateInterval.id
    );
    edit?.classList.remove("hidden");
    edit?.focus();
  }

  function allowBudgetEditing() {
    if (!editable) return;

    let view = document.getElementById(
      "dateinterval-budget-view-" + dateInterval.id
    );
    view?.classList.add("hidden");
    let edit = document.getElementById(
      "dateinterval-budget-edit-" + dateInterval.id
    );
    edit?.classList.remove("hidden");
    edit?.focus();
  }

  useEffect(() => {
    if (selectedDateInterval) {
      let div = document.getElementById("dateinterval-" + dateInterval.id);
      if (selectedDateInterval.id === dateInterval.id) {
        div?.classList.add("bg-gray-300");
      } else {
        div?.classList.remove("bg-gray-300");
      }
    }
  }, [selectedDateInterval]);

  useEffect(() => {
    let top = document.getElementById(
      "dateinterval-div-top-" + dateInterval.id
    );
    if (top) {
      top.style.backgroundColor = colorDict[dateInterval.pos % 20];
    }
  }, [dateInterval]);

  function toggleDateInterval() {
    let timeslotsShow = document.getElementById(
      "dateinterval-timeslots-" + dateInterval.id
    );
    let timeslotsCreate = document.getElementById(
      "dateinterval-timeslots-create-" + dateInterval.id
    );
    let topArrow = document.getElementById(
      "dateinterval-top-icon-" + dateInterval.id
    );

    if (timeslotsShow?.classList.contains("hidden")) {
      timeslotsShow.classList.remove("hidden");
      topArrow?.classList.remove("rotate-180");
    } else {
      timeslotsShow?.classList.add("hidden");
      topArrow?.classList.add("rotate-180");
    }

    if (timeslotsCreate?.classList.contains("hidden")) {
      timeslotsCreate.classList.remove("hidden");
    } else {
      timeslotsCreate?.classList.add("hidden");
    }
  }

  function toggleDateIntervalShow() {
    let enabledIcon = document.getElementById(
      "dateinterval-enabled-icon-" + dateInterval.id
    );
    let disabledIcon = document.getElementById(
      "dateinterval-disabled-icon-" + dateInterval.id
    );

    let newRenderArray = [...renderArray];

    if (enabledIcon?.classList.contains("hidden")) {
      disabledIcon?.classList.add("hidden");
      enabledIcon.classList.remove("hidden");
      newRenderArray[dateInterval.pos] = true;
    } else {
      enabledIcon?.classList.add("hidden");
      disabledIcon?.classList.remove("hidden");
      newRenderArray[dateInterval.pos] = false;
    }

    setRenderArray(newRenderArray);
  }

  function shift(change: number) {
    let newDateIntervals = [...dateIntervals];

    let temp = {
      ...newDateIntervals[dateInterval.pos - change],
      pos: dateInterval.pos,
    };
    newDateIntervals[dateInterval.pos - change] = {
      ...newDateIntervals[dateInterval.pos],
      pos: dateInterval.pos - change,
    };
    newDateIntervals[dateInterval.pos] = temp;

    let newTimeSlots = [...timeslots];
    let temp2 = [...newTimeSlots[dateInterval.pos]];
    newTimeSlots[dateInterval.pos] = [
      ...newTimeSlots[dateInterval.pos - change],
    ];
    newTimeSlots[dateInterval.pos - change] = temp2;

    setDateIntervals(newDateIntervals);
    setTimeslots(newTimeSlots);

    let movedUpInterval = newDateIntervals[dateInterval.pos];
    let movedDownInterval = newDateIntervals[dateInterval.pos - change];

    let fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(movedUpInterval),
    };
    fetch(`/api/core/dateInterval/updateDateInterval`, fetchData).then(
      (response) => {
        if (response.ok) {
          return;
        }
      }
    );

    fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(movedDownInterval),
    };
    fetch(`/api/core/dateInterval/updateDateInterval`, fetchData).then(
      (response) => {
        if (response.ok) {
          return;
        }
      }
    );

    if (socket) {
      socket.emit("UPDATE", tripId + ":" + username + ":UPDATED_DATE_INTERVAL");
    }
  }

  return (
    <>
      <div
        id={`dateinterval-${dateInterval.id}`}
        className="bg-gray-200 m-2 ml-4 rounded-md"
      >
        <div className="flex flex-col gap-2">
          <div
            id={`dateinterval-div-top-` + dateInterval.id}
            className="min-h-6 max-h-6 rounded-t-md hover:opacity-60 flex flex-row justify-end"
            onClick={toggleDateInterval}
          >
            <svg
              id={`dateinterval-top-icon-` + dateInterval.id}
              data-accordion-icon
              className="w-3 h-3 shrink-0 mt-2 mr-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" stroke-width="2" d="M9 5 5 1 1 5" />
            </svg>
          </div>
          <div className="pl-4 pr-2 pb-2">
            <div className="flex flex-row pr-2">
              <div
                id={`dateinterval-name-view-${dateInterval.id}`}
                className="flex-grow hover:bg-gray-400 rounded-md"
                onClick={allowNameEditing}
              >
                <h2 className="font-semibold">
                  {dateInterval.name !== null ? dateInterval.name : "unnamed"}
                </h2>
              </div>
              <input
                id={`dateinterval-name-edit-${dateInterval.id}`}
                className=" hidden flex-grow rounded-md pl-4 pr-4"
                defaultValue={
                  dateInterval.name !== null ? dateInterval.name : "unnamed"
                }
                onChange={(event) =>
                  dateIntervalChanged("name", event.target.value)
                }
                onKeyDown={handleEnterKeyPress}
                onBlur={finishDateEditing}
                type="text"
              ></input>
              <img
                id={`dateinterval-enabled-icon-${dateInterval.id}`}
                src={eyeIcon}
                className="mr-4"
                width={28}
                onClick={toggleDateIntervalShow}
              ></img>
              <img
                id={`dateinterval-disabled-icon-${dateInterval.id}`}
                src={eyeIconCrossed}
                width={28}
                className="mr-4 hidden"
                onClick={toggleDateIntervalShow}
              ></img>
              {editable && (
                <RemoveDateIntervalComponent
                  jwt={jwt}
                  username={username}
                  dateIntervalId={dateInterval.id}
                  dateIntervals={dateIntervals}
                  setDateIntervals={setDateIntervals}
                  timeslots={timeslots}
                  setTimeslots={setTimeslots}
                  tripId={tripId}
                  socket={socket}
                />
              )}
            </div>

            <div
              id={`dateinterval-date-view-${dateInterval.id}`}
              className="hover:bg-gray-400 rounded-md"
              onClick={allowDateEditing}
            >
              {dateInterval.startDate === dateInterval.endDate && (
                <>{formatDate(dateInterval.startDate)}</>
              )}
              {dateInterval.startDate !== dateInterval.endDate && (
                <>
                  {formatDate(dateInterval.startDate)} -{" "}
                  {formatDate(dateInterval.endDate)}
                </>
              )}
            </div>
            <div
              id={`dateinterval-date-edit-${dateInterval.id}`}
              className="hidden flex flex-row justify-start gap-2"
              onKeyDown={handleEnterKeyPress}
              onBlur={finishDateEditing}
              contentEditable="true"
              suppressContentEditableWarning={true}
            >
              <div className="flex flex-row">
                Start:{" "}
                <input
                  id={`dateinterval-date-edit-startdate-${dateInterval.id}`}
                  type="date"
                  name="startDate"
                  defaultValue={dateSubstring(dateInterval.startDate)}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) =>
                    dateIntervalChanged("startDate", event.target.value)
                  }
                  className="rounded-md pl-2 pr-2"
                />
              </div>
              <div className="flex flex-row">
                End:
                <input
                  type="date"
                  name="endDate"
                  defaultValue={dateSubstring(dateInterval.endDate)}
                  onChange={(event) =>
                    dateIntervalChanged("endDate", event.target.value)
                  }
                  className="rounded-md pl-2 pr-2"
                />
              </div>
            </div>
            <div className="flex flex-row mb-2">
              {dateInterval.budget !== 0.0 && (
                <>
                  <p>Budget: </p>
                  <div
                    id={`dateinterval-budget-view-${dateInterval.id}`}
                    className="hover:bg-gray-400 rounded-md"
                    onClick={allowBudgetEditing}
                  >
                    &nbsp;{"$" + dateInterval.budget}&nbsp;
                  </div>
                </>
              )}
              {editable && dateInterval.budget === 0.0 && (
                <p
                  id={`dateinterval-budget-view-${dateInterval.id}`}
                  className="hover:bg-gray-400 rounded-md"
                  onClick={allowBudgetEditing}
                >
                  Add budget...
                </p>
              )}
              <input
                id={`dateinterval-budget-edit-${dateInterval.id}`}
                className=" hidden flex-grow rounded-md pl-4 pr-4"
                defaultValue={dateInterval.budget}
                onChange={(event) =>
                  dateIntervalChanged("budget", event.target.value)
                }
                onKeyDown={handleEnterKeyPress}
                onBlur={finishDateEditing}
                type="number"
              ></input>
            </div>

            <ul
              id={`dateinterval-timeslots-` + dateInterval.id}
              className="flex flex-col gap-2"
            >
              {dateIntervalTimeslots &&
                dateIntervalTimeslots.map(function (timeslot: TimeSlot) {
                  return (
                    timeslot.name !== "" && (
                      <li onClick={() => handleTimeslotClicked(timeslot)}>
                        <TimeSlotDisplayComponent
                          key={timeslot.id as string}
                          jwt={jwt}
                          username={username}
                          timeslot={timeslot}
                          timeslots={timeslots}
                          setTimeslots={setTimeslots}
                          tripId={tripId}
                          editable={editable}
                          socket={socket}
                          dateInterval={dateInterval}
                          selectedTimeslot={selectedTimeslot}
                        />
                      </li>
                    )
                  );
                })}
            </ul>
            <div id={`dateinterval-timeslots-create-` + dateInterval.id}>
              {editable && (
                <TimeSlotCreateComponent
                  jwt={jwt}
                  username={username}
                  dateInterval={dateInterval}
                  timeslots={timeslots}
                  setTimeslots={setTimeslots}
                  dateIntervalTimeslots={dateIntervalTimeslots}
                  tripId={tripId}
                  socket={socket}
                  map={map}
                  selectOnMap={selectOnMap}
                  setSelectOnMap={setSelectOnMap}
                />
              )}
            </div>
            <div className="flex flex-row gap-4 mt-2">
              {editable &&
                dateInterval.pos !== 0 &&
                dateIntervals.length >= 2 && (
                  <button
                    onClick={() => shift(1)}
                    className="text-xl font-bold hover:bg-gray-300 rounded-md pl-2 pr-2"
                  >
                    ↑
                  </button>
                )}
              {editable &&
                dateInterval.pos !== dateIntervals.length - 1 &&
                dateIntervals.length >= 2 && (
                  <button
                    onClick={() => shift(-1)}
                    className="text-xl font-bold hover:bg-gray-300 rounded-md pl-2 pr-2"
                  >
                    ↓
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DateIntervalDisplayComponent;
