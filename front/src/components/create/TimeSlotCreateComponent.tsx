import GoogleMap from "google-maps-react-markers";
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
  } = {
    ...props,
  };

  const [timeslot, setTimeslot] = useState<TimeSlot>(Object);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();
  const [loadAfter, setLoadAfter] = useState<boolean>(false);

  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadAfter(true);
    }, 200);
  });

  useEffect(() => {
    if (typeof google !== "undefined") {
      setSearchBox(
        new google.maps.places.Autocomplete(
          document.getElementById(
            "searchBox-" + dateIntervalId
          ) as HTMLInputElement,
          options
        )
      );
    }
  }, [window.google, loadAfter]);

  useEffect(() => {
    if (searchBox) {
      searchBox.addListener("place_changed", () => {
        const place = searchBox.getPlace();

        console.log(place);

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
        if (dateIntervalTimeslots === undefined) {
          newDateIntervalTimeslots = [];
        } else {
          newDateIntervalTimeslots = [...dateIntervalTimeslots];
        }

        newDateIntervalTimeslots.push(data);

        if (timeslots.length === 0) {
          newTimeslots.push(newDateIntervalTimeslots);
        } else {
          for (let i = 0; i < timeslots.length; i++) {
            if (
              JSON.stringify(timeslots[i]) ===
              JSON.stringify(dateIntervalTimeslots)
            ) {
              newTimeslots[i] = newDateIntervalTimeslots;
              break;
            }
          }
        }

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

  return (
    <>
      <div className="d-flex flex-row">
        <div>
          Destination:
          <input id={`searchBox-${dateIntervalId}`} />
          <input
            type="text"
            className="d-none"
            id={`timeslot-name-input-hidden-${dateIntervalId}`}
          />
          <input
            type="text"
            className="d-none"
            id={`timeslot-lat-input-hidden-${dateIntervalId}`}
          />
          <input
            type="text"
            className="d-none"
            id={`timeslot-lng-input-hidden-${dateIntervalId}`}
          />
          Name:
          <input
            id={`timeslot-name-input-${dateIntervalId}`}
            type="text"
            value={timeslot?.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
          <br />
          Notes:
          <input
            id={`timeslot-notes-input-${dateIntervalId}`}
            type="text"
            value={timeslot?.notes}
            onChange={(event) => handleInputChange("notes", event.target.value)}
          ></input>
          <br />
          Start time:
          <input
            id={`timeslot-starttime-input-${dateIntervalId}`}
            type="time"
            value={timeslot?.startTime}
            onChange={(event) =>
              handleInputChange("startTime", event.target.value)
            }
          ></input>
          End time:
          <input
            id={`timeslot-endtime-input-${dateIntervalId}`}
            type="time"
            value={timeslot?.endTime}
            onChange={(event) =>
              handleInputChange("endTime", event.target.value)
            }
          ></input>
        </div>
        <div>
          <br />
          <br />
          <button onClick={handleSubmit}>+</button>
        </div>
      </div>
    </>
  );
}

export default TimeSlotCreateComponent;
