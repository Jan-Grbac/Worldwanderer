import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Props {
  setJwt: Function;
  setUsername: Function;
}

function LoginComponent(props: Props) {
  const { setJwt, setUsername } = { ...props };
  const [user, setUser] = useState<LoginInfo>();
  const navigate = useNavigate();

  function handleInputChange(param: string, value: any) {
    let newUser = { ...user } as LoginInfo;

    if (param === "username") {
      newUser[param] = value;
      setUser(newUser);
    }
    if (param === "password") {
      newUser[param] = value;
      setUser(newUser);
    }
  }

  function handleLoginButtonClick() {
    if (!user) return;

    if (user.username === "") {
      notifyError("Username cannot be empty!");
      return;
    }
    if (user.password === "") {
      notifyError("Password cannot be empty!");
      return;
    }

    const fetchData = {
      headers: {
        Authorization: `Bearer `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(user),
    };
    fetch("/api/auth/signin", fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          notifyError("Wrong login info.");
          return;
        }
      })
      .then((data) => {
        setJwt(data.token);
        setUsername(user.username);
        navigate("/home");
      });
  }

  function cancel() {
    navigate("/home");
  }

  function notifyError(input: string) {
    toast.error(input);
  }

  return (
    <div className="formContainer">
      <div className="p-2 flex flex-row justify-between">
        <strong>Username:</strong>
        <input
          className="wordInputField"
          type="text"
          value={user?.username}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
        ></input>
      </div>
      <div className="p-2 mb-4 flex flex-row justify-between">
        <strong>Password:</strong>
        <input
          className="wordInputField"
          type="password"
          value={user?.password}
          onChange={(event) =>
            handleInputChange("password", event.target.value)
          }
        ></input>
      </div>
      <div className="flex flex-row gap-20 justify-center self-center">
        <button className="confirmButton" onClick={handleLoginButtonClick}>
          Login
        </button>
        <button className="declineButton" onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LoginComponent;
