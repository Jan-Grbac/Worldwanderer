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
  selectOnMap: boolean;
  setSelectOnMap: Function;
  map: google.maps.Map;
  renderArray: Array<boolean>;
  setRenderArray: Function;
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
    selectOnMap,
    setSelectOnMap,
    map,
    renderArray,
    setRenderArray,
  } = { ...props };

  function handleTripChanged() {
    let newTrip = { ...trip };
    newTrip.name = (
      document.getElementById("trip-name-edit") as HTMLInputElement
    ).value;

    if (newTrip.name === "") {
      document.getElementById("trip-name-edit")?.classList.add("hidden");
      document.getElementById("trip-name-view")?.classList.remove("hidden");
      alert("Name cannot be empty.");
      return;
    }

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
      if (dateInterval.id === selectedDateInterval.id) return;
    }

    setSelectedDateInterval({ ...dateInterval });
    if (
      selectedTimeslot &&
      selectedTimeslot.dateIntervalId != dateInterval.id
    ) {
      console.log(selectedTimeslot.id, dateInterval.id);
      let firstTimeslot = timeslots[dateInterval.pos][0];
      if (firstTimeslot.lat !== 0 && firstTimeslot.lng !== 0) {
        setSelectedTimeslot({ ...firstTimeslot });
        map.panTo(new google.maps.LatLng(firstTimeslot.lat, firstTimeslot.lng));
      } else {
        let div = document.getElementById("timeslot-" + selectedTimeslot.id);
        div?.classList.remove("border-2", "border-black");
        setSelectedTimeslot(undefined);
      }
    }
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
      <div className="bg-white rounded-md border-l-2 border-orange-400 m-2 p-4">
        <div className="flex flex-col">
          <h2 className="font-bold italic">Trip name</h2>
          <div
            id="trip-name-view"
            className="hover:bg-gray-100 rounded-md"
            onClick={allowNameEditing}
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
            onClick={allowDescriptionEditing}
          >
            {trip.description === "" || trip.description === null
              ? "Add description..."
              : trip.description}
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
          {trip.countries !== undefined && (
            <>
              <h2 className="font-bold italic">Countries</h2>
              <div className="flex flex-row gap-2">
                {trip.countries.map(function (country: string) {
                  {
                    return (
                      <div className="w-10">{getFlagComponent(country)}</div>
                    );
                  }
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <hr className="border border-orange-400 ml-6 mr-6 rounded-md" />
      <div className="bg-gray-100 border-l-2 border-orange-500 m-2 rounded-md">
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
                  <li onClick={() => handleDateIntervalClicked(dateInterval)}>
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
                      selectedDateInterval={selectedDateInterval}
                      selectOnMap={selectOnMap}
                      setSelectOnMap={setSelectOnMap}
                      map={map}
                      renderArray={renderArray}
                      setRenderArray={setRenderArray}
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
              timeslots={timeslots}
              setTimeslots={setTimeslots}
              socket={socket}
              renderArray={renderArray}
              setRenderArray={setRenderArray}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TripDataDisplayComponent;
