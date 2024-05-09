import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import $ from "jquery";

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

  const [timeslot, setTimeslot] = useState<TimeSlot>();
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  useEffect(() => {
    if (window.google) {
      setGoogleMapsLoaded(true);
    }
  }, [window.google]);

  useEffect(() => {
    if (googleMapsLoaded && typeof google !== "undefined") {
      setSearchBox(
        new google.maps.places.Autocomplete(
          document.getElementById(
            "searchBox-" + dateIntervalId
          ) as HTMLInputElement,
          options
        )
      );
    }
  }, [googleMapsLoaded]);

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
      alert("Name cannot be empty.");
      return;
    }
    if (timeslot.lat === undefined || timeslot.lng === undefined) {
      alert("You must select a place.");
      return;
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
        let newDateIntervalTimeslots = [...dateIntervalTimeslots];

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

        $("input").val();

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
          Name:
          <input
            type="text"
            value={timeslot?.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
          <br />
          Notes:
          <input
            type="text"
            value={timeslot?.notes}
            onChange={(event) => handleInputChange("notes", event.target.value)}
          ></input>
          <br />
          Start time:
          <input
            type="time"
            value={timeslot?.startTime}
            onChange={(event) =>
              handleInputChange("startTime", event.target.value)
            }
          ></input>
          End time:
          <input
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
