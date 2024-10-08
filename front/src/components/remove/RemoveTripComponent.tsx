import React from "react";

interface Props {
  jwt: string;
  tripId: string;
  trips: Array<Trip>;
  setTrips: Function;
}

function RemoveTripComponent(props: Props) {
  const { jwt, tripId, trips, setTrips } = { ...props };

  function removeTrip() {
    let newTrips = [...trips];

    for (let i = 0; i < trips.length; i++) {
      if (trips[i].id === tripId) {
        newTrips.splice(i, 1);
        break;
      }
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    };
    fetch(`/api/core/trip/deleteTrip/${tripId}`, fetchData);

    setTrips(newTrips);
  }

  return (
    <div className="self-end w-max" onClick={removeTrip}>
      🗑️
    </div>
  );
}

export default RemoveTripComponent;
