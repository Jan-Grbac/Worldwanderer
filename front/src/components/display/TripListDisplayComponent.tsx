import React from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";

interface Props {
  jwt: string;
  ownedTrips: Array<Trip>;
  setOwnedTrips: Function;
  sharedTrips: Array<Trip>;
  publishedTrips: Array<Trip>;
  setPublishedTrips: Function;
}

function TripListDisplayComponent(props: Props) {
  const {
    jwt,
    ownedTrips,
    setOwnedTrips,
    sharedTrips,
    publishedTrips,
    setPublishedTrips,
  } = {
    ...props,
  };
  const navigate = useNavigate();

  function handleOnTripClickEdit(id: string) {
    navigate("/edittrip/" + id);
  }

  function handleOnTripClickView(id: string) {
    navigate("/viewtrip/" + id);
  }

  return (
    <>
      Active trips:
      {ownedTrips.map(function (trip: Trip) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClickEdit(trip.id)}>
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
      Published trips:
      {publishedTrips.map(function (trip: Trip) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClickView(trip.id)}>
              {trip.name} {trip.description}
            </button>
            <RemoveTripComponent
              jwt={jwt}
              tripId={trip.id}
              trips={publishedTrips}
              setTrips={setPublishedTrips}
            />
          </div>
        );
      })}
      <br />
      Shared with you:
      {sharedTrips.map(function (trip: Trip) {
        return (
          <div key={trip.id}>
            <button onClick={(event) => handleOnTripClickEdit(trip.id)}>
              {trip.name} {trip.description}
            </button>
          </div>
        );
      })}
    </>
  );
}

export default TripListDisplayComponent;
