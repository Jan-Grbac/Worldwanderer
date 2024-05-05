import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  timeslotId: string;
  timeslots: any;
  tripId: string;
}

function RemoveTimeSlotComponent(props: Props) {
  const { jwt, timeslotId, timeslots, tripId } = {
    ...props,
  };

  const navigate = useNavigate();

  function removeTimeslot() {
    let newTimeslots = timeslots;

    for (let i = 0; i < timeslots.length; i++) {
      if (timeslots[i].id === timeslotId) {
        newTimeslots.splice(i, 1);
        break;
      }
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    };
    fetch(`/api/core/timeslot/deleteTimeslot/${timeslotId}`, fetchData);

    navigate("/edittrip/" + tripId);
  }

  return (
    <>
      <button onClick={removeTimeslot}>X</button>
    </>
  );
}

export default RemoveTimeSlotComponent;
