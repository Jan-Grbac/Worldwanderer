import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateIntervalId: string;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
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
    tripId,
    socket,
  } = {
    ...props,
  };

  function removeDateInterval() {
    let newDateIntervals = [...dateIntervals] as Array<DateInterval>;

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

    setDateIntervals(newDateIntervals);

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
