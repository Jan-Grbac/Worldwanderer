import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {}

function RegistrationComponent(props: Props) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("email: " + user.email + ", password: " + user.password);
  }, [user]);

  function handleInputChange(param: string, value: any) {
    let newUser = { ...user };
    if (param === "email") {
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
    let hasError = false;

    if (!isValidEmail(user.email)) {
      alert("Wrong email format!");
      return;
    }
    if (user.password === "") {
      alert("Password cannot be empty!");
      return;
    }

    const formData = new FormData();
    const { email, password } = { ...user };
    const newUser = { email, password };
    formData.append("user", JSON.stringify(newUser));

    const fetchData = {
      headers: {
        Authorization: `Bearer `,
      },
      method: "POST",
      body: formData,
    };
    fetch("/api/auth/register", fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        navigate("/");
      });
  }

  return (
    <>
      Email:
      <input
        type="email"
        placeholder="john.doe@email.com"
        value={user.email}
        onChange={(event) => handleInputChange("email", event.target.value)}
      ></input>
      Password:
      <input
        type="password"
        value={user.password}
        onChange={(event) => handleInputChange("password", event.target.value)}
      ></input>
      <button onClick={handleRegisterButtonClick}>Register</button>
    </>
  );
}

export default RegistrationComponent;
