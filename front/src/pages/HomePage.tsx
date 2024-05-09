import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import TripPublicDisplayComponent from "../components/pure_display/TripPublicDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };

  const [loading, setLoading] = useState<boolean>(false);
  const [highestRatedTrips, setHighestRatedTrips] = useState<Array<Trip>>();

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
    if (highestRatedTrips) {
      setLoading(true);
    }
  }, [highestRatedTrips]);

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <p>Hello there!</p>
        <p>Logged in: {username}</p>
        <div className="d-flex flex-row">
          {highestRatedTrips?.map((trip: any) => {
            return <TripPublicDisplayComponent trip={trip} />;
          })}
        </div>
      </>
    )
  );
}

export default HomePage;
