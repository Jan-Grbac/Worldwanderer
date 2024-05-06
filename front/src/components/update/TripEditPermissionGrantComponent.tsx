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

  function grantPermission() {
    let newAllowedUsers = allowedUsers;

    let fetchData = {
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
        console.log(data);
        newAllowedUsers.push(data);
        console.log(allowedUsers);
        console.log(newAllowedUsers);
        setAllowedUsers(newAllowedUsers);
      });

    fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    fetch(`/api/core/trip/giveTripAccess/${username}/${trip.id}`, fetchData)
      .then((response) => {
        if (response.ok) {
        } else {
          alert("User doesn't exist!");
          return;
        }
      })
      .then(() => {
        setUsername("");
        navigate("/edittrip/" + trip.id);
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
