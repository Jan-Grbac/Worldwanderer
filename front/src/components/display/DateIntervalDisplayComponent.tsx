import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import TimeSlotDisplayComponent from "./TimeSlotDisplayComponent";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateInterval: any;
  dateIntervals: any;
  timeslots: any;
  dateIntervalTimeslots: any;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
}

function DateIntervalDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    dateInterval,
    dateIntervals,
    timeslots,
    dateIntervalTimeslots,
    setTimeslots,
    tripId,
    editable,
    socket,
  } = { ...props };

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    <>
      <div className="flex">
        <p>
          Start date: {formatDate(dateInterval.startDate)} <br />
          End date: {formatDate(dateInterval.endDate)}
        </p>
        {editable && (
          <RemoveDateIntervalComponent
            jwt={jwt}
            username={username}
            dateIntervalId={dateInterval.id}
            dateIntervals={dateIntervals}
            tripId={tripId}
            socket={socket}
          />
        )}
      </div>
      {editable && (
        <TimeSlotCreateComponent
          jwt={jwt}
          username={username}
          dateIntervalId={dateInterval.id}
          timeslots={timeslots}
          dateIntervalTimeslots={dateIntervalTimeslots}
          setTimeslots={setTimeslots}
          tripId={tripId}
          socket={socket}
        />
      )}
      {dateIntervalTimeslots.map(function (timeslot: any) {
        return (
          <TimeSlotDisplayComponent
            key={timeslot.id as string}
            jwt={jwt}
            username={username}
            timeslot={timeslot}
            timeslots={dateIntervalTimeslots}
            tripId={tripId}
            editable={editable}
            socket={socket}
          />
        );
      })}
    </>
  );
}

export default DateIntervalDisplayComponent;
