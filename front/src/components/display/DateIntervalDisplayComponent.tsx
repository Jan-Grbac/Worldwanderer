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

  function dateSubstring(date: string) {
    console.log(date.substring(0, 10));
    return date.substring(0, 10);
  }

  function allowDateEditing() {
    console.log(dateInterval.startDate);
    console.log(dateInterval.endDate);
    document.getElementById("date-view")?.classList.add("d-none");
    document.getElementById("date-edit")?.classList.remove("d-none");
  }

  function finishDateEditing(event: any) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    document.getElementById("date-view")?.classList.remove("d-none");
    document.getElementById("date-edit")?.classList.add("d-none");

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dateInterval),
    };
    fetch(`/api/core/dateInterval/updateDateInterval`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        }
      })
      .then(() => {
        if (socket) {
          socket.emit(
            "UPDATE",
            tripId + ":" + username + ":DATE_INTERVAL_UPDATED"
          );
        }
      });
  }

  function handleEnterKeyPress(event: any) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  function dateChanged(param: string, value: any) {
    let newDateIntervals = [...dateIntervals];

    for (let i = 0; i < dateIntervals.length; i++) {
      if (dateInterval === dateIntervals[i]) {
        if (param === "startDate") {
          dateInterval.startDate = value;
        }
        if (param === "endDate") {
          dateInterval.endDate = value;
        }
        newDateIntervals[i] = dateInterval;
        break;
      }
    }

    setDateIntervals(newDateIntervals);
  }

  return (
    <>
      <div className="border border-black">
        <div className="d-flex flex-row">
          <div id="date-view" onDoubleClick={allowDateEditing}>
            {dateInterval.startDate === dateInterval.endDate && (
              <>Date: {formatDate(dateInterval.startDate)}</>
            )}
            {dateInterval.startDate !== dateInterval.endDate && (
              <>
                Dates: {formatDate(dateInterval.startDate)} -{" "}
                {formatDate(dateInterval.endDate)}
              </>
            )}
          </div>
          <div
            id="date-edit"
            className="d-none"
            onKeyDown={handleEnterKeyPress}
            onBlur={finishDateEditing}
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            <input
              type="date"
              name="startDate"
              defaultValue={dateSubstring(dateInterval.startDate)}
              onChange={(event) => dateChanged("startDate", event.target.value)}
            />
            <input
              type="date"
              name="endDate"
              defaultValue={dateSubstring(dateInterval.endDate)}
              onChange={(event) => dateChanged("startDate", event.target.value)}
            />
          </div>
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
