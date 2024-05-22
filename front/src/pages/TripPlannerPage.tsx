import React, { useEffect, useMemo, useReducer, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";
import TripEditPermissionGrantComponent from "../components/update/TripEditPermissionGrantComponent";
import TripEditPermissionDisplayComponent from "../components/display/TripEditPermissionDisplayComponent";
import AttractionDisplayComponent from "../components/display/AttractionDisplayComponent";
import RateTripComponent from "../components/update/RateTripComponent";
import RatingDisplayComponent from "../components/display/RatingDisplayComponent";
import HotelDisplayComponent from "../components/display/HotelDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
  editable: boolean;
}

function TripPlannerPage(props: Props) {
  const { jwt, jwtIsValid, username, editable } = { ...props };
  const [trip, setTrip] = useState<Trip>();
  const [dateIntervals, setDateIntervals] = useState<Array<DateInterval>>([]);
  const [timeslots, setTimeslots] = useState<Array<Array<TimeSlot>>>([[]]);
  const [allowedUsers, setAllowedUsers] = useState<Array<User>>([]);
  const [ratings, setRatings] = useState<Array<Rating>>([]);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAllowedUser, setIsAllowedUser] = useState<boolean>(false);
  const [hasAlreadyRated, setHasAlreadyRated] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [canConnect, setCanConnect] = useState<boolean>(false);

  const [selectedTimeslot, setSelectedTimeslot] = useState<TimeSlot>();
  const [selectedDateInterval, setSelectedDateInterval] =
    useState<DateInterval>();
  const [suggestedAttractions, setSuggestedAttractions] = useState<
    Array<google.maps.places.PlaceResult>
  >([]);
  const [hotels, setHotels] = useState<Array<google.maps.places.PlaceResult>>(
    []
  );

  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    if (jwtIsValid && jwt && editable !== undefined) {
      if (!jwtIsValid && editable) {
        navigate("/home");
        alert("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];

        fetchTrip(tripId);
        fetchAllowedUsers(tripId);
        fetchDateIntervals(tripId);
        fetchTimeslots(tripId);
        fetchRatings(tripId);
        if (editable) checkTripAccess(tripId);
      }
    }
  }, [jwt, jwtIsValid, editable]);

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
        newTrip.country = data.country;

        if (username === data.ownerUsername) {
          setIsOwner(true);
        }
        if (!data.published) {
          setCanConnect(true);
        }
        setTrip(newTrip);
      });
  }

  function fetchRatings(tripId: string) {
    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    fetch(`/api/core/rating/getRatingsForTrip/${tripId}`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setRatings(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].username === username) {
            setHasAlreadyRated(true);
          }
        }
      });
  }

  useEffect(() => {
    if (
      jwt &&
      username &&
      trip &&
      dateIntervals &&
      timeslots &&
      allowedUsers &&
      ratings
    ) {
      setLoading(true);
    }
  }, [jwt, username, trip, dateIntervals, timeslots, allowedUsers, ratings]);

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
  function timeslotUpdated(data: string) {
    if (!trip) return;
    alert(data + " updated a timeslot.");
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

      s.on("TRIP_PARAMS_UPDATED", tripParamsUpdated);
      s.on("GRANTED_EDIT_PRIVILEGE", userGrantedEditPrivilege);
      s.on("REVOKED_EDIT_PRIVILEGE", userRevokedEditPrivilege);
      s.on("ADDED_DATE_INTERVAL", dateIntervalAdded);
      s.on("DELETED_DATE_INTERVAL", dateIntervalDeleted);
      s.on("UPDATED_DATE_INTERVAL", dateIntervalUpdated);
      s.on("ADDED_TIMESLOT", timeslotAdded);
      s.on("DELETED_TIMESLOT", timeslotDeleted);
      s.on("UPDATED_TIMESLOT", dateIntervalUpdated);

      return () => {
        s.off("TRIP_PARAMS_UPDATED");
        s.off("GRANTED_EDIT_PRIVILEGE");
        s.off("REVOKED_EDIT_PRIVILEGE");
        s.off("ADDED_DATE_INTERVAL");
        s.off("DELETED_DATE_INTERVAL");
        s.off("UPDATED_DATE_INTERVAL");
        s.off("ADDED_TIMESLOT");
        s.off("DELETED_TIMESLOT");
        s.off("UPDATED_TIMESLOT");

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
  }

  function showPublishWarning() {
    let warning = document.getElementById("publish-warning");
    if (warning?.classList.contains("hidden")) {
      warning.classList.remove("hidden");
    } else {
      warning?.classList.add("hidden");
    }
  }

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        <div className="grid grid-cols-6 max-w-full max-h-full min-h-screen">
          <div className="col-span-2">
            {trip?.published && (
              <div>
                Published by {trip.ownerUsername} on: {trip.publishedDate}
              </div>
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
              selectedDateInterval={selectedDateInterval as DateInterval}
              setSelectedDateInterval={setSelectedDateInterval}
            />
          </div>
          <div className="col-span-3">
            <MapComponent
              jwt={jwt}
              username={username}
              trip={trip as Trip}
              dateIntervals={dateIntervals}
              timeslots={timeslots}
              socket={socket}
              selectedTimeslot={selectedTimeslot as TimeSlot}
              setSuggestedAttractions={setSuggestedAttractions}
              setHotels={setHotels}
            />
            <div className="d-flex flex-row">
              {editable && suggestedAttractions.length !== 0 && (
                <>
                  <p>Places to visit near {selectedTimeslot?.name}:</p>
                  {suggestedAttractions.map(function (
                    attraction: google.maps.places.PlaceResult
                  ) {
                    return (
                      <AttractionDisplayComponent
                        attraction={attraction}
                        selectedTimeslot={selectedTimeslot as TimeSlot}
                      />
                    );
                  })}
                </>
              )}
            </div>
            <div className="d-flex flex-row">
              {editable && hotels.length !== 0 && (
                <>
                  <p>Accomodation near {selectedTimeslot?.name}:</p>
                  {hotels.map(function (hotel: google.maps.places.PlaceResult) {
                    return (
                      <HotelDisplayComponent
                        hotel={hotel}
                        selectedDateInterval={
                          selectedDateInterval as DateInterval
                        }
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-row mt-4 ml-4 mb-4">
              <TripEditPermissionDisplayComponent
                jwt={jwt}
                allowedUsers={allowedUsers}
                setAllowedUsers={setAllowedUsers}
                trip={trip as Trip}
                isOwner={isOwner}
                editable={editable}
                socket={socket}
              />
              {editable && isOwner && (
                <div className="flex flex-grow flex-col justify-start align-middle">
                  <button
                    className="confirmButton self-center w-max"
                    onMouseOver={showPublishWarning}
                    onMouseLeave={showPublishWarning}
                    onClick={handlePublish}
                  >
                    Publish trip.
                  </button>
                  <p
                    id="publish-warning"
                    className="hidden text-red-800 self-center"
                  >
                    Warning: You will not be able to edit the trip after
                    publishing.
                  </p>
                </div>
              )}
            </div>

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

            {!editable && jwtIsValid && trip?.published && (
              <button onClick={copyTrip}>Copy published trip and edit</button>
            )}
            {!editable && !jwtIsValid && trip?.published && (
              <button onClick={() => navigate("/signin")}>
                Sign in to copy trip
              </button>
            )}
            {!editable && isOwner && !trip?.published && (
              <button onClick={() => navigate("/edittrip/" + trip?.id)}>
                Edit your trip
              </button>
            )}
          </div>
        </div>
        <div>
          {!editable &&
            trip?.published &&
            !isAllowedUser &&
            !hasAlreadyRated && (
              <RateTripComponent
                jwt={jwt}
                username={username}
                trip={trip}
                ratings={ratings}
                setRatings={setRatings}
                setHasAlreadyRated={setHasAlreadyRated}
              />
            )}
          {!editable &&
            trip?.published &&
            ratings &&
            ratings.map(function (rating: Rating) {
              return (
                <RatingDisplayComponent
                  jwt={jwt}
                  username={username}
                  rating={rating}
                  ratings={ratings}
                  setRatings={setRatings}
                  setHasAlreadyRated={setHasAlreadyRated}
                />
              );
            })}
        </div>
      </>
    )
  );
}

export default TripPlannerPage;
