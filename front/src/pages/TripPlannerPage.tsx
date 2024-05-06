import React, { useEffect, useMemo, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";
import RemoveTripComponent from "../components/remove/RemoveTripComponent";
import TripEditPermissionGrantComponent from "../components/update/TripEditPermissionGrantComponent";
import TripEditPermissionDisplayComponent from "../components/display/TripEditPermissionDisplayComponent";

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
    ownerUsername: "",
  });
  const [dateIntervals, setDateIntervals] = useState(new Array());
  const [timeslots, setTimeslots] = useState(new Array());
  const [allowedUsers, setAllowedUsers] = useState(new Array());

  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];

        fetch(`/api/core/trip/checkTripAccess/${username}/${tripId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
        }).then((response) => {
          if (response.ok) {
          } else {
            navigate("/home");
            alert("You are not allowed to edit this trip!");
          }
        });

        fetch(`/api/core/trip/getAllowedUsers/${tripId}`, {
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
              navigate("/home");
              alert("You are not allowed to edit this trip!");
            }
          })
          .then((data) => {
            setAllowedUsers(data);
          });

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
            newTrip.ownerUsername = data.ownerUsername;

            if (username === data.ownerUsername) {
              setIsOwner(true);
            }
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

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <TripEditPermissionDisplayComponent
          jwt={jwt}
          allowedUsers={allowedUsers}
          trip={trip}
          isOwner={isOwner}
          username={username}
        />
        {isOwner && (
          <div>
            <TripEditPermissionGrantComponent jwt={jwt} trip={trip} />
          </div>
        )}
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
