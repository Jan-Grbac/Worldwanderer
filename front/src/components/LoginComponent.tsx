import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      alert("Username cannot be empty!");
      return;
    }
    if (user.password === "") {
      alert("Password cannot be empty!");
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
          alert("Wrong login info.");
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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="p-2">
        Username:
        <input
          type="text"
          value={user?.username}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
        ></input>
      </div>
      <div className="p-2">
        Password:
        <input
          type="password"
          value={user?.password}
          onChange={(event) =>
            handleInputChange("password", event.target.value)
          }
        ></input>
      </div>
      <div className="d-flex flex-row">
        <button onClick={handleLoginButtonClick}>Login</button>
        <button onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

export default LoginComponent;
