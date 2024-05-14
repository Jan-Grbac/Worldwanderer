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
      console.log(highestRatedTrips);
      setLoading(true);
    }
  }, [highestRatedTrips]);

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <h1 className="ml-4 mt-2 p-4 text-5xl italic underline">
          Featured trips
        </h1>
        <div className="grid grid-cols-5 m-4 gap-5">
          {highestRatedTrips?.map((trip: any) => {
            return <TripPublicDisplayComponent trip={trip} />;
          })}
        </div>
      </>
    )
  );
}

export default HomePage;
