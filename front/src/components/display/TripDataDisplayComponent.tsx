import DateIntervalDisplayComponent from "./DateIntervalDisplayComponent";
import DateIntervalCreateComponent from "../create/DateIntervalCreateComponent";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

interface Props {
  jwt: string;
  trip: Trip;
  setTrip: Function;
  username: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  editable: boolean;
  socket: Socket | undefined;
  selectedTimeslot: TimeSlot;
  setSelectedTimeslot: Function;
  selectedDateInterval: DateInterval;
  setSelectedDateInterval: Function;
  map: google.maps.Map;
}

function TripDataDisplayComponent(props: Props) {
  const {
    jwt,
    trip,
    setTrip,
    username,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    editable,
    socket,
    selectedTimeslot,
    setSelectedTimeslot,
    selectedDateInterval,
    setSelectedDateInterval,
    map,
  } = { ...props };

  function handleTripChanged() {
    let newTrip = { ...trip };
    newTrip.name = (
      document.getElementById("trip-name-edit") as HTMLInputElement
    ).value;
    newTrip.description = (
      document.getElementById("trip-description-edit") as HTMLInputElement
    ).value;

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTrip),
    };
    fetch(`/api/core/trip/updateTrip`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        } else {
          alert("wotf?");
        }
      })
      .then(() => {
        if (socket) {
          socket.emit(
            "UPDATE",
            trip.id + ":" + username + ":TRIP_PARAMS_UPDATED"
          );
        }
      });

    setTrip(newTrip);

    document.getElementById("trip-name-edit")?.classList.add("hidden");
    document.getElementById("trip-description-edit")?.classList.add("hidden");

    document.getElementById("trip-name-view")?.classList.remove("hidden");
    document
      .getElementById("trip-description-view")
      ?.classList.remove("hidden");
  }

  function handleEnterKeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  function allowNameEditing() {
    if (!editable) return;
    document.getElementById("trip-name-view")?.classList.add("hidden");
    document.getElementById("trip-name-edit")?.classList.remove("hidden");
    document.getElementById("trip-name-edit")?.focus();
  }
  function allowDescriptionEditing() {
    if (!editable) return;
    document.getElementById("trip-description-view")?.classList.add("hidden");
    document
      .getElementById("trip-description-edit")
      ?.classList.remove("hidden");
    document.getElementById("trip-description-edit")?.focus();
  }

  function handleDateIntervalClicked(dateInterval: DateInterval) {
    if (selectedDateInterval) {
      let oldSelected = document.getElementById(
        "dateinterval-" + selectedDateInterval.id
      );
    }

    let newSelected = document.getElementById(
      "dateinterval-" + dateInterval.id
    );

    setSelectedDateInterval({ ...dateInterval });
    console.log("Selected date interval: " + dateInterval);
  }

  const getFlagComponent = (countryCode: string) => {
    const upperCaseCountryCode = countryCode.toUpperCase();
    const FlagComponent = (FlagIcons as any)[upperCaseCountryCode];
    return FlagComponent ? <FlagComponent /> : null;
  };

  function toggleDataDiv() {
    let div = document.getElementById("dateintervals-div");
    if (div?.classList.contains("hidden")) {
      div.classList.remove("hidden");
    } else {
      div?.classList.add("hidden");
    }
  }

  return (
    <>
      <div className="bg-gray-200 rounded-md m-2 p-4">
        <div className="flex flex-col">
          <h2 className="font-bold italic">Trip name</h2>
          <div
            id="trip-name-view"
            className="hover:bg-gray-100 rounded-md"
            onDoubleClick={allowNameEditing}
          >
            {trip.name}
          </div>
          <input
            type="text"
            id="trip-name-edit"
            className="hidden"
            contentEditable="true"
            defaultValue={trip.name}
            onKeyDownCapture={handleEnterKeyPress}
            onBlur={handleTripChanged}
            suppressContentEditableWarning={true}
          ></input>
          <h2 className="font-bold italic">Trip description</h2>
          <div
            id="trip-description-view"
            className="hover:bg-gray-100 rounded-md"
            onDoubleClick={allowDescriptionEditing}
          >
            {trip.description}
          </div>
          <textarea
            id="trip-description-edit"
            className="hidden"
            contentEditable="true"
            rows={3}
            defaultValue={trip.description}
            onKeyDownCapture={handleEnterKeyPress}
            onBlur={handleTripChanged}
            suppressContentEditableWarning={true}
          ></textarea>
          {trip.country !== undefined && (
            <>
              <h2 className="font-bold italic">Country</h2>
              <div id="trip-description-view" className="w-10">
                {getFlagComponent(trip.country)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-gray-300 m-2 rounded-md">
        <div
          className="flex-grow hover:bg-gray-400 cursor-pointer rounded-md"
          onClick={toggleDataDiv}
        >
          <h2 className="pl-4 font-bold italic">Trip sections</h2>
        </div>
        <div id="dateintervals-div" className="hidden pb-2">
          <ul>
            {dateIntervals &&
              dateIntervals.map(function (
                dateInterval: DateInterval,
                index: number
              ) {
                return (
                  <li
                    id={`dateinterval-${dateInterval.id}`}
                    onClick={() => handleDateIntervalClicked(dateInterval)}
                  >
                    <DateIntervalDisplayComponent
                      key={dateInterval.id as string}
                      jwt={jwt}
                      username={username}
                      dateInterval={dateInterval}
                      dateIntervals={dateIntervals}
                      setDateIntervals={setDateIntervals}
                      timeslots={timeslots}
                      setTimeslots={setTimeslots}
                      dateIntervalTimeslots={timeslots[index]}
                      tripId={trip.id}
                      editable={editable}
                      socket={socket}
                      selectedTimeslot={selectedTimeslot}
                      setSelectedTimeslot={setSelectedTimeslot}
                      map={map}
                    />
                  </li>
                );
              })}
          </ul>
          {editable && (
            <DateIntervalCreateComponent
              jwt={jwt}
              tripId={trip.id}
              username={username}
              dateIntervals={dateIntervals}
              setDateIntervals={setDateIntervals}
              socket={socket}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TripDataDisplayComponent;
