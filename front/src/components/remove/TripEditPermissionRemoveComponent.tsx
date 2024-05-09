import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  trip: Trip;
  username: string;
  allowedUsers: Array<User>;
  setAllowedUsers: Function;
  socket: Socket | undefined;
}

function TripEditPermissionRemoveComponent(props: Props) {
  const { jwt, trip, username, allowedUsers, setAllowedUsers, socket } = {
    ...props,
  };

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
          return;
        }
      })
      .then(() => {
        setAllowedUsers(newUsers);
        if (socket) {
          socket.emit(
            "UPDATE",
            trip.id +
              ":" +
              trip.ownerUsername +
              ":" +
              "REVOKED_EDIT_PRIVILEGE" +
              ":" +
              username
          );
        }
        navigate("/edittrip/" + trip.id, { replace: true });
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
