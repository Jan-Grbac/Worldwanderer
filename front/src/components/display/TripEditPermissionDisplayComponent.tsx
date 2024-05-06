import React from "react";
import TripEditPermissionRemoveComponent from "../remove/TripEditPermissionRemoveComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  allowedUsers: any;
  trip: any;
  isOwner: boolean;
  username: string;
}

function TripEditPermissionDisplayComponent(props: Props) {
  const { jwt, allowedUsers, trip, isOwner, username } = { ...props };

  return (
    <>
      <div>
        Allowed users:
        {allowedUsers.map(function (user: any) {
          return (
            <>
              <p>
                {user.username} {isOwner && "(Owner)"}
              </p>
              {isOwner && user.username !== username && (
                <TripEditPermissionRemoveComponent
                  jwt={jwt}
                  trip={trip}
                  username={user.username}
                />
              )}
            </>
          );
        })}
      </div>
    </>
  );
}

export default TripEditPermissionDisplayComponent;
