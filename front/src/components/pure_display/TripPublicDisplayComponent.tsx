import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: Trip;
}

function TripPublicDisplayComponent(props: Props) {
  const { trip } = { ...props };
  const navigate = useNavigate();

  function viewTrip(tripId: string) {
    navigate("/viewtrip/" + tripId);
  }

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    return day + "/" + month + "/" + year;
  }

  return (
    <div
      className="cursor-pointer p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
      onClick={() => {
        viewTrip(trip.id);
      }}
    >
      <h1 className="mb-4 text-2xl font-extrabold text-black">{trip.name}</h1>
      <p className="text-lg text-gray-700">{trip.rating} ⭐</p>
      <p className="text-gray-600">Made by: {trip.ownerUsername}</p>
      <p className="text-gray-600">
        Published on: {formatDate(trip.publishedDate)}
      </p>
    </div>
  );
}

export default TripPublicDisplayComponent;
