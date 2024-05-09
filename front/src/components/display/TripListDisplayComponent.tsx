import React from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";

interface Props {
  jwt: string;
  ownedTrips: Array<Trip>;
  setOwnedTrips: Function;
  sharedTrips: Array<Trip>;
}

function TripListDisplayComponent(props: Props) {
  const { jwt, ownedTrips, setOwnedTrips, sharedTrips } = { ...props };
  const navigate = useNavigate();

  function handleOnTripClick(id: string) {
    navigate("/edittrip/" + id);
  }

  return (
    <>
      Your trips:
      {ownedTrips.map(function (trip: Trip) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClick(trip.id)}>
              {trip.name} {trip.description}
            </button>
            <RemoveTripComponent
              jwt={jwt}
              tripId={trip.id}
              trips={ownedTrips}
              setTrips={setOwnedTrips}
            />
          </div>
        );
      })}
      <br />
      Shared with you:
      {sharedTrips.map(function (trip: Trip) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClick(trip.id)}>
              {trip.name} {trip.description}
            </button>
          </div>
        );
      })}
    </>
  );
}

export default TripListDisplayComponent;
