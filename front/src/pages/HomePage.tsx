import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import TripPublicDisplayComponent from "../components/pure_display/TripPublicDisplayComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };

  const [loading, setLoading] = useState<boolean>(false);
  const [highestRatedTrips, setHighestRatedTrips] = useState<Array<Trip>>();
  const [searchResults, setSearchResults] = useState<Array<Trip>>();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/core/trip/getHighestRatedTrips`, {
      headers: {
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
        setHighestRatedTrips(data);
      });
  }, []);

  useEffect(() => {
    if (jwt && username) {
      const fetchData = {
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
            alert("Wrong username info.");
            return;
          }
        })
        .then((data) => {
          console.log(data);
          if (data.role === "ADMIN") {
            navigate("/admin");
          }
        });
    }
  }, [jwt, username]);

  useEffect(() => {
    if (highestRatedTrips) {
      setLoading(true);
    }
  }, [highestRatedTrips]);

  function searchTrips() {
    let query = (
      document.getElementById("trip-search-input") as HTMLInputElement
    ).value;

    const fetchData = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(query),
    };
    fetch(`/api/core/trip/searchTrip`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setSearchResults(data);
      });
  }

  return (
    loading && (
      <div className="flex flex-col">
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <h1 className="ml-4 mt-2 p-4 text-7xl italic underline">
          Featured trips
        </h1>
        <div className="grid grid-cols-5 m-4 pl-4 pr-4 gap-5">
          {highestRatedTrips?.map((trip: any) => {
            return <TripPublicDisplayComponent trip={trip} />;
          })}
          {highestRatedTrips?.length === 0 && (
            <p>
              <i>No trips found. Go make some!</i>
            </p>
          )}
        </div>
        <h2 className="ml-4 mt-2 p-4 text-4xl italic underline self-center">
          Search for trips
        </h2>
        <div className="self-center">
          <input
            id="trip-search-input"
            type="text"
            className="border-2 border-black rounded-md rounded-r-none pl-2 pr-2"
          ></input>
          <button
            className="border-2 border-black rounded-r-md pl-2 pr-2"
            onClick={searchTrips}
          >
            <i>Search...</i>
          </button>
        </div>
        <div className="grid grid-cols-5 m-4 pl-4 pr-4 gap-5">
          {searchResults?.map((trip: any) => {
            return <TripPublicDisplayComponent trip={trip} />;
          })}
        </div>
        <div className="self-center">
          {searchResults?.length === 0 && (
            <p>
              <i>No trips match search criteria.</i>
            </p>
          )}
        </div>
      </div>
    )
  );
}

export default HomePage;
