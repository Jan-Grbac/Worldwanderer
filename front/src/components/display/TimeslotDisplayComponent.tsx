import RemoveTimeSlotComponent from "../remove/RemoveTimeSlotComponent";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  timeslot: TimeSlot;
  timeslots: Array<Array<TimeSlot>>;
  setTimeslots: Function;
  tripId: string;
  editable: boolean;
  socket: Socket | undefined;
}

function TimeSlotDisplayComponent(props: Props) {
  const {
    jwt,
    username,
    timeslot,
    timeslots,
    setTimeslots,
    tripId,
    editable,
    socket,
  } = {
    ...props,
  };

  return (
    <>
      <div className="d-flex flex-row">
        <div>
          <p>Name: {timeslot.name}</p>
          {timeslot.notes && <p>Notes: {timeslot.notes}</p>}
          <p>
            Location: {timeslot.lat} {timeslot.lng}
          </p>
          {timeslot.startTime && timeslot.endTime && (
            <p>
              From: {timeslot.startTime}, To: {timeslot.endTime}
            </p>
          )}
        </div>
        {editable && timeslots.length !== 0 && (
          <RemoveTimeSlotComponent
            jwt={jwt}
            username={username}
            timeslotId={timeslot.id}
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            tripId={tripId}
            socket={socket}
          />
        )}
      </div>
    </>
  );
}

export default TimeSlotDisplayComponent;
