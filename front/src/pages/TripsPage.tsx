import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TripListDisplayComponent from "../components/display/TripListDisplayComponent";
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
  const [publishedTrips, setPublishedTrips] = useState<Array<Trip>>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      jwt != undefined &&
      jwtIsValid != undefined &&
      username != undefined &&
      !jwtIsValid
    ) {
      navigate("/home");
      alert("You need to be logged in to view your trips!");
      return;
    }
    if (jwt && username) {
      fetch(`/api/core/user/getUser/${username}`, {
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
          if (data.role === "ADMIN") {
            navigate("/admin");
          }
        });

      fetch(`/api/core/trip/getActiveTrips/${username}`, {
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

      fetch(`/api/core/trip/getPublishedTrips/${username}`, {
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
          setPublishedTrips(data);
        });
    }
  }, [jwt, jwtIsValid, username]);

  useEffect(() => {
    if (ownedTrips && sharedTrips && publishedTrips) {
      setLoading(true);
    }
  }, [ownedTrips, sharedTrips, publishedTrips]);

  return (
    loading && (
      <>
        <div className="flex flex-col">
          <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
          <div className="flex flex-col flex-grow ml-4 mt-4 mr-4">
            <TripListDisplayComponent
              jwt={jwt}
              username={username}
              ownedTrips={ownedTrips as Array<Trip>}
              setOwnedTrips={setOwnedTrips}
              sharedTrips={sharedTrips as Array<Trip>}
              publishedTrips={publishedTrips as Array<Trip>}
              setPublishedTrips={setPublishedTrips}
            />
          </div>
        </div>
      </>
    )
  );
}

export default TripsPage;
