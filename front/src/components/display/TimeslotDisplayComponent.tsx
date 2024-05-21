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

  return (
    loading && (
      <div className="flex flex-col bg-gray-400 rounded-md p-2">
        <div>
          <div className="flex flex-row">
            <div className="flex flex-row gap-2 flex-grow justify-start">
              <h3 className="font-medium italic">{timeslot.name}</h3>
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
          {timeslot.notes && <p>Notes: {timeslot.notes}</p>}
          {timeslot.startTime && timeslot.endTime && (
            <p>
              From: {timeslot.startTime}, To: {timeslot.endTime}
            </p>
          )}
          {!timeslot.startTime && (
            <p className="italic font-thin">Add start time...</p>
          )}
          {!timeslot.endTime && (
            <p className="italic font-thin">Add start time...</p>
          )}
          {!timeslot.notes && <p className="italic font-thin">Add notes...</p>}
        </div>
      </div>
    )
  );
}

export default TimeSlotDisplayComponent;
