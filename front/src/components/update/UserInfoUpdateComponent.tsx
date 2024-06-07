import React, { useEffect, useState } from "react";
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

  function clear() {
    (document.getElementById("new-email-input") as HTMLInputElement).value = "";
    (document.getElementById("new-username-input") as HTMLInputElement).value =
      "";
    (document.getElementById("new-password-input") as HTMLInputElement).value =
      "";
    (document.getElementById("old-password-input") as HTMLInputElement).value =
      "";
    document
      .getElementById("new-email-input")
      ?.classList.remove("invalidInputBorder");
    document
      .getElementById("new-username-input")
      ?.classList.remove("invalidInputBorder");
    setUpdatedUser({
      email: "",
      oldUsername: user.username,
      username: "",
      newPassword: "",
      oldPassword: "",
    });
  }

  useEffect(() => {
    if (emailCollision) {
      document
        .getElementById("new-email-input")
        ?.classList.add("invalidInputBorder");
    } else {
      document
        .getElementById("new-email-input")
        ?.classList.remove("invalidInputBorder");
    }
    if (usernameCollision) {
      document
        .getElementById("new-username-input")
        ?.classList.add("invalidInputBorder");
    } else {
      document
        .getElementById("new-username-input")
        ?.classList.remove("invalidInputBorder");
    }
  }, [emailCollision, usernameCollision]);

  return (
    <>
      <div className="p-8 bg-white border-t-2 border-t-orange-500 shadow-md rounded-md grid grid-cols-3 grid-rows-5">
        <strong className="pl-2 pt-2">Update email:</strong>
        <input
          className="wordInputField col-span-2 m-1"
          id="new-email-input"
          type="email"
          value={updatedUser?.email}
          onChange={(event) => handleInputChange("email", event.target.value)}
          onBlur={checkEmailCollision}
        ></input>
        <strong className="pl-2 pt-2">Update username:</strong>
        <input
          className="wordInputField col-span-2 m-1"
          id="new-username-input"
          type="text"
          value={updatedUser?.username}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
          onBlur={checkUsernameCollision}
        ></input>
        <strong className="pl-2 pt-2">Update password:</strong>
        <input
          className="wordInputField col-span-2 m-1"
          id="new-password-input"
          type="password"
          value={updatedUser?.newPassword}
          onChange={(event) =>
            handleInputChange("newPassword", event.target.value)
          }
        ></input>
        <strong className="pl-2 pt-2">Old password:</strong>
        <input
          className="wordInputField col-span-2 m-1"
          id="old-password-input"
          type="password"
          value={updatedUser?.oldPassword}
          onChange={(event) =>
            handleInputChange("oldPassword", event.target.value)
          }
        ></input>
        <div className="col-span-3 mt-2 flex flex-row justify-evenly">
          <button className="confirmButton" onClick={tryUpdate}>
            Update
          </button>
          <button className="declineButton" onClick={clear}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default UserInfoUpdateComponent;
