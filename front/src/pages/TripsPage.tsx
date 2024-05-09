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
  const [ownedTrips, setOwnedTrips] = useState<Array<Trip>>();
  const [sharedTrips, setSharedTrips] = useState<Array<Trip>>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

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
            setOwnedTrips(data);
          });

        fetch(`/api/core/trip/getSharedTrips/${username}`, {
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
            setSharedTrips(data);
          });
      }
    }
  }, [jwt, username]);

  useEffect(() => {
    if (ownedTrips && sharedTrips) {
      setLoading(true);
    }
  }, [ownedTrips, sharedTrips]);

  return (
    loading && (
      <>
        <div>
          <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
          <TripListDisplayComponent
            jwt={jwt}
            ownedTrips={ownedTrips as Array<Trip>}
            setOwnedTrips={setOwnedTrips}
            sharedTrips={sharedTrips as Array<Trip>}
          />
          <TripCreateComponent
            jwt={jwt}
            username={username}
            trips={ownedTrips as Array<Trip>}
            setTrips={setOwnedTrips}
          />
        </div>
      </>
    )
  );
}

export default TripsPage;
