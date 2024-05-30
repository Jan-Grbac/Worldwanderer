import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateIntervalId: string;
  timeslots: Array<Array<TimeSlot>>;
  dateIntervalTimeslots: Array<TimeSlot>;
  setTimeslots: Function;
  tripId: string;
  socket: Socket | undefined;
  map: google.maps.Map;
  selectOnMap: boolean;
  setSelectOnMap: Function;
}

function TimeSlotCreateComponent(props: Props) {
  const {
    jwt,
    username,
    dateIntervalId,
    timeslots,
    setTimeslots,
    dateIntervalTimeslots,
    tripId,
    socket,
    map,
    selectOnMap,
    setSelectOnMap,
  } = {
    ...props,
  };

  const [timeslot, setTimeslot] = useState<TimeSlot>(Object);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();

  const placesLib = useMapsLibrary("places");

  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  useEffect(() => {
    if (map && placesLib) {
      setSearchBox(
        new placesLib.Autocomplete(
          document.getElementById(
            "searchBox-" + dateIntervalId
          ) as HTMLInputElement,
          options
        )
      );
    }
  }, [map, placesLib]);

  useEffect(() => {
    if (searchBox) {
      searchBox.addListener("place_changed", () => {
        const place = searchBox.getPlace();

        if (!place.geometry || !place.geometry.location) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        let newTimeslot = { ...timeslot } as TimeSlot;

        newTimeslot.name = place.name as string;
        newTimeslot.lat = place.geometry.location.lat();
        newTimeslot.lng = place.geometry.location.lng();

        setTimeslot(newTimeslot);
      });
    }
  }, [searchBox]);

  function handleInputChange(param: string, value: any) {
    let newTimeslot = { ...timeslot } as TimeSlot;
    if (param === "name") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
    if (param === "notes") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
    if (param === "startTime") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
    if (param === "endTime") {
      newTimeslot[param] = value;
      setTimeslot(newTimeslot);
    }
  }

  function handleSubmit() {
    if (!timeslot) return;

    if (timeslot.name === undefined) {
      let hiddenNameInput = document.getElementById(
        "timeslot-name-input-hidden-" + dateIntervalId
      ) as HTMLInputElement;
      if (hiddenNameInput.value === "") {
        alert("Name cannot be empty.");
        return;
      } else {
        timeslot["name"] = hiddenNameInput.value;
        hiddenNameInput.value = "";
      }
    }
    if (timeslot.lat === undefined || timeslot.lng === undefined) {
      let hiddenLatInput = document.getElementById(
        "timeslot-lat-input-hidden-" + dateIntervalId
      ) as HTMLInputElement;
      let hiddenLngInput = document.getElementById(
        "timeslot-lng-input-hidden-" + dateIntervalId
      ) as HTMLInputElement;
      if (hiddenLatInput.value === "" || hiddenLngInput.value === "") {
        alert("You must select a place.");
        return;
      } else {
        timeslot["lat"] = Number(hiddenLatInput.value);
        timeslot["lng"] = Number(hiddenLngInput.value);
        hiddenLatInput.value = "";
        hiddenLngInput.value = "";
      }
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(timeslot),
    };
    fetch(`/api/core/timeslot/createTimeslot/${dateIntervalId}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return;
        }
      })
      .then((data) => {
        let newTimeslots = [...timeslots];
        let newDateIntervalTimeslots: Array<TimeSlot>;
        if (dateIntervalTimeslots[0].name === "") {
          newDateIntervalTimeslots = [];
        } else {
          newDateIntervalTimeslots = [...dateIntervalTimeslots];
        }

        newDateIntervalTimeslots.push(data);

        if (timeslots.length === 0) {
          newTimeslots.push(newDateIntervalTimeslots);
        } else if (dateIntervalTimeslots !== undefined) {
          for (let i = 0; i < timeslots.length; i++) {
            if (
              JSON.stringify(timeslots[i]) ===
              JSON.stringify(dateIntervalTimeslots)
            ) {
              newTimeslots[i] = newDateIntervalTimeslots;
              break;
            }
          }
        } else {
          newTimeslots.push(newDateIntervalTimeslots);
        }

        map.panTo(new google.maps.LatLng(data.lat, data.lng));

        console.log(newTimeslots);
        setTimeslots(newTimeslots);
        setTimeslot({} as TimeSlot);

        (
          document.getElementById(
            `searchBox-${dateIntervalId}`
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-name-input-` + dateIntervalId
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-notes-input-` + dateIntervalId
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-starttime-input-` + dateIntervalId
          ) as HTMLInputElement
        ).value = "--:-- --";
        (
          document.getElementById(
            `timeslot-endtime-input-` + dateIntervalId
          ) as HTMLInputElement
        ).value = "--:-- --";

        if (socket) {
          socket.emit("UPDATE", tripId + ":" + username + ":ADDED_TIMESLOT");
        }
      });
  }

  function toggleCreateDiv() {
    let div = document.getElementById("timeslot-create-div-" + dateIntervalId);
    if (div?.classList.contains("hidden")) {
      div.classList.remove("hidden");
    } else {
      div?.classList.add("hidden");
    }
  }

  function activateMapSelection() {
    setSelectOnMap(true);
    let button = document.getElementById(
      "timeslot-create-map-button-" + dateIntervalId
    );
    button?.classList.add("bg-gray-500");
  }

  useEffect(() => {
    if (!selectOnMap) {
      document
        .querySelectorAll("button[id^=timeslot-create-map-button-]")
        .forEach((button) => {
          (button as HTMLElement).classList.remove("bg-gray-500");
        });
    }
  }, [selectOnMap]);

  return (
    <>
      <div className="rounded-md bg-gray-400 mt-2">
        <div className="flex flex-row">
          <div
            className="flex-grow hover:bg-gray-500 cursor-pointer rounded-md"
            onClick={toggleCreateDiv}
          >
            <h2 className="pl-4 font-bold italic">Add new place</h2>
          </div>
        </div>
        <div
          id={`timeslot-create-div-${dateIntervalId}`}
          className="hidden flex flex-col gap-2 pl-2 pr-2 mt-2 pb-2 bg-gray-400 rounded-md"
        >
          <div className="flex flex-row">
            Name:
            <input
              id={`timeslot-name-input-${dateIntervalId}`}
              className="ml-2 rounded-md pl-4 pr-4"
              type="text"
              value={timeslot?.name}
              onChange={(event) =>
                handleInputChange("name", event.target.value)
              }
            ></input>
          </div>
          <div className="flex flex-row">
            Destination:
            <input
              id={`searchBox-${dateIntervalId}`}
              className="ml-2 rounded-md pl-4 pr-4"
            />
            <button
              id={`timeslot-create-map-button-${dateIntervalId}`}
              onClick={() => activateMapSelection()}
              className="ml-2 bg-gray-300 rounded-md hover:bg-gray-500"
            >
              🚩
            </button>
          </div>
          <input
            type="text"
            className="hidden"
            id={`timeslot-name-input-hidden-${dateIntervalId}`}
          />
          <input
            type="text"
            className="hidden"
            id={`timeslot-lat-input-hidden-${dateIntervalId}`}
          />
          <input
            type="text"
            className="hidden"
            id={`timeslot-lng-input-hidden-${dateIntervalId}`}
          />
          Notes (optional):
          <textarea
            id={`timeslot-notes-input-${dateIntervalId}`}
            className="rounded-md pl-2 pr-2"
            rows={3}
            value={timeslot?.notes}
            onChange={(event) => handleInputChange("notes", event.target.value)}
          ></textarea>
          <div className="flex flex-row justify-evenly">
            <div className="flex flex-col">
              Start time (optional):
              <input
                id={`timeslot-starttime-input-${dateIntervalId}`}
                className="rounded-md pl-2 pr-2"
                type="time"
                value={timeslot?.startTime}
                onChange={(event) =>
                  handleInputChange("startTime", event.target.value)
                }
              ></input>
            </div>
            <div className="flex flex-col">
              End time (optional):
              <input
                id={`timeslot-endtime-input-${dateIntervalId}`}
                className="rounded-md pl-2 pr-2"
                type="time"
                value={timeslot?.endTime}
                onChange={(event) =>
                  handleInputChange("endTime", event.target.value)
                }
              ></input>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="confirmButton w-max self-center mt-1"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}

export default TimeSlotCreateComponent;
