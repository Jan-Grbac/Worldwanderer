import React, { useEffect, useMemo, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";
import RemoveTripComponent from "../components/remove/RemoveTripComponent";

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
  const [dateIntervals, setDateIntervals] = useState(new Array());
  const [timeslots, setTimeslots] = useState(new Array());

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];
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
            }
          })
          .then((data) => {
            const newTrip = trip;

            newTrip.id = data.id;
            newTrip.name = data.name;
            newTrip.description = data.description;
            setTrip(newTrip);
          });

        fetch(`/api/core/dateInterval/getIntervals/${tripId}`, {
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
            setDateIntervals(data);
          });

        fetch(`/api/core/timeslot/getTimeslotsForTrip/${tripId}`, {
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
            setTimeslots(data);
            setLoading(true);
          });
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
            <TripDataDisplayComponent
              jwt={jwt}
              trip={trip}
              dateIntervals={dateIntervals}
              setDateIntervals={setDateIntervals}
              timeslots={timeslots}
              setTimeslots={setTimeslots}
            />
          </div>
          <div>
            <MapComponent />
          </div>
        </div>
      </>
    )
  );
}

export default TripPlannerPage;
