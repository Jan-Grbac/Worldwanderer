import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as FlagIcons from "country-flag-icons/react/3x2";
import "jquery";
import { toast } from "react-toastify";

interface Props {
  jwt: string;
  username: string;
  trips: Array<Trip>;
  setTrips: Function;
}

function CreateTripComponent(props: Props) {
  const { jwt, username, trips, setTrips } = { ...props };

  const [newTrip, setNewTrip] = useState<Trip>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLoaded, setSearchLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    loadScript(
      "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
      () => {
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/js/countrySelect.min.js",
          () => {
            ($ as any)(document).ready(() => {
              ($("#country") as any).countrySelect();
            });
            setSearchLoaded(true);
          }
        );
      }
    );

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/css/countrySelect.min.css";
    document.head.appendChild(link);
  }, [loading]);

  const getFlagComponent = (countryCode: string) => {
    const upperCaseCountryCode = countryCode.toUpperCase();
    const FlagComponent = (FlagIcons as any)[upperCaseCountryCode];
    return FlagComponent ? <FlagComponent /> : null;
  };

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
    if (param === "countries") {
      if (newTripChanged[param] === undefined) {
        newTripChanged[param] = new Array<string>();
      }
      let country_code = String(
        ($("#country_code") as JQuery<HTMLInputElement>).val()
      );
      if (!newTripChanged[param].includes(country_code)) {
        newTripChanged[param].push(country_code);
      }
      setNewTrip(newTripChanged);
    }
  }

  useEffect(() => {
    if (searchLoaded) {
      setLoading(true);
    }
  }, [searchLoaded]);

  function handleNewTripCreation() {
    if (!newTrip) return;

    if (newTrip.name === "") {
      toast.error("Name cannot be empty!");
      return;
    }
    if (newTrip.countries === undefined) {
      toast.error("You need to select at least one country.");
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
    searchLoaded && (
      <div className="flex flex-col bg-gray-200 rounded-md rounded-tl-none ml-6 w-3/4">
        <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
          <strong className="pt-2">Trip name:</strong>
          <input
            id="name-input-trip"
            className="rounded-md flex-grow p-2"
            type="text"
            value={newTrip?.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
          ></input>
        </div>
        <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
          <strong className="pt-2">Trip description (optional):</strong>
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
        <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
          <strong>Countries (add at least one):</strong>
          {newTrip?.countries &&
            newTrip.countries.map(function (country: string) {
              return <div className="w-10">{getFlagComponent(country)}</div>;
            })}
        </div>
        <div className="pl-4 pt-4 flex flex-row gap-2 pr-4">
          <input type="text" id="country" className="rounded-md p-2" />
          <input type="hidden" id="country_code" />
          <button
            className="ml-2 rounded-md bg-gray-300 pl-2 pr-2 hover:bg-gray-400"
            onClick={(event) => handleInputChange("countries", "")}
          >
            Add country
          </button>
        </div>
        <button
          className="mt-4 mb-4 confirmButton self-center"
          onClick={handleNewTripCreation}
        >
          Create new trip
        </button>
      </div>
    )
  );
}

export default CreateTripComponent;
