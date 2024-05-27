import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";
import TripCreateComponent from "../create/TripCreateComponent";

interface Props {
  jwt: string;
  username: string;
  ownedTrips: Array<Trip>;
  setOwnedTrips: Function;
  sharedTrips: Array<Trip>;
  publishedTrips: Array<Trip>;
  setPublishedTrips: Function;
}

function TripListDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    ownedTrips,
    setOwnedTrips,
    sharedTrips,
    publishedTrips,
    setPublishedTrips,
  } = {
    ...props,
  };

  const navigate = useNavigate();

  function handleOnTripClickEdit(id: string) {
    navigate("/edittrip/" + id);
  }

  function handleOnTripClickView(id: string) {
    navigate("/viewtrip/" + id);
  }

  function showCreateTrip() {
    let button = document.getElementById("create-trip-button");
    let form = document.getElementById("create-form");

    if (form?.classList.contains("hidden")) {
      button?.classList.add(
        "border-b-2",
        "border-b-gray-300",
        "rounded-b-none",
        "font-bold"
      );
      form?.classList.remove("hidden");
    } else {
      button?.classList.remove(
        "border-b-2",
        "border-b-gray-300",
        "rounded-b-none",
        "font-bold"
      );
      form?.classList.add("hidden");
    }
  }

  function accordion(id: string) {
    let el = document.getElementById("accordion-open-body-" + id);
    let icon = document.getElementById("accordion-icon-" + id);
    if (el?.classList.contains("hidden")) {
      el?.classList.remove("hidden");
      el?.classList.add("flex");
      icon?.classList.remove("rotate-180");
    } else {
      el?.classList.remove("flex");
      el?.classList.add("hidden");
      icon?.classList.add("rotate-180");
    }
  }

  return (
    <div className="ml-4 flex flex-col">
      <div>
        <h1 className="text-6xl mb-4 underline italic">Your trips</h1>
        <div className="m-8">
          <h2 className="text-3xl mb-4">Work in progress</h2>
          {ownedTrips.map(function (trip: Trip) {
            return (
              <>
                <button
                  className="flex items-center w-1/2 ml-6 mt-4 justify-between p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target={`#accordion-open-body-${trip.id}`}
                  aria-expanded="true"
                  aria-controls={`accordion-open-body-${trip.id}`}
                  data-acordion="open"
                  key={trip.id}
                  onClick={() => accordion(trip.id)}
                >
                  {trip.name}
                  <div className="flex">
                    <svg
                      id={`accordion-icon-${trip.id}`}
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0 mt-2 mr-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                    <RemoveTripComponent
                      jwt={jwt}
                      tripId={trip.id}
                      trips={ownedTrips}
                      setTrips={setOwnedTrips}
                    />
                  </div>
                </button>
                <div
                  id={`accordion-open-body-${trip.id}`}
                  className="w-1/2 ml-6 p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 hidden flex-col"
                >
                  <p>{trip.description}</p>
                  <button
                    className="confirmButton w-max ml-10 mt-4"
                    onClick={() => handleOnTripClickEdit(trip.id)}
                  >
                    Edit trip
                  </button>
                </div>
              </>
            );
          })}
          <div className="flex flex-col mt-4">
            <button
              id="create-trip-button"
              className="rounded-md ml-6 bg-gray-200 pr-2 pl-2 w-max gap-0"
              onClick={showCreateTrip}
            >
              +
            </button>
            <div id="create-form" className="hidden">
              <TripCreateComponent
                jwt={jwt}
                username={username}
                trips={ownedTrips}
                setTrips={setOwnedTrips}
              />
            </div>
          </div>

          <h2 className="text-3xl mb-4 mt-4">Published</h2>
          {publishedTrips.map(function (trip: Trip) {
            return (
              <>
                <button
                  className="flex items-center w-1/2 ml-6 mb-4 justify-between p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target={`#accordion-open-body-${trip.id}`}
                  aria-expanded="true"
                  aria-controls={`accordion-open-body-${trip.id}`}
                  data-acordion="open"
                  key={trip.id}
                  onClick={() => accordion(trip.id)}
                >
                  {trip.name}
                  <div className="flex">
                    <svg
                      id={`accordion-icon-${trip.id}`}
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0 mt-2 mr-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                    <RemoveTripComponent
                      jwt={jwt}
                      tripId={trip.id}
                      trips={publishedTrips}
                      setTrips={setPublishedTrips}
                    />
                  </div>
                </button>
                <div
                  id={`accordion-open-body-${trip.id}`}
                  className="w-1/2 ml-6 p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 hidden flex-col"
                >
                  <p>{trip.description}</p>
                  <button
                    className="confirmButton w-max ml-10 mt-4"
                    onClick={() => handleOnTripClickView(trip.id)}
                  >
                    View trip
                  </button>
                </div>
              </>
            );
          })}
        </div>
      </div>
      <div>
        <h1 className="text-6xl mb-8 underline italic">Shared with you</h1>
        {sharedTrips.map(function (trip: Trip) {
          return (
            <>
              <button
                className="flex items-center w-1/2 ml-12 mt-4 justify-between p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                data-accordion-target={`#accordion-open-body-${trip.id}`}
                aria-expanded="true"
                aria-controls={`accordion-open-body-${trip.id}`}
                data-acordion="open"
                key={trip.id}
                onClick={() => accordion(trip.id)}
              >
                {trip.name}
                <div className="flex">
                  <svg
                    id={`accordion-icon-${trip.id}`}
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0 mt-2 mr-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </div>
              </button>
              <div
                id={`accordion-open-body-${trip.id}`}
                className="w-1/2 ml-12 p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 hidden flex-col"
              >
                <p>{trip.description}</p>
                <button
                  className="confirmButton w-max ml-10 mt-4"
                  onClick={() => handleOnTripClickEdit(trip.id)}
                >
                  Edit trip
                </button>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default TripListDisplayComponent;
