import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TripListDisplayComponent from "../components/display/TripListDisplayComponent";
import TripCreateComponent from "../components/create/TripCreateComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function TripsPage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };
  const [trips, setTrips] = useState(new Array());
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
    }
  }, [jwt, username]);

  return (
    loading && (
      <>
        <div>
          <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
          <TripListDisplayComponent trips={trips} />
          <TripCreateComponent
            jwt={jwt}
            username={username}
            trips={trips}
            setTrips={setTrips}
          />
        </div>
      </>
    )
  );
}

export default TripsPage;
