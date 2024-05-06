import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  trip: any;
  username: string;
}

function TripEditPermissionRemoveComponent(props: Props) {
  const { jwt, trip, username } = { ...props };

  const navigate = useNavigate();

  function revokePermission() {
    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    fetch(`/api/core/trip/revokeTripAccess/${username}/${trip.id}`, fetchData)
      .then((response) => {
        if (response.ok) {
        } else {
          alert("wtf???");
          return;
        }
      })
      .then(() => {
        navigate("/edittrip/" + trip.id);
      });
  }

  return (
    <>
      <button onClick={revokePermission}>X</button>
    </>
  );
}

export default TripEditPermissionRemoveComponent;
