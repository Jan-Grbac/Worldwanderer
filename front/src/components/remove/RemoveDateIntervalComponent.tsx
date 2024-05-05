import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  dateIntervalId: string;
  dateIntervals: any;
  tripId: string;
}

function RemoveDateIntervalComponent(props: Props) {
  const { jwt, dateIntervalId, dateIntervals, tripId } = {
    ...props,
  };

  const navigate = useNavigate();

  function removeDateInterval() {
    let newDateIntervals = dateIntervals;

    for (let i = 0; i < dateIntervals.length; i++) {
      if (dateIntervals[i].id === dateIntervalId) {
        newDateIntervals.splice(i, 1);
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
    fetch(
      `/api/core/dateInterval/deleteDateInterval/${dateIntervalId}`,
      fetchData
    );

    navigate("/edittrip/" + tripId);
  }

  return (
    <>
      <button onClick={removeDateInterval}>X</button>
    </>
  );
}

export default RemoveDateIntervalComponent;
