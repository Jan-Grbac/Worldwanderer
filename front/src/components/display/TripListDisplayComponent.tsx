import React from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";

interface Props {
  jwt: string;
  trips: any;
  setTrips: Function;
}

function TripListDisplayComponent(props: Props) {
  const { jwt, trips, setTrips } = { ...props };
  const navigate = useNavigate();

  function handleOnTripClick(id: number) {
    navigate("/edittrip/" + id);
  }

  return (
    <>
      {trips.map(function (trip: any) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClick(trip.id)}>
              {trip.name} {trip.description}
            </button>
            <RemoveTripComponent
              jwt={jwt}
              tripId={trip.id}
              trips={trips}
              setTrips={setTrips}
            />
          </div>
        );
      })}
    </>
  );
}

export default TripListDisplayComponent;
