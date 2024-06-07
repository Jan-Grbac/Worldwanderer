import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as FlagIcons from "country-flag-icons/react/3x2";

interface Props {
  trip: Trip;
}

function TripPublicDisplayComponent(props: Props) {
  const { trip } = { ...props };
  const navigate = useNavigate();

  const [dateIntervals, setDateIntervals] = useState<Array<DateInterval>>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (trip) {
      fetch(`/api/core/dateInterval/getIntervals/${trip.id}`, {
        headers: {
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
          setLoading(true);
        });
    }
  }, [trip]);

  function viewTrip(tripId: string) {
    navigate("/viewtrip/" + tripId);
  }

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    return day + "/" + month + "/" + year;
  }

  function getTimespanInDays() {
    if (!dateIntervals || dateIntervals.length === 0) return 0;

    let dateMin = dateIntervals[0].startDate;
    let dateMax = dateIntervals[0].endDate;
    for (let i = 1; i < dateIntervals.length; i++) {
      if (dateIntervals[i].startDate < dateMin) {
        dateMin = dateIntervals[i].startDate;
      }
      if (dateIntervals[i].endDate > dateMax) {
        dateMax = dateIntervals[i].endDate;
      }
    }

    return (
      (new Date(dateMax).getTime() - new Date(dateMin).getTime()) / 86400000
    );
  }

  useEffect(() => {
    getTimespanInDays();
  }, [dateIntervals]);

  const getFlagComponent = (countryCode: string) => {
    console.log(countryCode);
    const upperCaseCountryCode = countryCode.toUpperCase();
    const FlagComponent = (FlagIcons as any)[upperCaseCountryCode];
    return FlagComponent ? <FlagComponent /> : null;
  };

  return (
    loading && (
      <div
        className="cursor-pointer p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        onClick={() => {
          viewTrip(trip.id);
        }}
      >
        <div className="flex flex-row">
          <h1 className="mb-4 text-2xl font-extrabold text-black mr-4">
            {trip.name}
          </h1>
          <div className="flex flex-row gap-1">
            {trip.countries &&
              trip.countries.map(function (country: string) {
                return (
                  <div className="w-8 mt-2">{getFlagComponent(country)}</div>
                );
              })}
          </div>
        </div>
        <p>{getTimespanInDays()} days</p>

        {trip.rating !== 0 && (
          <p className="text-lg text-gray-700">{trip.rating} ⭐</p>
        )}
        {trip.rating === 0 && <p className="text-gray-700">No ratings yet.</p>}
        <p className="text-gray-600">Made by: {trip.ownerUsername}</p>
        <p className="text-gray-600">
          Published on: {formatDate(trip.publishedDate)}
        </p>
      </div>
    )
  );
}

export default TripPublicDisplayComponent;
