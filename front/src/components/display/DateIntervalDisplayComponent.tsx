import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeslotDisplayComponent from "./TimeslotDisplayComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";

interface Props {
  jwt: string;
  dateInterval: any;
}

function DateIntervalDisplayComponent(props: Props) {
  const { jwt, dateInterval } = { ...props };

  const [timeslots, setTimeslots] = useState(new Array());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && dateInterval) {
      fetch(`/api/core/timeslot/getTimeslots/${dateInterval.id}`, {
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
          setTimeslots(data);
        });
      console.log(timeslots);
      setLoading(true);
    }
  }, []);

  return (
    loading && (
      <>
        <p>
          {dateInterval.startDate} {dateInterval.endDate}
        </p>
        <TimeSlotCreateComponent />
        {timeslots.map(function (timeslot: any) {
          return (
            <>
              <TimeslotDisplayComponent jwt={jwt} timeslot={timeslot} />
            </>
          );
        })}
      </>
    )
  );
}

export default DateIntervalDisplayComponent;
