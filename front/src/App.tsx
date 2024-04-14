import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Cookies from "universal-cookie";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const cookies = new Cookies();
  const [jwt, setJwt] = useState(
    cookies.get("jwt") !== undefined ? cookies.get("jwt") : ""
  );
  const [jwtIsValid, setJwtIsValid] = useState(false);

  useEffect(() => {
    if (jwt !== "") {
      fetch(`/api/auth/validate?token=${jwt}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          setJwtIsValid(data);
          if (data) {
            const decoded = jwtDecode(jwt);
            if (decoded.exp !== undefined) {
              cookies.set("jwt", jwt, {
                expires: new Date(decoded.exp * 1000),
              });
            }
          } else {
            cookies.remove("jwt");
            setJwt("");
          }
        });
    } else {
      setJwtIsValid(false);
    }
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/signup"
            element={
              <RegistrationPage jwtIsValid={jwtIsValid} setJwt={setJwt} />
            }
          />
          <Route
            path="/signin"
            element={<LoginPage jwtIsValid={jwtIsValid} setJwt={setJwt} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
