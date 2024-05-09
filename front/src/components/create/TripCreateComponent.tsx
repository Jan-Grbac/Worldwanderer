import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  username: string;
  trips: Array<Trip>;
  setTrips: Function;
}

function CreateTripComponent(props: Props) {
  const { jwt, username, trips, setTrips } = { ...props };

  const [newTrip, setNewTrip] = useState<Trip>();

  const navigate = useNavigate();

  function handleInputChange(param: string, value: any) {
    let newTripChanged = { ...newTrip } as Trip;
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
    if (!newTrip) return;

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
        let newTrips = trips.concat(data);
        setTrips(newTrips);
        setNewTrip(undefined);
        (document.getElementById("name-input-trip") as HTMLInputElement).value =
          "";
        (
          document.getElementById("description-input-trip") as HTMLInputElement
        ).value = "";
        navigate("/trips");
      });
  }

  return (
    <>
      <div>
        Create new trip:
        <div className="p-2">
          Trip name:
          <input
            id="name-input-trip"
            type="text"
            value={newTrip?.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
        </div>
        <div className="p-2">
          Trip description:
          <input
            id="description-input-trip"
            type="text"
            value={newTrip?.description}
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

export default CreateTripComponent;
