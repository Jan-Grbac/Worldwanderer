import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  trip: any;
}

function TripEditPermissionGrantComponent(props: Props) {
  const { jwt, trip } = { ...props };

  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function grantPermission() {
    const fetchData = {
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
