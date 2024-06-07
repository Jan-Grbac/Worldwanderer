import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { colorDict } from "../../assets/colors/colorDictionary";
import { toast } from "react-toastify";

interface Props {
  jwt: string;
  username: string;
  dateInterval: DateInterval;
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
    dateInterval,
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
            "searchBox-" + dateInterval.id
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
          toast.error("No details available for input: '" + place.name + "'");
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
        "timeslot-name-input-hidden-" + dateInterval.id
      ) as HTMLInputElement;
      if (hiddenNameInput.value === "") {
        toast.error("Name cannot be empty.");
        return;
      } else {
        timeslot["name"] = hiddenNameInput.value;
        hiddenNameInput.value = "";
      }
    }
    if (timeslot.lat === undefined || timeslot.lng === undefined) {
      let hiddenLatInput = document.getElementById(
        "timeslot-lat-input-hidden-" + dateInterval.id
      ) as HTMLInputElement;
      let hiddenLngInput = document.getElementById(
        "timeslot-lng-input-hidden-" + dateInterval.id
      ) as HTMLInputElement;
      if (hiddenLatInput.value === "" || hiddenLngInput.value === "") {
        toast.error("You must select a place.");
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
    fetch(`/api/core/timeslot/createTimeslot/${dateInterval.id}`, fetchData)
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
        if (
          dateIntervalTimeslots.length === 0 ||
          dateIntervalTimeslots[0].name === ""
        ) {
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
            `searchBox-${dateInterval.id}`
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-name-input-` + dateInterval.id
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-notes-input-` + dateInterval.id
          ) as HTMLInputElement
        ).value = "";
        (
          document.getElementById(
            `timeslot-starttime-input-` + dateInterval.id
          ) as HTMLInputElement
        ).value = "--:-- --";
        (
          document.getElementById(
            `timeslot-endtime-input-` + dateInterval.id
          ) as HTMLInputElement
        ).value = "--:-- --";

        if (socket) {
          socket.emit("UPDATE", tripId + ":" + username + ":ADDED_TIMESLOT");
        }
      });
  }

  function toggleCreateDiv() {
    let div = document.getElementById("timeslot-create-div-" + dateInterval.id);
    if (div?.classList.contains("hidden")) {
      div.classList.remove("hidden");
    } else {
      div?.classList.add("hidden");
    }
  }

  function activateMapSelection() {
    setSelectOnMap(true);
    let button = document.getElementById(
      "timeslot-create-map-button-" + dateInterval.id
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

  useEffect(() => {
    let div = document.getElementById("timeslot-create-div-" + dateInterval.id);
    if (!div) return;

    div.style.borderColor = colorDict[dateInterval.pos % 20];
  }, []);

  return (
    <>
      <div className="rounded-md bg-gray-100 mt-2">
        <div className="flex flex-row">
          <div
            className="flex-grow hover:bg-gray-200 cursor-pointer rounded-md"
            onClick={toggleCreateDiv}
          >
            <h2 className="pl-4 font-bold">Add new place</h2>
          </div>
        </div>
        <div
          id={`timeslot-create-div-${dateInterval.id}`}
          className="hidden grid grid-rows-7 grid-cols-3 pl-2 pr-2 mt-2 pb-2 bg-gray-100 rounded-md max-h-96 border-b-4"
        >
          <strong className="pl-4 pt-2">Name:</strong>
          <input
            id={`timeslot-name-input-${dateInterval.id}`}
            className="rounded-md pl-4 pr-4 col-span-2 m-1 mb-2 mt-2"
            type="text"
            value={timeslot?.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
          <strong className="pl-4 pt-2">Destination:</strong>
          <div className="col-span-2">
            <input
              id={`searchBox-${dateInterval.id}`}
              className="rounded-md pl-4 pr-4 m-1"
            />
            <button
              id={`timeslot-create-map-button-${dateInterval.id}`}
              onClick={() => activateMapSelection()}
              className="ml-2 bg-gray-300 rounded-md hover:bg-gray-500 m-1"
            >
              🚩
            </button>
          </div>
          <input
            type="text"
            className="hidden col-span-2"
            id={`timeslot-name-input-hidden-${dateInterval.id}`}
          />
          <input
            type="text"
            className="hidden col-span-2"
            id={`timeslot-lat-input-hidden-${dateInterval.id}`}
          />
          <input
            type="text"
            className="hidden col-span-2"
            id={`timeslot-lng-input-hidden-${dateInterval.id}`}
          />
          <strong className="col-span-3 max-h-2 pl-4 pt-2">
            Notes (optional):
          </strong>
          <textarea
            id={`timeslot-notes-input-${dateInterval.id}`}
            className="rounded-md ml-4 mb-2 p-1 col-span-3"
            rows={4}
            value={timeslot?.notes}
            onChange={(event) => handleInputChange("notes", event.target.value)}
          ></textarea>
          <strong className="pl-4 pt-2">Start time (optional):</strong>
          <input
            id={`timeslot-starttime-input-${dateInterval.id}`}
            className="rounded-md pl-2 pr-2 col-span-2 m-1"
            type="time"
            value={timeslot?.startTime}
            onChange={(event) =>
              handleInputChange("startTime", event.target.value)
            }
          ></input>
          <strong className="pl-4 pt-2">End time (optional):</strong>
          <input
            id={`timeslot-endtime-input-${dateInterval.id}`}
            className="rounded-md pl-2 pr-2 col-span-2 m-1"
            type="time"
            value={timeslot?.endTime}
            onChange={(event) =>
              handleInputChange("endTime", event.target.value)
            }
          ></input>
          <div className="flex justify-center col-start-2">
            <button
              onClick={handleSubmit}
              className="confirmButton w-max self-center mt-1"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeSlotCreateComponent;
