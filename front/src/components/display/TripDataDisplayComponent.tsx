import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateIntervalDisplayComponent from "./DateIntervalDisplayComponent";
import DateIntervalCreateComponent from "../create/DateIntervalCreateComponent";

interface Props {
  jwt: string;
  tripId: string;
}

function TripDataDisplayComponent(props: Props) {
  const { jwt, tripId } = { ...props };

  const [dateIntervals, setDateIntervals] = useState(new Array());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && tripId) {
      fetch(`/api/core/dateInterval/getIntervals/${tripId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            navigate("/trips");
            return;
          }
        })
        .then((data) => {
          setDateIntervals(data);
        });
      setLoading(true);
    }
  }, []);

  return (
    loading && (
      <>
        <DateIntervalCreateComponent
          jwt={jwt}
          tripId={tripId}
          dateIntervals={dateIntervals}
          setDateIntervals={setDateIntervals}
        />
        {dateIntervals.map(function (dateInterval: any) {
          return (
            <>
              <DateIntervalDisplayComponent
                jwt={jwt}
                dateInterval={dateInterval}
              />
            </>
          );
        })}
      </>
    )
  );
}

export default TripDataDisplayComponent;
