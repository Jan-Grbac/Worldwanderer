import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import UserInfoDisplayComponent from "../components/display/UserInfoDisplayComponent";
import UserInfoUpdateComponent from "../components/update/UserInfoUpdateComponent";

interface Props {
  jwt: string;
  setJwt: Function;
  jwtIsValid: boolean;
  username: string;
}

function UserProfilePage(props: Props) {
  const { jwt, setJwt, jwtIsValid, username } = { ...props };

  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (jwt && username) {
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
      fetch(`/api/core/user/getUser/${username}`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setUser(data);
        });
    }
  }, [jwt, username]);

  useEffect(() => {
    if (user) {
      setLoading(true);
    }
  }, [user]);

  return (
    loading && (
      <>
        <div className="border border-black">
          <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
        </div>
        <div className="d-flex flex-row">
          <UserInfoDisplayComponent user={user as User} />
        </div>
        <div className="d-flex flex-row">
          <UserInfoUpdateComponent
            jwt={jwt}
            setJwt={setJwt}
            user={user as User}
          />
        </div>
      </>
    )
  );
}

export default UserProfilePage;
