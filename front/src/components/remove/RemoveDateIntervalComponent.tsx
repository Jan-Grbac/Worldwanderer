import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateIntervalId: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  tripId: string;
  socket: Socket | undefined;
}

function RemoveDateIntervalComponent(props: Props) {
  const {
    jwt,
    username,
    dateIntervalId,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    tripId,
    socket,
  } = {
    ...props,
  };

  function removeDateInterval() {
    console.log("Date removal:");
    console.log(dateIntervals);
    console.log(timeslots);
    let newDateIntervals = [...dateIntervals] as Array<DateInterval>;
    let newTimeslots = [...timeslots] as Array<Array<TimeSlot>>;

    for (let i = 0; i < dateIntervals.length; i++) {
      if (dateIntervals[i].id === dateIntervalId) {
        newDateIntervals.splice(i, 1);
        console.log(newDateIntervals);

        newTimeslots.splice(i, 1);
        if (newTimeslots.length === 0) {
          newTimeslots.push([]);
        }
        console.log(newTimeslots);
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

    setDateIntervals(newDateIntervals);
    setTimeslots(newTimeslots);

    if (socket) {
      socket.emit("UPDATE", tripId + ":" + username + ":DELETED_DATE_INTERVAL");
    }
  }

  return (
    <>
      <button onClick={removeDateInterval}>X</button>
    </>
  );
}

export default RemoveDateIntervalComponent;
