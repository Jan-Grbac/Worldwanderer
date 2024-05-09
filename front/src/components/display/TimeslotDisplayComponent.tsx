import React, { useEffect } from "react";
import RemoveTimeSlotComponent from "../remove/RemoveTimeSlotComponent";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  timeslot: any;
  timeslots: any;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
}

function TimeSlotDisplayComponent(props: Props) {
  const { jwt, username, timeslot, timeslots, tripId, editable, socket } = {
    ...props,
  };

  return (
    <>
      <p>
        {timeslot.startTime} {timeslot.endTime}
      </p>
      {editable && timeslots.length !== 0 && (
        <RemoveTimeSlotComponent
          jwt={jwt}
          username={username}
          timeslotId={timeslot.id}
          timeslots={timeslots}
          tripId={tripId}
          socket={socket}
        />
      )}
    </>
  );
}

export default TimeSlotDisplayComponent;
