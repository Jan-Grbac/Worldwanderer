import RemoveDateIntervalComponent from "../remove/RemoveDateIntervalComponent";
import TimeSlotCreateComponent from "../create/TimeSlotCreateComponent";
import TimeSlotDisplayComponent from "./TimeSlotDisplayComponent";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  dateInterval: DateInterval;
  dateIntervals: Array<DateInterval>;
  setDateIntervals: Function;
  timeslots: Array<Array<TimeSlot>>;
  dateIntervalTimeslots: Array<TimeSlot>;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
}

function DateIntervalDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    dateInterval,
    dateIntervals,
    setDateIntervals,
    timeslots,
    setTimeslots,
    dateIntervalTimeslots,
    tripId,
    editable,
    socket,
  } = { ...props };

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    <>
      <div className="border border-black">
        <div className="d-flex flex-row">
          <p>
            Start date: {formatDate(dateInterval.startDate)} <br />
            End date: {formatDate(dateInterval.endDate)}
          </p>
          {editable && (
            <RemoveDateIntervalComponent
              jwt={jwt}
              username={username}
              dateIntervalId={dateInterval.id}
              dateIntervals={dateIntervals}
              setDateIntervals={setDateIntervals}
              timeslots={timeslots}
              setTimeslots={setTimeslots}
              tripId={tripId}
              socket={socket}
            />
          )}
        </div>
        {editable && (
          <TimeSlotCreateComponent
            jwt={jwt}
            username={username}
            dateIntervalId={dateInterval.id}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            dateIntervalTimeslots={dateIntervalTimeslots}
            tripId={tripId}
            socket={socket}
          />
        )}
        {dateIntervalTimeslots &&
          dateIntervalTimeslots.map(function (timeslot: TimeSlot) {
            return (
              <TimeSlotDisplayComponent
                key={timeslot.id as string}
                jwt={jwt}
                username={username}
                timeslot={timeslot}
                timeslots={timeslots}
                setTimeslots={setTimeslots}
                tripId={tripId}
                editable={editable}
                socket={socket}
              />
            );
          })}
      </div>
    </>
  );
}

export default DateIntervalDisplayComponent;
