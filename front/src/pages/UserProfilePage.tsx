import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import UserInfoDisplayComponent from "../components/display/UserInfoDisplayComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  viewerUsername: string;
}

function UserProfilePage(props: Props) {
  const { jwt, jwtIsValid, viewerUsername } = { ...props };

  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  const profileUsername = window.location.href.split("/")[4];

  useEffect(() => {
    if (jwt && viewerUsername) {
      if (!jwtIsValid) {
        navigate("/home");
        alert("You cannot access this site.");
        return;
      }

      const fetchData = {
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
    }
  }, [jwt, viewerUsername]);

  useEffect(() => {
    if (user) {
      setLoading(true);
    }
  }, [user]);

  return (
    loading && (
      <>
        <NavbarComponent jwtIsValid={jwtIsValid} username={viewerUsername} />
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
      </>
    )
  );
}

export default UserProfilePage;
