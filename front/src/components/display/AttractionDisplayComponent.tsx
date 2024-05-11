import React from "react";

interface Props {
  attraction: google.maps.places.PlaceResult;
  selectedTimeslot: TimeSlot;
}

function AttractionDisplayComponent(props: Props) {
  const { attraction, selectedTimeslot } = { ...props };

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
    <div className="border border-black" onClick={handleAttractionClick}>
      {attraction.name}
      <br />
      {attraction.rating}
    </div>
  );
}

export default AttractionDisplayComponent;
