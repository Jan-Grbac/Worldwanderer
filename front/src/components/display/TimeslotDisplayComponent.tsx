import { useEffect, useState } from "react";
import RemoveTimeSlotComponent from "../remove/RemoveTimeSlotComponent";
import { Socket } from "socket.io-client";
import { weatherCodeDict } from "../../assets/weather/dictionary";

interface Props {
  jwt: string;
  username: string;
  timeslot: TimeSlot;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
  dateInterval: DateInterval;
}

function TimeSlotDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    timeslot,
    timeslots,
    setTimeslots,
    tripId,
    editable,
    socket,
    dateInterval,
  } = {
    ...props,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<string>();

  function formatDateForAPICall(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    return year + "-" + month + "-" + day;
  }

  useEffect(() => {
    if (new Date(dateInterval.startDate) > new Date()) {
      const fetchData = {
        method: "GET",
      };

      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${
          timeslot.lat
        }&longitude=${timeslot.lng}&start_date=${formatDateForAPICall(
          dateInterval.startDate
        )}&end_date=${formatDateForAPICall(
          dateInterval.endDate
        )}&daily=weather_code`,
        fetchData
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return;
          }
        })
        .then((json) => {
          if (json !== undefined) {
            setWeatherData(
              JSON.parse(JSON.stringify(json)).daily.weather_code[0]
            );
          }
        });
    }
    setLoading(true);
  }, []);

  function handleEnterKeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  function toggleNotesUpdate() {
    let edit = document.getElementById("notes-edit-" + timeslot.id);
    let placeholder = document.getElementById(
      "notes-placeholder-" + timeslot.id
    );
    let content = document.getElementById("notes-content-" + timeslot.id);

    if (edit?.classList.contains("hidden")) {
      edit.classList.remove("hidden");
      placeholder?.classList.add("hidden");
      content?.classList.add("hidden");
      edit.focus();
      return;
    }

    let newTimeslot = { ...timeslot };
    newTimeslot.notes = (edit as HTMLInputElement).value;
    update(newTimeslot);

    edit?.classList.add("hidden");
    placeholder?.classList.remove("hidden");
    content?.classList.remove("hidden");
  }

  function toggleNameUpdate() {
    let edit = document.getElementById("name-edit-" + timeslot.id);
    let content = document.getElementById("name-content-" + timeslot.id);

    if (edit?.classList.contains("hidden")) {
      edit.classList.remove("hidden");
      content?.classList.add("hidden");
      edit.focus();
      return;
    }

    let newTimeslot = { ...timeslot };
    newTimeslot.name = (edit as HTMLInputElement).value;
    update(newTimeslot);

    edit?.classList.add("hidden");
    content?.classList.remove("hidden");
  }

  function toggleStartTimeUpdate() {
    let edit = document.getElementById("starttime-edit-" + timeslot.id);
    let placeholder = document.getElementById(
      "starttime-placeholder-" + timeslot.id
    );
    let content = document.getElementById("starttime-content-" + timeslot.id);

    if (edit?.classList.contains("hidden")) {
      edit.classList.remove("hidden");
      placeholder?.classList.add("hidden");
      content?.classList.add("hidden");
      edit.focus();
      return;
    }

    let newTimeslot = { ...timeslot };
    newTimeslot.startTime = (edit as HTMLInputElement).value;
    update(newTimeslot);

    edit?.classList.add("hidden");
    placeholder?.classList.remove("hidden");
    content?.classList.remove("hidden");
  }

  function toggleEndTimeUpdate() {
    let edit = document.getElementById("endtime-edit-" + timeslot.id);
    let placeholder = document.getElementById(
      "endtime-placeholder-" + timeslot.id
    );
    let content = document.getElementById("endtime-content-" + timeslot.id);

    if (edit?.classList.contains("hidden")) {
      edit.classList.remove("hidden");
      placeholder?.classList.add("hidden");
      content?.classList.add("hidden");
      edit.focus();
      return;
    }

    let newTimeslot = { ...timeslot };
    newTimeslot.endTime = (edit as HTMLInputElement).value;
    update(newTimeslot);

    edit?.classList.add("hidden");
    placeholder?.classList.remove("hidden");
    content?.classList.remove("hidden");
  }

  function update(newTimeslot: TimeSlot) {
    let newTimeslots = JSON.parse(JSON.stringify(timeslots));

    for (let i = 0; i < timeslots.length; i++) {
      for (let j = 0; j < timeslots[i].length; j++) {
        if (timeslots[i][j].id === timeslot.id) {
          newTimeslots[i][j] = newTimeslot;
          console.log(i, j);
          break;
        }
      }
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTimeslot),
    };
    fetch(`/api/core/timeslot/updateTimeslot/${timeslot.id}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        }
      })
      .then(() => {
        if (socket) {
          socket.emit("UPDATE", tripId + ":" + username + ":UPDATED_TIMESLOT");
        }
      });

    setTimeslots(newTimeslots);
  }

  return (
    loading && (
      <div className="flex flex-col bg-gray-400 rounded-md p-2">
        <div>
          <div className="flex flex-row">
            <div className="flex flex-row gap-2 flex-grow justify-start">
              <h3
                id={`name-content-` + timeslot.id}
                className="font-medium italic"
                onDoubleClick={toggleNameUpdate}
              >
                {timeslot.name}
              </h3>
              <input
                id={`name-edit-` + timeslot.id}
                type="text"
                className="hidden rounded-md pl-2 pr-2"
                defaultValue={timeslot.name}
                onKeyDown={handleEnterKeyPress}
                onBlur={toggleNameUpdate}
              ></input>
              {weatherData && (
                <img
                  height={32}
                  width={32}
                  src={`../../../src/assets/weather/${
                    (weatherCodeDict as any)[weatherData as any] as string
                  }`}
                ></img>
              )}
            </div>
            {editable && timeslots.length !== 0 && (
              <RemoveTimeSlotComponent
                jwt={jwt}
                username={username}
                timeslotId={timeslot.id}
                timeslots={timeslots}
                setTimeslots={setTimeslots}
                tripId={tripId}
                socket={socket}
              />
            )}
          </div>
          {!timeslot.notes && (
            <div
              id={`notes-placeholder-` + timeslot.id}
              className="italic font-thin ml-2"
              onDoubleClick={toggleNotesUpdate}
            >
              Add notes...
            </div>
          )}
          {timeslot.notes && (
            <>
              <div
                id={`notes-content-` + timeslot.id}
                className="italic font-thin ml-2"
                onDoubleClick={toggleNotesUpdate}
              >
                {timeslot.notes}
              </div>
            </>
          )}
          <textarea
            id={`notes-edit-` + timeslot.id}
            onKeyDown={handleEnterKeyPress}
            onBlur={toggleNotesUpdate}
            rows={3}
            placeholder="Notes..."
            defaultValue={timeslot.notes}
            className="hidden rounded-md pl-2 pr-2 ml-2"
          ></textarea>
          {timeslot.startTime && (
            <p
              id={`starttime-content-` + timeslot.id}
              className="font-thin ml-2"
              onDoubleClick={toggleStartTimeUpdate}
            >
              From: {timeslot.startTime}
            </p>
          )}
          {!timeslot.startTime && (
            <p
              id={`starttime-placeholder-` + timeslot.id}
              className="italic font-thin ml-2"
              onDoubleClick={toggleStartTimeUpdate}
            >
              Add start time...
            </p>
          )}
          <input
            id={`starttime-edit-` + timeslot.id}
            type="time"
            className="hidden rounded-md pl-2 pr-2 ml-2"
            defaultValue={timeslot.startTime}
            onKeyDown={handleEnterKeyPress}
            onBlur={toggleStartTimeUpdate}
          ></input>
          {timeslot.endTime && (
            <p
              id={`endtime-content-` + timeslot.id}
              className="font-thin ml-2"
              onDoubleClick={toggleEndTimeUpdate}
            >
              To: {timeslot.endTime}
            </p>
          )}
          {!timeslot.endTime && (
            <p
              id={`endtime-placeholder-` + timeslot.id}
              className="italic font-thin ml-2"
              onDoubleClick={toggleEndTimeUpdate}
            >
              Add end time...
            </p>
          )}
          <input
            id={`endtime-edit-` + timeslot.id}
            type="time"
            className="hidden rounded-md pl-2 pr-2 ml-2"
            defaultValue={timeslot.endTime}
            onKeyDown={handleEnterKeyPress}
            onBlur={toggleEndTimeUpdate}
          ></input>
        </div>
      </div>
    )
  );
}

export default TimeSlotDisplayComponent;
