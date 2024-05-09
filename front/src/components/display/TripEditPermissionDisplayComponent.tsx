import React from "react";
import TripEditPermissionRemoveComponent from "../remove/TripEditPermissionRemoveComponent";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  allowedUsers: any;
  setAllowedUsers: Function;
  trip: any;
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
        Allowed users:
        {allowedUsers.map(function (user: any) {
          return (
            <>
              <div>
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
