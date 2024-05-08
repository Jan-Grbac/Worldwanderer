import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  trip: any;
  allowedUsers: Array<any>;
  setAllowedUsers: Function;
}

function TripEditPermissionGrantComponent(props: Props) {
  const { jwt, trip, allowedUsers, setAllowedUsers } = { ...props };

  const [username, setUsername] = useState("");
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
      `/api/core/trip/giveTripAccess/${username}/${trip.id}`,
      fetchData
    )
      .then((response) => {
        if (response.ok) {
          setUsername("");
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

        fetch(`/api/core/user/getUser/${username}`, fetchData)
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
          });
      });
  }

  function handleInputChange(param: string, value: any) {
    if (param === "username") {
      setUsername(value);
    }
  }

  return (
    <>
      <div className="p-2">
        Username:
        <input
          type="text"
          value={username}
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
