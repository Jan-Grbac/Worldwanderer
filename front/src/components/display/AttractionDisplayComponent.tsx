import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  attraction: google.maps.places.PlaceResult;
  selectedTimeslot: TimeSlot;
}

function AttractionDisplayComponent(props: Props) {
  const { attraction, selectedTimeslot } = { ...props };

  useEffect(() => {
    if (attraction) {
      if (attraction.rating === undefined) {
        attraction.rating = 0;
      }
    }
  }, [attraction]);

  function handleAttractionClick() {
    if (attraction.name && attraction.geometry?.location) {
      (
        document.getElementById(
          "searchBox-" + selectedTimeslot.dateIntervalId
        ) as HTMLInputElement
      ).value = attraction.name;
      (
        document.getElementById(
          "timeslot-name-input-" + selectedTimeslot.dateIntervalId
        ) as HTMLInputElement
      ).value = attraction.name;
      (
        document.getElementById(
          "timeslot-name-input-hidden-" + selectedTimeslot.dateIntervalId
        ) as HTMLInputElement
      ).value = attraction.name;
      (
        document.getElementById(
          "timeslot-lat-input-hidden-" + selectedTimeslot.dateIntervalId
        ) as HTMLInputElement
      ).value = String(attraction.geometry.location.lat());
      (
        document.getElementById(
          "timeslot-lng-input-hidden-" + selectedTimeslot.dateIntervalId
        ) as HTMLInputElement
      ).value = String(attraction.geometry.location.lng());

      toast("Attraction copied to place selector. Add place to confirm!");
    }
  }

  return (
    attraction.photos && (
      <div className="rounded-md shadow-md border-t-2 border-orange-500 w-1/3 flex flex-col justify-between bg-white">
        <div className="pt-2 pb-2">
          <img
            className="self-center align-middle object-contain max-h-20 max-w-40 min-h-20 min-w-40"
            src={attraction.photos[0].getUrl()}
            height={150}
          ></img>
        </div>

        <div className="pl-2 pr-2">{attraction.name}</div>
        <div className="pl-2 pr-2">
          {attraction.rating}
          {attraction.rating && "⭐"}
        </div>
        <button
          className="confirmButton max-w-fit self-center mb-2"
          onClick={handleAttractionClick}
        >
          Add to trip
        </button>
      </div>
    )
  );
}

export default AttractionDisplayComponent;
