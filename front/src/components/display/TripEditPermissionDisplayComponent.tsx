import React from "react";
import TripEditPermissionRemoveComponent from "../remove/TripEditPermissionRemoveComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  allowedUsers: any;
  setAllowedUsers: Function;
  trip: any;
  isOwner: boolean;
  username: string;
}

function TripEditPermissionDisplayComponent(props: Props) {
  const { jwt, allowedUsers, setAllowedUsers, trip, isOwner, username } = {
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
                {user.username} {user.username === username && "(Owner)"}
                {isOwner && user.username !== username && (
                  <TripEditPermissionRemoveComponent
                    jwt={jwt}
                    trip={trip}
                    username={user.username}
                    allowedUsers={allowedUsers}
                    setAllowedUsers={setAllowedUsers}
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
