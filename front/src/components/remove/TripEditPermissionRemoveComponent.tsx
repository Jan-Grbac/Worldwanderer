import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  trip: any;
  username: string;
  allowedUsers: any;
  setAllowedUsers: Function;
}

function TripEditPermissionRemoveComponent(props: Props) {
  const { jwt, trip, username, allowedUsers, setAllowedUsers } = { ...props };

  const navigate = useNavigate();

  function revokePermission() {
    let newUsers = allowedUsers;
    for (let i = 0; i < allowedUsers.length; i++) {
      if (allowedUsers[i].username === username) {
        newUsers.splice(i, 1);
        break;
      }
    }

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
        setAllowedUsers(newUsers);
        navigate("/edittrip/" + trip.id);
        return;
      });
  }

  return (
    <>
      <button onClick={revokePermission}>X</button>
    </>
  );
}

export default TripEditPermissionRemoveComponent;
