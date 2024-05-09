import React, { useEffect } from "react";
import RemoveTimeSlotComponent from "../remove/RemoveTimeSlotComponent";

interface Props {
  jwt: string;
  timeslot: any;
  timeslots: any;
  tripId: string;
  editable: boolean;
}

function TimeSlotDisplayComponent(props: Props) {
  const { jwt, timeslot, timeslots, tripId, editable } = {
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
          timeslotId={timeslot.id}
          timeslots={timeslots}
          tripId={tripId}
        />
      )}
    </>
  );
}

export default TimeSlotDisplayComponent;
