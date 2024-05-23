import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import TimeSlotDisplayComponent from "./TimeSlotDisplayComponent";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

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
  map: google.maps.Map;
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
    map,
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
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
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
      let oldSelected = document.getElementById(
        "timeslot-" + selectedTimeslot.id
      );
      if (oldSelected) {
        oldSelected.classList.remove("border-red-400");
      }
    }

    let newSelected = document.getElementById(
      "timeslot-" + timeslot.id
    ) as HTMLElement;
    newSelected.classList.add("border-red-400");

    setSelectedTimeslot(timeslot);
  }

  function allowNameEditing() {
    console.log(dateInterval.name);
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

  return (
    <>
      <div className="bg-gray-200 m-2 ml-4 p-2 pl-4 rounded-md">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row pr-2">
            <div
              id={`dateinterval-name-view-${dateInterval.id}`}
              className="flex-grow"
              onDoubleClick={allowNameEditing}
            >
              <h2 className="italic font-semibold">
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
            onDoubleClick={allowDateEditing}
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
        </div>
        <div className="flex flex-row mb-2">
          <p>Budget: $</p>
          <div
            id={`dateinterval-budget-view-${dateInterval.id}`}
            onDoubleClick={allowBudgetEditing}
          >
            {dateInterval.budget}
          </div>
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

        <ul className="flex flex-col gap-2">
          {dateIntervalTimeslots &&
            dateIntervalTimeslots.map(function (timeslot: TimeSlot) {
              return (
                <li
                  id={`timeslot-${timeslot.id}`}
                  onClick={() => handleTimeslotClicked(timeslot)}
                >
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
                  />
                </li>
              );
            })}
        </ul>
        {editable && (
          <TimeSlotCreateComponent
            jwt={jwt}
            username={username}
            dateIntervalId={dateInterval.id}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            dateIntervalTimeslots={dateIntervalTimeslots}
            tripId={tripId}
            socket={socket}
            map={map}
          />
        )}
      </div>
    </>
  );
}

export default DateIntervalDisplayComponent;
