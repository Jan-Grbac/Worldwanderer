import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function TripsPage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };
  const [trips, setTrips] = useState(new Array());
  const [newTrip, setNewTrip] = useState({
    name: "",
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to view your trips!");
      } else {
        fetch(`/api/core/trip/getTrips/${username}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            setTrips(data);
          });
      }
    }
  }, [jwt, username]);

  function handleInputChange(param: string, value: any) {
    let newTripChanged = { ...newTrip };
    if (param === "name") {
      newTripChanged[param] = value;
      setNewTrip(newTripChanged);
    }
    if (param === "description") {
      newTripChanged[param] = value;
      setNewTrip(newTripChanged);
    }
  }

  function handleNewTripCreation() {
    if (newTrip.name === "") {
      alert("Name cannot be empty!");
      return;
    }
    if (newTrip.description === "") {
      alert("Description cannot be empty!");
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTrip),
    };
    fetch(`/api/core/trip/createTrip/${username}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        let newTrips = trips.concat(data);
        console.log(newTrips);
        setTrips(newTrips);
        setNewTrip({
          name: "",
          description: "",
        });
        window.location.reload();
      });
  }

  return (
    <>
      <div>
        {trips.map(function (trip: any) {
          return (
            <p>
              {trip.name} {trip.description}
            </p>
          );
        })}
      </div>
      <div>
        Create new trip:
        <div className="p-2">
          Trip name:
          <input
            type="text"
            value={newTrip.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
        </div>
        <div className="p-2">
          Trip description:
          <input
            type="text"
            value={newTrip.description}
            onChange={(event) =>
              handleInputChange("description", event.target.value)
            }
          ></input>
        </div>
        <button onClick={handleNewTripCreation}>Create new trip</button>
      </div>
    </>
  );
}

export default TripsPage;
