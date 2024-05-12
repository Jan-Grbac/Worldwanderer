import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  setJwt: Function;
  user: User;
}

function UserInfoUpdateComponent(props: Props) {
  const { jwt, setJwt, user } = { ...props };

  const [updatedUser, setUpdatedUser] = useState({
    email: "",
    oldUsername: user.username,
    username: "",
    newPassword: "",
    oldPassword: "",
  });

  const [emailCollision, setEmailCollision] = useState<boolean>(false);
  const [usernameCollision, setUsernameCollision] = useState<boolean>(false);

  const navigate = useNavigate();

  function handleInputChange(param: string, value: any) {
    setUpdatedUser({
      ...updatedUser,
      [param]: value,
    });
  }

  function checkEmailCollision(): boolean {
    let checkObject = {
      email: updatedUser.email,
    };

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(checkObject),
    };
    return Boolean(
      fetch(`/api/core/user/checkEmailCollision`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setEmailCollision(data);
        })
    );
  }

  function checkUsernameCollision(): boolean {
    let checkObject = {
      username: updatedUser.username,
    };

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(checkObject),
    };
    return Boolean(
      fetch(`/api/core/user/checkUsernameCollision`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setUsernameCollision(data);
        })
    );
  }

  function tryUpdate() {
    setUpdatedUser({
      ...updatedUser,
      oldUsername: user.username,
    });

    if (emailCollision) {
      alert("Email collision");
      return;
    }
    if (usernameCollision) {
      alert("Username collision");
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(updatedUser),
    };
    fetch(`/api/core/user/tryUpdate`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          alert("Update successful");
          setJwt("");
          navigate("/signin");
        } else {
          alert("Update failed. Password mismatch.");
        }
      });
  }

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="p-2">
          Update email:
          <input
            id="new-email-input"
            type="email"
            value={updatedUser?.email}
            onChange={(event) => handleInputChange("email", event.target.value)}
            onBlur={checkEmailCollision}
          ></input>
        </div>
        <div className="p-2">
          Update username:
          <input
            id="new-username-input"
            type="text"
            value={updatedUser?.username}
            onChange={(event) =>
              handleInputChange("username", event.target.value)
            }
            onBlur={checkUsernameCollision}
          ></input>
        </div>
        <div className="p-2">
          Password:
          <input
            id="new-password-input"
            type="password"
            value={updatedUser?.newPassword}
            onChange={(event) =>
              handleInputChange("newPassword", event.target.value)
            }
          ></input>
        </div>
        <div className="p-2">
          Old password:
          <input
            id="old-password-input"
            type="password"
            value={updatedUser?.oldPassword}
            onChange={(event) =>
              handleInputChange("oldPassword", event.target.value)
            }
          ></input>
        </div>
        <button onClick={tryUpdate}>Update</button>
      </div>
    </div>
  );
}

export default UserInfoUpdateComponent;
