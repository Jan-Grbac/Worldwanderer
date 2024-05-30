import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import UserInfoDisplayComponent from "../components/display/UserInfoDisplayComponent";
import TripPublicDisplayComponent from "../components/pure_display/TripPublicDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  viewerUsername: string;
}

function UserProfilePage(props: Props) {
  const { jwt, jwtIsValid, viewerUsername } = { ...props };

  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [trips, setTrips] = useState<Array<Trip>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const profileUsername = window.location.href.split("/")[4];

  useEffect(() => {
    if (jwt && viewerUsername) {
      if (!jwtIsValid) {
        navigate("/home");
        alert("You cannot access this site.");
        return;
      }

      let fetchData = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      };
      fetch(`/api/core/user/getUser/${profileUsername}`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setUser(data);
        });

      fetchData = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      };
      fetch(`/api/core/trip/getPublishedTrips/${profileUsername}`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setTrips(data);
        });
    }
  }, [jwt, viewerUsername]);

  useEffect(() => {
    if (user && trips) {
      setLoading(true);
    }
  }, [user, trips]);

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={viewerUsername} />
        <div className="flex flex-row gap-20 ml-20">
          <div className="flex flex-col mt-20">
            <div className="self-center">
              <UserInfoDisplayComponent user={user as User} />
            </div>
            {viewerUsername === profileUsername && (
              <button
                className="confirmButton w-max self-center mt-4"
                onClick={() => navigate("/editprofile")}
              >
                Edit profile
              </button>
            )}
          </div>
          <div className="mt-20 ml-10">
            {trips &&
              trips.map(function (trip: Trip) {
                return <TripPublicDisplayComponent trip={trip} />;
              })}
            {trips && trips.length === 0 && (
              <p>This user has no published trips!</p>
            )}
          </div>
        </div>
      </>
    )
  );
}

export default UserProfilePage;
