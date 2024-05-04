import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  tripId: string;
  trips: any;
  setTrips: Function;
}

function RemoveTripComponent(props: Props) {
  const { jwt, tripId, trips, setTrips } = { ...props };

  const navigate = useNavigate();

  function removeTrip() {
    let newTrips = trips;

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
    navigate("/trips");
  }

  return (
    <>
      <button onClick={removeTrip}>X</button>
    </>
  );
}

export default RemoveTripComponent;
