import React from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";
import TripCreateComponent from "../create/TripCreateComponent";

interface Props {
  jwt: string;
  username: string;
  ownedTrips: Array<Trip>;
  setOwnedTrips: Function;
  sharedTrips: Array<Trip>;
  publishedTrips: Array<Trip>;
  setPublishedTrips: Function;
}

function TripListDisplayComponent(props: Props) {
  const {
    jwt,
    username,
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
    <div className="ml-4 flex flex-col">
      <div>
        <h1 className="text-6xl mb-4 underline italic">Your trips</h1>
        <div className="m-8">
          <h2 className="text-3xl mb-4">Work in progress</h2>
          {ownedTrips.map(function (trip: Trip) {
            return (
              <div className="tripListEntry" key={trip.id}>
                <div
                  className="flex-grow"
                  onClick={() => handleOnTripClickEdit(trip.id)}
                >
                  {trip.name}
                </div>
                <RemoveTripComponent
                  jwt={jwt}
                  tripId={trip.id}
                  trips={ownedTrips}
                  setTrips={setOwnedTrips}
                />
              </div>
            );
          })}
          <TripCreateComponent
            jwt={jwt}
            username={username}
            trips={ownedTrips}
            setTrips={setOwnedTrips}
          />
          <h2 className="text-3xl mb-4 mt-4">Published</h2>
          {publishedTrips.map(function (trip: Trip) {
            return (
              <div className="tripListEntry" key={trip.id}>
                <div
                  className="flex-grow"
                  onClick={() => handleOnTripClickView(trip.id)}
                >
                  {trip.name}
                </div>
                <RemoveTripComponent
                  jwt={jwt}
                  tripId={trip.id}
                  trips={publishedTrips}
                  setTrips={setPublishedTrips}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h1 className="text-6xl mb-4 underline italic">Shared with you</h1>
        {sharedTrips.map(function (trip: Trip) {
          return (
            <div className="tripListEntry" key={trip.id}>
              <div onClick={() => handleOnTripClickEdit(trip.id)}>
                {trip.name}
              </div>
              <div className="collapse">Hi!</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripListDisplayComponent;
