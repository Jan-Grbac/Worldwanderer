import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setJwt: Function;
  setUsername: Function;
}

function RegistrationComponent(props: Props) {
  const { setJwt, setUsername } = { ...props };
  const [user, setUser] = useState<SignUpInfo>();
  const [usernameCollision, setUsernameCollision] = useState<boolean>();
  const [emailCollision, setEmailCollision] = useState<boolean>();
  const navigate = useNavigate();

  function handleInputChange(param: string, value: any) {
    let newUser = { ...user } as SignUpInfo;
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
    if (!user) {
      alert("Missing sign up info.");
      return;
    }
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
    if (user.password.length < 8) {
      alert("Password must be at least 8 characters.");
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
        } else {
          alert("User already exists!");
          return;
        }
      })
      .then((data) => {
        setJwt(data.token);
        setUsername(user.username);
        navigate("/home");
      });
  }

  function checkEmailCollision() {
    let checkObject = {
      email: user?.email,
    };

    const fetchData = {
      headers: {
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
          console.log("email", data);
          setEmailCollision(data);
        })
    );
  }
  function checkUsernameCollision() {
    let checkObject = {
      username: user?.username,
    };

    const fetchData = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(checkObject),
    };
    fetch(`/api/core/user/checkUsernameCollision`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log("username", data);
        setUsernameCollision(data);
      });
  }

  useEffect(() => {
    let button = document.getElementById(
      "register-button"
    ) as HTMLButtonElement;
    let usernameCollError = document.getElementById("username-collision-error");
    let emailCollError = document.getElementById("email-collision-error");

    if (!emailCollision && !usernameCollision) {
      usernameCollError?.classList.add("hidden");
      emailCollError?.classList.add("hidden");
      button.disabled = false;
    } else {
      if (emailCollision) {
        emailCollError?.classList.remove("hidden");
        button.disabled = true;
      } else {
        emailCollError?.classList.add("hidden");
      }
      if (usernameCollision) {
        usernameCollError?.classList.remove("hidden");
        button.disabled = true;
      } else {
        usernameCollError?.classList.add("hidden");
      }
    }
  }, [emailCollision, usernameCollision]);

  function cancel() {
    navigate("/home");
  }

  return (
    <div className="formContainer">
      <div className="p-2">
        <strong>Email:</strong>
        <input
          className="wordInputField pl-4"
          type="email"
          placeholder="john.doe@email.com"
          value={user?.email}
          onChange={(event) => handleInputChange("email", event.target.value)}
          onBlur={checkEmailCollision}
        ></input>
      </div>
      <div
        id="email-collision-error"
        className="hidden self-center text-red-500"
      >
        Email is already in use.
      </div>
      <div className="p-2">
        <strong>Username:</strong>
        <input
          className="wordInputField pl-4"
          type="text"
          value={user?.username}
          onChange={(event) =>
            handleInputChange("username", event.target.value)
          }
          onBlur={checkUsernameCollision}
        ></input>
      </div>
      <div
        id="username-collision-error"
        className="hidden self-center text-red-500"
      >
        Username is already in use.
      </div>
      <div className="p-2 mb-4">
        <strong>Password:</strong>
        <input
          className="wordInputField pl-4"
          type="password"
          value={user?.password}
          onChange={(event) =>
            handleInputChange("password", event.target.value)
          }
        ></input>
      </div>
      <div className="flex flex-row gap-20 justify-center self-center">
        <button
          id="register-button"
          className="confirmButton"
          onClick={handleRegisterButtonClick}
        >
          Register
        </button>
        <button className="declineButton" onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default RegistrationComponent;
