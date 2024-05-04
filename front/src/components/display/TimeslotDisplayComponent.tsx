import React from "react";

interface Props {
  jwt: string;
  timeslot: any;
}

function TimeslotDisplayComponent(props: Props) {
  const { jwt, timeslot } = { ...props };

  return (
    <>
      <p>
        {timeslot.startTime} {timeslot.endTime}
      </p>
    </>
  );
}

export default TimeslotDisplayComponent;
