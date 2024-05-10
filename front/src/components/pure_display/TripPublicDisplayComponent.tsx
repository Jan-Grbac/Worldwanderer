import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: Trip;
}

function TripPublicDisplayComponent(props: Props) {
  const { trip } = { ...props };
  const navigate = useNavigate();

  function viewTrip(tripId: string) {
    navigate("/viewtrip/" + tripId);
  }

  return (
    <div
      className="border border-black"
      onClick={() => {
        viewTrip(trip.id);
      }}
    >
      <p>{trip.name}</p>
      <p>{trip.description}</p>
      <p>{trip.rating}</p>

      <p>Made by: {trip.ownerUsername}</p>
    </div>
  );
}

export default TripPublicDisplayComponent;
