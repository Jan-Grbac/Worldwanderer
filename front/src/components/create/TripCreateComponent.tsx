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
        let newTrips = [...trips];
        newTrips.push(data);

        setTrips(newTrips);
        setNewTrip({} as Trip);

        (document.getElementById("name-input-trip") as HTMLInputElement).value =
          "";
        (
          document.getElementById("description-input-trip") as HTMLInputElement
        ).value = "";
      });
  }

  return (
    <div className="flex flex-col bg-gray-200 rounded-md rounded-tl-none ml-6 w-1/2">
      <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
        <strong className="pt-2">
          <i>Trip name:</i>
        </strong>
        <input
          id="name-input-trip"
          className="rounded-md flex-grow p-2"
          type="text"
          value={newTrip?.name}
          onChange={(event) => handleInputChange("name", event.target.value)}
        ></input>
      </div>
      <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
        <strong className="pt-2">
          <i>Trip description (optional):</i>
        </strong>
        <textarea
          id="description-input-trip"
          className="rounded-md flex-grow p-2"
          rows={4}
          value={newTrip?.description}
          onChange={(event) =>
            handleInputChange("description", event.target.value)
          }
        ></textarea>
      </div>
      <button
        className="mt-4 mb-4 confirmButton self-center"
        onClick={handleNewTripCreation}
      >
        Create new trip
      </button>
    </div>
  );
}

export default CreateTripComponent;
