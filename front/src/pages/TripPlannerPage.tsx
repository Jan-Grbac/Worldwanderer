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
import AttractionDisplayComponent from "../components/display/AttractionDisplayComponent";
import RateTripComponent from "../components/update/RateTripComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function TripPlannerPage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };
  const [trip, setTrip] = useState<Trip>();
  const [dateIntervals, setDateIntervals] = useState<Array<DateInterval>>([]);
  const [timeslots, setTimeslots] = useState<Array<Array<TimeSlot>>>([[]]);
  const [allowedUsers, setAllowedUsers] = useState<Array<User>>([]);

  const [editable, setEditable] = useState<boolean>(false);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAllowedUser, setIsAllowedUser] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [canConnect, setCanConnect] = useState<boolean>(false);

  const [selectedTimeslot, setSelectedTimeslot] = useState<TimeSlot>();
  const [suggestedAttractions, setSuggestedAttractions] = useState<
    Array<google.maps.places.PlaceResult>
  >([]);

  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && username) {
      if (!jwtIsValid) {
        navigate("/home");
        console.log("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];

        checkTripAccess(tripId);
        fetchTrip(tripId);
        fetchAllowedUsers(tripId);
        fetchDateIntervals(tripId);
        fetchTimeslots(tripId);
      }
    }
  }, [jwt, username]);

  function checkTripAccess(tripId: string) {
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
        for (let i = 0; i < data.length; i++) {
          if (data[i].username === username) {
            setIsAllowedUser(true);
            break;
          }
        }
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

  function fetchTrip(tripId: string) {
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
        const newTrip = { ...trip } as Trip;

        newTrip.id = data.id;
        newTrip.name = data.name;
        newTrip.description = data.description;
        newTrip.ownerUsername = data.ownerUsername;
        newTrip.published = data.published;
        newTrip.publishedDate = data.publishedDate;

        if (username === data.ownerUsername) {
          setIsOwner(true);
        }
        if (!data.published) {
          setEditable(true);
          setCanConnect(true);
        }
        setTrip(newTrip);
        console.log(newTrip);
      });
  }

  useEffect(() => {
    if (jwt && username && trip && dateIntervals && timeslots && allowedUsers) {
      setLoading(true);
    }
  }, [jwt, username, trip, dateIntervals, timeslots, allowedUsers]);

  function userGrantedEditPrivilege(data: string) {
    if (!trip) return;
    alert("User " + data + " was granted edit privilege.");
    fetchAllowedUsers(trip.id);
  }
  function userRevokedEditPrivilege(data: string) {
    if (data === username) {
      alert("Your edit privileges were revoked.");
      navigate("/home");
    } else {
      if (!trip) return;
      alert("User " + data + "'s edit privilege was revoked.");
      fetchAllowedUsers(trip.id);
    }
  }
  function dateIntervalAdded(data: string) {
    if (!trip) return;
    alert(data + " added a date interval.");
    fetchDateIntervals(trip.id);
    fetchTimeslots(trip.id);
  }
  function dateIntervalDeleted(data: string) {
    if (!trip) return;
    alert(data + " deleted a date interval.");
    fetchDateIntervals(trip.id);
    fetchTimeslots(trip.id);
  }
  function dateIntervalUpdated(data: string) {
    if (!trip) return;
    alert(data + " updated a date interval.");
    fetchDateIntervals(trip.id);
    fetchTimeslots(trip.id);
  }
  function timeslotAdded(data: string) {
    if (!trip) return;
    alert(data + " added a timeslot.");
    fetchTimeslots(trip.id);
  }
  function timeslotDeleted(data: string) {
    if (!trip) return;
    alert(data + " deleted a timeslot.");
    fetchTimeslots(trip.id);
  }
  function tripParamsUpdated(data: string) {
    if (!trip) return;
    alert(data + " edited trip parameters.");
    fetchTrip(trip.id);
  }

  useEffect(() => {
    if (canConnect && trip) {
      const s = io("http://localhost:8081", {
        reconnection: true,
        query: { trip: trip.id },
      });
      s.connect();
      setSocket(s);

      s.on("GRANTED_EDIT_PRIVILEGE", userGrantedEditPrivilege);
      s.on("REVOKED_EDIT_PRIVILEGE", userRevokedEditPrivilege);
      s.on("ADDED_DATE_INTERVAL", dateIntervalAdded);
      s.on("DELETED_DATE_INTERVAL", dateIntervalDeleted);
      s.on("ADDED_TIMESLOT", timeslotAdded);
      s.on("DELETED_TIMESLOT", timeslotDeleted);
      s.on("TRIP_PARAMS_UPDATED", tripParamsUpdated);
      s.on("DATE_INTERVAL_UPDATED", dateIntervalUpdated);

      return () => {
        s.off("GRANTED_EDIT_PRIVILEGE");
        s.off("REVOKED_EDIT_PRIVILEGE");
        s.off("ADDED_DATE_INTERVAL");
        s.off("DELETED_DATE_INTERVAL");
        s.off("ADDED_TIMESLOT");
        s.off("DELETED_TIMESLOT");
        s.off("TRIP_PARAMS_UPDATED");
        s.off("DATE_INTERVAL_UPDATED");

        s.disconnect();
      };
    } else {
      return;
    }
  }, [canConnect, trip]);

  function copyTrip() {
    if (!trip) return;
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

  function handlePublish() {
    if (!trip) return;

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    fetch(`/api/core/trip/publishTrip/${trip.id}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        } else {
          alert("Publishing failed.");
          return;
        }
      })
      .then(() => {
        alert("Trip published successfully.");
        navigate("/viewtrip/" + trip.id);
      });

    let newTrip = { ...trip };
    newTrip.published = true;

    setTrip(newTrip);
    setEditable(false);
  }

  return (
    loading && (
      <>
        <div className="border border-black">
          <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        </div>
        <div className="d-flex flex-row">
          <div>
            {trip?.published && (
              <p>
                Published by {trip.ownerUsername} on: {trip.publishedDate}
              </p>
            )}
            <TripEditPermissionDisplayComponent
              jwt={jwt}
              allowedUsers={allowedUsers}
              setAllowedUsers={setAllowedUsers}
              trip={trip as Trip}
              isOwner={isOwner}
              editable={editable}
              socket={socket}
            />
            {isOwner && editable && (
              <TripEditPermissionGrantComponent
                jwt={jwt}
                trip={trip as Trip}
                allowedUsers={allowedUsers}
                setAllowedUsers={setAllowedUsers}
                username={username}
                socket={socket}
              />
            )}
            <TripDataDisplayComponent
              jwt={jwt}
              trip={trip as Trip}
              setTrip={setTrip}
              username={username}
              dateIntervals={dateIntervals}
              setDateIntervals={setDateIntervals}
              timeslots={timeslots}
              setTimeslots={setTimeslots}
              editable={editable}
              socket={socket}
              selectedTimeslot={selectedTimeslot as TimeSlot}
              setSelectedTimeslot={setSelectedTimeslot}
            />
          </div>
          <div className="border border-black">
            <MapComponent
              jwt={jwt}
              username={username}
              trip={trip as Trip}
              dateIntervals={dateIntervals}
              timeslots={timeslots}
              socket={socket}
              selectedTimeslot={selectedTimeslot as TimeSlot}
              setSuggestedAttractions={setSuggestedAttractions}
            />
            <div className="d-flex flex-row">
              {editable &&
                suggestedAttractions &&
                suggestedAttractions.map(function (
                  attraction: google.maps.places.PlaceResult
                ) {
                  return (
                    <AttractionDisplayComponent
                      attraction={attraction}
                      selectedTimeslot={selectedTimeslot as TimeSlot}
                    />
                  );
                })}
            </div>
          </div>
          {!editable && trip?.published && (
            <button onClick={copyTrip}>Copy published trip and edit</button>
          )}
          {!editable && isOwner && !trip?.published && (
            <button onClick={() => navigate("/edittrip/" + trip?.id)}>
              Edit your trip
            </button>
          )}
          {editable && isOwner && (
            <>
              <button onClick={handlePublish}>Publish trip.</button>
              <p>
                Warning: You will not be able to edit the trip after publishing.
              </p>
            </>
          )}
        </div>
        <div>
          {!editable && trip?.published && !isAllowedUser && (
            <RateTripComponent jwt={jwt} username={username} trip={trip} />
          )}
        </div>
      </>
    )
  );
}

export default TripPlannerPage;
