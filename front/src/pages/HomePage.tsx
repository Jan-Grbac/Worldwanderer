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

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <h1 className="ml-4 mt-2 p-4 text-7xl italic underline">
          Featured trips
        </h1>
        <div className="grid grid-cols-5 m-4 pl-4 pr-4 gap-5">
          {highestRatedTrips?.map((trip: any) => {
            return <TripPublicDisplayComponent trip={trip} />;
          })}
        </div>
      </>
    )
  );
}

export default HomePage;
