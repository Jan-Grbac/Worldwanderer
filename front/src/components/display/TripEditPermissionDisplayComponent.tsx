import React from "react";
import TripEditPermissionRemoveComponent from "../remove/TripEditPermissionRemoveComponent";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  allowedUsers: Array<User>;
  setAllowedUsers: Function;
  trip: Trip;
  isOwner: boolean;
  editable: boolean;
  socket: Socket | undefined;
}

function TripEditPermissionDisplayComponent(props: Props) {
  const {
    jwt,
    allowedUsers,
    setAllowedUsers,
    trip,
    isOwner,
    editable,
    socket,
  } = {
    ...props,
  };

  return (
    <>
      <div>
        <h2 className="text-bold mb-2">
          <strong>Editors</strong>
        </h2>
        {allowedUsers.map(function (user: User) {
          if (user.username === "admin") {
            return <></>;
          }
          return (
            <>
              <div className="ml-2">
                {user.username}{" "}
                {user.username === trip.ownerUsername && "(Owner)"}
                {isOwner &&
                  user.username !== trip.ownerUsername &&
                  editable && (
                    <TripEditPermissionRemoveComponent
                      jwt={jwt}
                      trip={trip}
                      username={user.username}
                      allowedUsers={allowedUsers}
                      setAllowedUsers={setAllowedUsers}
                      socket={socket}
                    />
                  )}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default TripEditPermissionDisplayComponent;
