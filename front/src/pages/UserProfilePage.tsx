import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import TripPublicDisplayComponent from "../components/pure_display/TripPublicDisplayComponent";
import { ToastContainer, toast } from "react-toastify";

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
        toast.error("You cannot access this site.");
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
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
        />
        <div className="flex flex-col ml-20">
          <div className="flex flex-col mt-20">
            <h1 className="text-3xl">
              <strong>{user?.username + "'s profile"}</strong>
            </h1>
            {viewerUsername === profileUsername && (
              <button
                className="confirmButton w-max mt-4"
                onClick={() => navigate("/editprofile")}
              >
                Edit profile
              </button>
            )}
          </div>
          <div className="mt-6 ml-10 grid grid-cols-5 gap-5">
            {trips &&
              trips.map(function (trip: Trip) {
                return <TripPublicDisplayComponent trip={trip} />;
              })}
            {trips && trips.length === 0 && (
              <h2>This user has no published trips!</h2>
            )}
          </div>
        </div>
      </>
    )
  );
}

export default UserProfilePage;
