import React, { useEffect, useMemo, useReducer, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/display/MapComponent";
import { useNavigate } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import io, { Socket } from "socket.io-client";
import TripDataDisplayComponent from "../components/display/TripDataDisplayComponent";
import TripEditPermissionGrantComponent from "../components/update/TripEditPermissionGrantComponent";
import TripEditPermissionDisplayComponent from "../components/display/TripEditPermissionDisplayComponent";
import AttractionDisplayComponent from "../components/display/AttractionDisplayComponent";
import RateTripComponent from "../components/update/RateTripComponent";
import RatingDisplayComponent from "../components/display/RatingDisplayComponent";
import HotelDisplayComponent from "../components/display/HotelDisplayComponent";
import { ToastContainer, toast } from "react-toastify";

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

  const [selectOnMap, setSelectOnMap] = useState<boolean>(false);

  const [map, setMap] = useState<google.maps.Map>();
  const [renderArray, setRenderArray] = useState<Array<boolean>>([]);

  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(jwtIsValid, jwt, editable);
    if (
      jwtIsValid !== undefined &&
      jwt !== undefined &&
      editable !== undefined &&
      username
    ) {
      if (!jwtIsValid && jwt === "" && editable) {
        navigate("/home");
        notifyError("You need to be logged in to edit a trip!");
      } else {
        const tripId = window.location.href.split("/")[4];

        let userJwt = "";
        if (jwt !== undefined) {
          userJwt = jwt;
        }

        console.log(userJwt);

        fetchTrip(tripId, userJwt);
        fetchAllowedUsers(tripId, userJwt);
        fetchDateIntervals(tripId, userJwt);
        fetchTimeslots(tripId, userJwt);
        fetchRatings(tripId, userJwt);
        if (editable) checkTripAccess(tripId, userJwt);
      }
    }
  }, [jwt, jwtIsValid, editable, username]);

  function checkTripAccess(tripId: string, userJwt: string) {
    fetch(`/api/core/trip/checkTripAccess/${username}/${tripId}`, {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => {
      if (response.ok) {
      } else {
        navigate("/home");
        notifyError("You are not allowed to edit this trip!");
      }
    });
  }

  function fetchAllowedUsers(tripId: string, userJwt: string) {
    fetch(`/api/core/trip/getAllowedUsers/${tripId}`, {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
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
          notifyError("You are not allowed to edit this trip!");
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

  function fetchDateIntervals(tripId: string, userJwt: string) {
    fetch(`/api/core/dateInterval/getIntervals/${tripId}`, {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
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

  function fetchTimeslots(tripId: string, userJwt: string) {
    fetch(`/api/core/timeslot/getTimeslotsForTrip/${tripId}`, {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
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

  function fetchTrip(tripId: string, userJwt: string) {
    fetch(`/api/core/trip/getTrip/${tripId}`, {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
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
        newTrip.countries = data.countries;

        if (username === data.ownerUsername || username === "admin") {
          setIsOwner(true);
        }
        if (!data.published) {
          setCanConnect(true);
        }
        setTrip(newTrip);
      });
  }

  function fetchRatings(tripId: string, userJwt: string) {
    const fetchData = {
      headers: {
        Authorization: userJwt === "" ? "" : `Bearer ${userJwt}`,
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
    if (trip && dateIntervals && timeslots && allowedUsers && ratings) {
      setLoading(true);
    }
  }, [jwt, username, trip, dateIntervals, timeslots, allowedUsers, ratings]);

  function userGrantedEditPrivilege(data: string) {
    if (!trip) return;
    notify("User " + data + " was granted edit privilege.");
    fetchAllowedUsers(trip.id, jwt);
  }
  function userRevokedEditPrivilege(data: string) {
    if (data === username) {
      notifyError("Your edit privileges were revoked.");
      navigate("/home");
    } else {
      if (!trip) return;
      notify("User " + data + "'s edit privilege was revoked.");
      fetchAllowedUsers(trip.id, jwt);
    }
  }
  function dateIntervalAdded(data: string) {
    if (!trip) return;
    notify(data + " added a date interval.");
    fetchDateIntervals(trip.id, jwt);
    fetchTimeslots(trip.id, jwt);
  }
  function dateIntervalDeleted(data: string) {
    if (!trip) return;
    notify(data + " deleted a date interval.");
    fetchDateIntervals(trip.id, jwt);
    fetchTimeslots(trip.id, jwt);
  }
  function dateIntervalUpdated(data: string) {
    if (!trip) return;
    notify(data + " updated a date interval.");
    fetchDateIntervals(trip.id, jwt);
    fetchTimeslots(trip.id, jwt);
  }
  function timeslotAdded(data: string) {
    if (!trip) return;
    notify(data + " added a timeslot.");
    fetchTimeslots(trip.id, jwt);
  }
  function timeslotDeleted(data: string) {
    if (!trip) return;
    notify(data + " deleted a timeslot.");
    fetchTimeslots(trip.id, jwt);
  }
  function timeslotUpdated(data: string) {
    if (!trip) return;
    notify(data + " updated a timeslot.");
    fetchTimeslots(trip.id, jwt);
  }
  function tripParamsUpdated(data: string) {
    if (!trip) return;
    notify(data + " edited trip parameters.");
    fetchTrip(trip.id, jwt);
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
      s.on("UPDATED_TIMESLOT", timeslotUpdated);

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
        notify("Copy created! Happy editing.");
        navigate("/edittrip/" + data.id);
        window.location.reload();
      });
  }

  function handlePublish() {
    if (!trip) return;

    let newTrip = { ...trip };
    newTrip.published = true;

    setTrip(newTrip);

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
          notifyError("Publishing failed.");
          return;
        }
      })
      .then(() => {
        notify("Trip published successfully.");
        navigate("/viewtrip/" + trip.id);
      });
  }

  function notify(input: string) {
    toast(input);
  }

  function notifyError(input: string) {
    toast.error(input);
  }

  function showPublishWarning() {
    let warning = document.getElementById("publish-warning");
    if (warning?.classList.contains("hidden")) {
      warning.classList.remove("hidden");
    } else {
      warning?.classList.add("hidden");
    }
  }

  function formatDate(date: string) {
    if (date !== null) {
      let year = date.substring(0, 4);
      let month = date.substring(5, 7);
      let day = date.substring(8, 10);

      let newDate = day + "/" + month + "/" + year;

      return newDate;
    }
    return "";
  }

  return (
    loading && (
      <>
        <APIProvider apiKey="AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ">
          <div className="flex flex-col h-screen">
            <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="light"
            />
            <div className="grid grid-cols-6 flex-grow">
              <div className="col-span-2 max-w-full m-2">
                {trip?.published && (
                  <h2 className="ml-6 mt-2 mb-2">
                    Published by <strong>{trip.ownerUsername}</strong>
                    <br />
                    {formatDate(trip.publishedDate)}
                  </h2>
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
                  selectOnMap={selectOnMap}
                  setSelectOnMap={setSelectOnMap}
                  map={map as google.maps.Map}
                  renderArray={renderArray}
                  setRenderArray={setRenderArray}
                />
              </div>
              <div className="col-span-3 relative">
                <MapComponent
                  jwt={jwt}
                  username={username}
                  trip={trip as Trip}
                  dateIntervals={dateIntervals}
                  timeslots={timeslots}
                  setTimeslots={setTimeslots}
                  socket={socket}
                  selectedTimeslot={selectedTimeslot as TimeSlot}
                  setSelectedTimeslot={setSelectedTimeslot}
                  selectedDateInterval={selectedDateInterval as DateInterval}
                  setSuggestedAttractions={setSuggestedAttractions}
                  setHotels={setHotels}
                  selectOnMap={selectOnMap}
                  setSelectOnMap={setSelectOnMap}
                  map={map as google.maps.Map}
                  setMap={setMap}
                  editable={editable}
                  renderArray={renderArray}
                />
                {editable && suggestedAttractions.length !== 0 && (
                  <div className="flex flex-col gap-2 absolute bottom-10 pl-2 pr-14">
                    <div className="ml-4 max-w-fit text-lg underline bg-white text-orange-400 pl-4 pr-4 rounded-md italic">
                      Suggested attractions
                    </div>
                    <div className="flex flex-row gap-2">
                      {editable && suggestedAttractions.length !== 0 && (
                        <>
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
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-col m-4 gap-4 border-l-2 border-l-orange-500 rounded-md shadow-md p-2">
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
                </div>

                {editable && isOwner && (
                  <div className="flex flex-grow flex-col justify-start align-middle">
                    <button
                      className="confirmButton self-center w-max"
                      onMouseOver={showPublishWarning}
                      onMouseLeave={showPublishWarning}
                      onClick={handlePublish}
                    >
                      Publish trip
                    </button>
                    <p
                      id="publish-warning"
                      className="hidden text-red-800 self-center text-center"
                    >
                      Warning: You will not be able to edit the trip after
                      publishing.
                    </p>
                  </div>
                )}

                {editable && hotels.length !== 0 && (
                  <div className="flex flex-col w-full">
                    <div className="mt-2 pl-2">
                      Check out hotels near {selectedTimeslot?.name}:
                    </div>
                    <div className="grid grid-cols-2 grid-rows-3 gap-3 m-2">
                      {editable && hotels.length !== 0 && (
                        <>
                          {hotels.map(function (
                            hotel: google.maps.places.PlaceResult
                          ) {
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
                )}
                <div className="flex flex-row justify-center">
                  {!editable && jwtIsValid && trip?.published && (
                    <button
                      onClick={copyTrip}
                      className="confirmButton max-w-50 ml-4 mr-4 self-center"
                    >
                      Copy published trip and edit
                    </button>
                  )}
                  {!editable && !jwtIsValid && trip?.published && (
                    <button
                      onClick={() => navigate("/signin")}
                      className="confirmButton max-w-50 ml-4 mr-4 self-center"
                    >
                      Sign in to copy trip
                    </button>
                  )}
                  {!editable && isOwner && !trip?.published && (
                    <button
                      onClick={() => navigate("/edittrip/" + trip?.id)}
                      className="confirmButton max-w-50 ml-4 mr-4 self-center"
                    >
                      Edit your trip
                    </button>
                  )}
                </div>
                <div>
                  {!editable &&
                    trip?.published &&
                    !isAllowedUser &&
                    !hasAlreadyRated &&
                    jwt && (
                      <RateTripComponent
                        jwt={jwt}
                        username={username}
                        trip={trip}
                        ratings={ratings}
                        setRatings={setRatings}
                        setHasAlreadyRated={setHasAlreadyRated}
                      />
                    )}
                  {!editable && trip?.published && ratings && (
                    <div className="flex flex-col border-l-2 border-orange-500 rounded-md m-4">
                      {ratings.map(function (rating: Rating) {
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </APIProvider>
      </>
    )
  );
}

export default TripPlannerPage;
