import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  trip: Trip;
  allowedUsers: Array<User>;
  setAllowedUsers: Function;
  username: string;
  socket: Socket | undefined;
}

function TripEditPermissionGrantComponent(props: Props) {
  const { jwt, trip, allowedUsers, setAllowedUsers, username, socket } = {
    ...props,
  };

  const [grantUsername, setGrantUsername] = useState<string>("");
  const navigate = useNavigate();

  async function grantPermission() {
    let newAllowedUsers = allowedUsers;

    let fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };

    await fetch(
      `/api/core/trip/giveTripAccess/${grantUsername}/${trip.id}`,
      fetchData
    )
      .then((response) => {
        if (response.ok) {
          setGrantUsername("");
          return true;
        } else {
          alert("User doesn't exist or is already able to edit the trip!");
          navigate("/edittrip/" + trip.id);
          return false;
        }
      })
      .then((addUser: boolean) => {
        if (!addUser) return;

        fetchData = {
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        };

        fetch(`/api/core/user/getUser/${grantUsername}`, fetchData)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return;
            }
          })
          .then((data) => {
            if (!newAllowedUsers.includes(data)) {
              newAllowedUsers.push(data);
            }
            setAllowedUsers(newAllowedUsers);
            navigate("/edittrip/" + trip.id);
            if (socket) {
              socket.emit(
                "UPDATE",
                trip.id +
                  ":" +
                  username +
                  ":" +
                  "GRANTED_EDIT_PRIVILEGE" +
                  ":" +
                  data.username
              );
            }
          });
      });
  }

  function handleInputChange(param: string, value: any) {
    if (param === "username") {
      setGrantUsername(value);
    }
  }

  return (
    <>
      <div className="p-2 border border-black">
        Username:
        <input
          type="text"
          value={grantUsername}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
        ></input>
        <button onClick={grantPermission}>Add to edit</button>
      </div>
    </>
  );
}

export default TripEditPermissionGrantComponent;
