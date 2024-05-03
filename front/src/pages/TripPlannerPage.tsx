import React, { useEffect, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function TripPlannerPage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };
  const [trip, setTrip] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const tripId = window.location.href.split("/")[4];
  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to edit a trip!");
      } else {
        fetch(`/api/core/trip/getTrip/${tripId}`, {
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
            } else {
              navigate("/trips");
              alert("Trip doesn't exist or doesn't belong to user.");
              return;
            }
          })
          .then((data) => {
            setTrip(data);
          });
        setLoading(true);
      }
    }
  }, [jwt, username]);

  const render = (status: Status) => <h1>{status}</h1>;
  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <div className="d-flex flex-row">
          <div>
            <TripDataDisplayComponent jwt={jwt} tripId={trip.id} />
          </div>
          <div>
            <Wrapper
              apiKey={"AIzaSyBBy4rP_7WtQH5hdshJLR2UwxgNTlO3YBM"}
              render={render}
            >
              <MapComponent />
            </Wrapper>
          </div>
        </div>
      </>
    )
  );
}

export default TripPlannerPage;
