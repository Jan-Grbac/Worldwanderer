import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

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
    let newAllowedUsers = [...allowedUsers];

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
          toast.error(
            "User doesn't exist or is already able to edit the trip!"
          );
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

            (
              document.getElementById(
                `grant-edit-privilege-username-input`
              ) as HTMLInputElement
            ).value = "";

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
      <div className="flex flex-col p-2 gap-2 bg-gray-50 rounded-md ml-4 mr-4 mb-4">
        <div className="flex flex-row self-center">
          <strong>Username:</strong>
          <input
            id="grant-edit-privilege-username-input"
            className="rounded-md pl-4 pr-4 ml-2 max-w-24 border-2"
            type="text"
            value={grantUsername}
            onChange={(event) =>
              handleInputChange("username", event.target.value)
            }
          ></input>
        </div>
        <button
          className="confirmButton w-max self-center"
          onClick={grantPermission}
        >
          Add to edit
        </button>
      </div>
    </>
  );
}

export default TripEditPermissionGrantComponent;
