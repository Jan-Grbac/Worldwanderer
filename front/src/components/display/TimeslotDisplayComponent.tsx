import React from "react";
import RemoveTimeSlotComponent from "../remove/RemoveTimeSlotComponent";

interface Props {
  jwt: string;
  timeslot: any;
  timeslots: any;
  setTimeslots: Function;
  tripId: string;
}

function TimeSlotDisplayComponent(props: Props) {
  const { jwt, timeslot, timeslots, setTimeslots, tripId } = { ...props };

  return (
    <>
      <p>
        {timeslot.startTime} {timeslot.endTime}
      </p>
      <RemoveTimeSlotComponent
        jwt={jwt}
        timeslotId={timeslot.id}
        timeslots={timeslots}
        tripId={tripId}
      />
    </>
  );
}

export default TimeSlotDisplayComponent;
