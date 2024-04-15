import React, { useState } from "react";

interface Props {
  trip: any;
  dateIntervals: any;
}

function TripDataComponent(props: Props) {
  const { trip, dateIntervals } = { ...props };

  return (
    <>
      <p>Trip name: {trip.name}</p>
      <p>Trip description: {trip.description}</p>
      {dateIntervals.map(function (dateInterval: any) {
        return (
          <>
            <p>
              {dateInterval.startDate} {dateInterval.endDate}
            </p>
          </>
        );
      })}
    </>
  );
}

export default TripDataComponent;
