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

  const [searchLoaded, setSearchLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    loadScript(
      "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
      () => {
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/js/countrySelect.min.js",
          () => {
            ($ as any)(document).ready(() => {
              ($("#country") as any).countrySelect();
            });
            setSearchLoaded(true);
          }
        );
      }
    );

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/css/countrySelect.min.css";
    document.head.appendChild(link);
  }, [loading]);

  useEffect(() => {
    if (searchLoaded) {
      setLoading(true);
    }
  }, [searchLoaded]);

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
    fetch(`/api/core/trip/updateTrip`, fetchData).then((response) => {
      if (response.ok) {
        return;
      }
    });

    if (socket) {
      socket.emit("UPDATE", trip.id + ":" + username + ":TRIP_PARAMS_UPDATED");
    }

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

  function toggleCountriesEdit() {
    let buttons = document.getElementsByClassName("country-delete-button");
    let edit = document.getElementById("countries-edit");
    if (edit?.classList.contains("hidden")) {
      edit.classList.remove("hidden");
      if (buttons.length > 1) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove("hidden");
        }
      }
    } else {
      edit?.classList.add("hidden");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("hidden");
      }
      handleTripChanged();
    }
  }

  function addCountry() {
    let newTrip = { ...trip };

    let country_code = String(
      ($("#country_code") as JQuery<HTMLInputElement>).val()
    );

    if (!newTrip.countries.includes(country_code)) {
      newTrip.countries.push(country_code);
    }

    setTrip(newTrip);
  }

  useEffect(() => {
    let edit = document.getElementById("countries-edit");
    let buttons = document.getElementsByClassName("country-delete-button");

    if (!edit?.classList.contains("hidden")) {
      if (buttons.length > 1) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove("hidden");
        }
      }
    }
  }, [trip]);

  function removeCountry(country: string) {
    let newTrip = { ...trip };
    newTrip.countries.splice(newTrip.countries.indexOf(country), 1);

    setTrip(newTrip);
  }

  return (
    searchLoaded && (
      <>
        <div className="bg-white rounded-md border-l-2 border-orange-400 m-2 p-4">
          <div className="flex flex-col">
            <h2 className="font-bold">Trip name</h2>
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
            <h2 className="font-bold">Trip description</h2>
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
                <h2 className="font-bold">Countries</h2>
                <div
                  id="countries-view"
                  className="flex flex-row gap-2 hover:bg-gray-100 rounded-md"
                  onClick={toggleCountriesEdit}
                >
                  {trip.countries.map(function (country: string) {
                    {
                      return (
                        <>
                          <div className="flex flex-row gap-1 mr-2">
                            <div className="w-10">
                              {getFlagComponent(country)}
                            </div>
                            <button
                              className="w-max hidden country-delete-button"
                              onClick={() => removeCountry(country)}
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </>
            )}
            <div
              id="countries-edit"
              className="hidden mt-2 flex flex-row gap-2"
            >
              <input
                type="text"
                id="country"
                className="rounded-md p-2 bg-gray-100"
              />
              <input type="hidden" id="country_code" />
              <button className="confirmButton w-max" onClick={addCountry}>
                Add country
              </button>
            </div>
          </div>
        </div>
        <hr className="border border-orange-400 ml-6 mr-6 rounded-md" />
        <div className="bg-gray-100 border-l-2 border-orange-500 m-2 rounded-md">
          <div
            className="flex-grow hover:bg-gray-400 cursor-pointer rounded-md"
            onClick={toggleDataDiv}
          >
            <h2 className="pl-4 font-bold">Trip sections</h2>
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
    )
  );
}

export default TripDataDisplayComponent;
