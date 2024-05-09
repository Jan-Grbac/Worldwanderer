import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";
import TripEditPermissionGrantComponent from "../components/update/TripEditPermissionGrantComponent";
import TripEditPermissionDisplayComponent from "../components/display/TripEditPermissionDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
  editable: boolean;
}

function TripPlannerPage(props: Props) {
  const { jwt, jwtIsValid, username, editable } = { ...props };
  const [trip, setTrip] = useState({
    id: "",
    name: "",
    description: "",
    ownerUsername: "",
  });
  const [dateIntervals, setDateIntervals] = useState<Array<any>>();
  const [timeslots, setTimeslots] = useState<Array<Array<any>>>();
  const [allowedUsers, setAllowedUsers] = useState<Array<any>>();

  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canConnect, setCanConnect] = useState(false);

  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];

        if (editable) {
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
        }

        fetchAllowedUsers(tripId);

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

            if (editable) {
              setCanConnect(true);
            }
          });

        fetchDateIntervals(tripId);
        fetchTimeslots(tripId);
      }
    }
  }, [jwt, username]);

  function fetchAllowedUsers(tripId: string) {
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
  }

  function fetchDateIntervals(tripId: string) {
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
  }

  function fetchTimeslots(tripId: string) {
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
      });
  }

  useEffect(() => {
    if (jwt && username && trip && dateIntervals && timeslots && allowedUsers) {
      setLoading(true);
    }
  }, [jwt, username, trip, dateIntervals, timeslots, allowedUsers]);

  function userGrantedEditPrivilege(data: string) {
    alert("User " + data + " was granted edit privilege.");
    fetchAllowedUsers(trip.id);
  }
  function userRevokedEditPrivilege(data: string) {
    if (data === username) {
      alert("Your edit privileges were revoked.");
      navigate("/home");
    } else {
      alert("User " + data + "'s edit privilege was revoked.");
      fetchAllowedUsers(trip.id);
    }
  }

  useEffect(() => {
    if (canConnect) {
      const s = io("http://localhost:8081", {
        reconnection: true,
        query: { trip: trip.id },
      });
      s.connect();
      setSocket(s);

      s.on("GRANTED_EDIT_PRIVILEGE", userGrantedEditPrivilege);
      s.on("REVOKED_EDIT_PRIVILEGE", userRevokedEditPrivilege);

      return () => {
        s.off("GRANTED_EDIT_PRIVILEGE");
        s.off("REVOKED_EDIT_PRIVILEGE");

        s.disconnect();
      };
    } else {
      return;
    }
  }, [trip, canConnect]);

  function copyTrip() {
    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    fetch(`/api/core/trip/createTripCopy/${trip.id}/${username}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        alert("Copy created! Happy editing.");
        navigate("/edittrip/" + data.id);
        window.location.reload();
      });
  }

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <TripEditPermissionDisplayComponent
          jwt={jwt}
          allowedUsers={allowedUsers}
          setAllowedUsers={setAllowedUsers}
          trip={trip}
          isOwner={isOwner}
          editable={editable}
          socket={socket}
        />
        {isOwner && editable && (
          <TripEditPermissionGrantComponent
            jwt={jwt}
            trip={trip}
            allowedUsers={allowedUsers}
            setAllowedUsers={setAllowedUsers}
            username={username}
            socket={socket}
          />
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
              editable={editable}
            />
          </div>
          <div>
            <MapComponent />
          </div>
          {!editable && <button onClick={copyTrip}>Copy and edit</button>}
        </div>
      </>
    )
  );
}

export default TripPlannerPage;
