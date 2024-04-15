import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  trips: Array<Object>;
}

function TripListComponent(props: Props) {
  const { trips } = { ...props };
  const navigate = useNavigate();

  function handleOnTripClick(id: number) {
    navigate("/edittrip/" + id);
  }

  return (
    <>
      {trips.map(function (trip: any) {
        return (
          <>
            <button onClick={(event) => handleOnTripClick(trip.id)}>
              {trip.name} {trip.description}
            </button>
          </>
        );
      })}
    </>
  );
}

export default TripListComponent;
