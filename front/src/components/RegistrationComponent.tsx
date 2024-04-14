import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setJwt: Function;
  setUsername: Function;
}

function RegistrationComponent(props: Props) {
  const { setJwt, setUsername } = { ...props };
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleInputChange(param: string, value: any) {
    let newUser = { ...user };
    if (param === "email") {
      newUser[param] = value;
      setUser(newUser);
    }
    if (param === "username") {
      newUser[param] = value;
      setUser(newUser);
    }
    if (param === "password") {
      newUser[param] = value;
      setUser(newUser);
    }
  }

  function isValidEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  function handleRegisterButtonClick() {
    if (!isValidEmail(user.email)) {
      alert("Wrong email format!");
      return;
    }
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
    fetch("/api/auth/signup", fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setJwt(data.token);
        setUsername(user.username);
        navigate("/home");
      });
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="p-2">
        Email:
        <input
          type="email"
          placeholder="john.doe@email.com"
          value={user.email}
          onChange={(event) => handleInputChange("email", event.target.value)}
        ></input>
      </div>
      <div className="p-2">
        Username:
        <input
          type="text"
          value={user.username}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
        ></input>
      </div>
      <div className="p-2">
        Password:
        <input
          type="password"
          value={user.password}
          onChange={(event) =>
            handleInputChange("password", event.target.value)
          }
        ></input>
      </div>
      <button onClick={handleRegisterButtonClick}>Register</button>
    </div>
  );
}

export default RegistrationComponent;
