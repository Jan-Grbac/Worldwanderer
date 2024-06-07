import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RemoveTripComponent from "../remove/RemoveTripComponent";
import TripCreateComponent from "../create/TripCreateComponent";
import NavbarComponent from "../NavbarComponent";
import * as FlagIcons from "country-flag-icons/react/3x2";

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

  const getFlagComponent = (countryCode: string) => {
    console.log(countryCode);
    const upperCaseCountryCode = countryCode.toUpperCase();
    const FlagComponent = (FlagIcons as any)[upperCaseCountryCode];
    return FlagComponent ? <FlagComponent /> : null;
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-100 rounded-md">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="mb-4 text-3xl font-bold text-black">
                  Your trips
                </h2>
                <hr className="mb-6 border-b-2 border-orange-500 mx-auto" />
                <div className="m-8">
                  <h2 className="text-3xl mb-4 text-black">Work in progress</h2>
                  {ownedTrips.map((trip) => (
                    <div key={trip.id}>
                      <button
                        className="flex items-center w-1/2 ml-6 mt-4 justify-between p-5 font-medium text-gray-700 border border-gray-300 rounded-t-lg hover:bg-gray-200 gap-3"
                        data-accordion-target={`#accordion-open-body-${trip.id}`}
                        aria-expanded="true"
                        aria-controls={`accordion-open-body-${trip.id}`}
                        onClick={() => accordion(trip.id)}
                      >
                        <div className="flex flex-row">
                          <strong className="mr-4">{trip.name}</strong>
                          <div className="flex flex-row gap-1">
                            {trip.countries &&
                              trip.countries.map(function (country: string) {
                                return (
                                  <div className="w-8">
                                    {getFlagComponent(country)}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                              stroke-width="2"
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
                        className="w-1/2 ml-6 p-5 border border-gray-300 bg-white rounded-b-md hidden flex-col"
                      >
                        <p className="text-gray-600">{trip.description}</p>
                        <button
                          className="confirmButton w-max ml-10 mt-4 text-black"
                          onClick={() => handleOnTripClickEdit(trip.id)}
                        >
                          Edit trip
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col mt-4">
                    <button
                      id="create-trip-button"
                      className="rounded-md ml-6 bg-gray-200 p-2 w-max text-black hover:bg-gray-300"
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

                  <h2 className="text-3xl mb-4 mt-4 text-black">Published</h2>
                  {publishedTrips.map((trip) => (
                    <div key={trip.id}>
                      <button
                        className="flex items-center w-1/2 ml-6 mt-4 justify-between p-5 font-medium text-gray-700 border border-gray-300 rounded-t-lg hover:bg-gray-200 gap-3"
                        data-accordion-target={`#accordion-open-body-${trip.id}`}
                        aria-expanded="true"
                        aria-controls={`accordion-open-body-${trip.id}`}
                        onClick={() => accordion(trip.id)}
                      >
                        <div className="flex flex-row">
                          <strong className="mr-4">{trip.name}</strong>
                          <div className="flex flex-row gap-1">
                            {trip.countries &&
                              trip.countries.map(function (country: string) {
                                return (
                                  <div className="w-8">
                                    {getFlagComponent(country)}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                              stroke-width="2"
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
                        className="w-1/2 ml-6 p-5 border border-gray-300 bg-white rounded-b-md hidden flex-col"
                      >
                        <p className="text-gray-600">{trip.description}</p>
                        <button
                          className="confirmButton w-max ml-10 mt-4 text-black"
                          onClick={() => handleOnTripClickView(trip.id)}
                        >
                          View trip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="mb-4 text-3xl font-bold text-black">
                  Shared with you
                </h2>
                <hr className="mb-6 border-b-2 border-orange-500 mx-auto" />
                {sharedTrips.map((trip) => (
                  <div key={trip.id}>
                    <button
                      className="flex items-center w-1/2 ml-12 mt-4 justify-between p-5 font-medium text-gray-700 border border-gray-300 rounded-t-lg hover:bg-gray-200 gap-3"
                      data-accordion-target={`#accordion-open-body-${trip.id}`}
                      aria-expanded="true"
                      aria-controls={`accordion-open-body-${trip.id}`}
                      onClick={() => accordion(trip.id)}
                    >
                      <div className="flex flex-row">
                        <strong className="mr-4">{trip.name}</strong>
                        <div className="flex flex-row gap-1">
                          {trip.countries &&
                            trip.countries.map(function (country: string) {
                              return (
                                <div className="w-8">
                                  {getFlagComponent(country)}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
                            stroke-width="2"
                            d="M9 5 5 1 1 5"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      id={`accordion-open-body-${trip.id}`}
                      className="w-1/2 ml-12 p-5 border border-gray-300 bg-white rounded-b-md hidden flex-col"
                    >
                      <p className="text-gray-600">{trip.description}</p>
                      <button
                        className="confirmButton w-max ml-10 mt-4 text-black"
                        onClick={() => handleOnTripClickEdit(trip.id)}
                      >
                        Edit trip
                      </button>
                    </div>
                  </div>
                ))}
                {sharedTrips && sharedTrips.length === 0 && (
                  <p className="ml-12 mt-4 text-xl">
                    No trips here! Ask your friends to edit together with them.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default TripListDisplayComponent;
