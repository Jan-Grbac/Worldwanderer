import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: any;
}

function TripPublicDisplayComponent(props: Props) {
  const { trip } = { ...props };

  const navigate = useNavigate();

  function viewTrip(tripId: number) {
    navigate("/viewtrip/" + tripId);
  }

  return (
    <div
      className="border border-blackw6nn"
      onClick={() => {
        viewTrip(trip.id);
      }}
    >
      <p>{trip.name}</p>
      <p>{trip.description}</p>
      <p>{trip.rating}</p>
    </div>
  );
}

export default TripPublicDisplayComponent;
