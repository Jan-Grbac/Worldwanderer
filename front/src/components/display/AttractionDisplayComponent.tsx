import React, { useEffect } from "react";

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
    }
  }

  return (
    attraction.photos && (
      <div
        onClick={handleAttractionClick}
        className="rounded-md border-2 border-black w-1/3 flex flex-col justify-start"
      >
        <div className="pt-2 pb-2">
          <img
            className="self-center align-middle object-contain max-h-20 max-w-40 min-h-20 min-w-40"
            src={attraction.photos[0].getUrl()}
            width={150}
            height={150}
          ></img>
        </div>

        <div className="pl-2 pr-2">{attraction.name}</div>
        <div className="pl-2 pr-2">
          {attraction.rating}
          {attraction.rating && "⭐"}
        </div>
      </div>
    )
  );
}

export default AttractionDisplayComponent;
