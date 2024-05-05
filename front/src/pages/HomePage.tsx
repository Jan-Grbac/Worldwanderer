import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };

  const [loading, setLoading] = useState(false);
  const [highestRatedTrips, setHighestRatedTrips] = useState(new Array());

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
        setLoading(true);
        console.log(data);
      });
  }, [jwt, jwtIsValid, username]);

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <p>Hello there!</p>
        <p>Logged in: {username}</p>
        <div></div>
      </>
    )
  );
}

export default HomePage;
