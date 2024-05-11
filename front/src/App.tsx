import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Cookies from "universal-cookie";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import { useState, useEffect } from "react";
import { JwtHeader, jwtDecode } from "jwt-decode";
import TripsPage from "./pages/TripsPage";
import TripPlannerPage from "./pages/TripPlannerPage";
import LogoutPage from "./pages/LogoutPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  let cookies = new Cookies();
  const [username, setUsername] = useState<string>();
  const [jwt, setJwt] = useState<string>(
    cookies.get("jwt") !== undefined ? cookies.get("jwt") : ""
  );
  const [jwtIsValid, setJwtIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
          setJwtIsValid(data.valid);
          if (data) {
            const decoded = jwtDecode(jwt, { header: false });
            if (decoded.exp !== undefined) {
              cookies.set("jwt", jwt, {
                expires: new Date(decoded.exp * 1000),
              });
              setUsername(decoded.sub as string);
            }
          } else {
            cookies.remove("jwt");
            setJwt("");
          }
        });
    }
    setLoading(true);
  });

  function doLogout() {
    setJwt("");
    cookies = new Cookies();
    cookies.remove("jwt");
  }

  return (
    loading && (
      <>
        <BrowserRouter>
          <Routes>
            <Route
              path="/home"
              element={
                <HomePage
                  jwt={jwt}
                  jwtIsValid={jwtIsValid}
                  username={username as string}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <UserProfilePage
                  jwt={jwt}
                  jwtIsValid={jwtIsValid}
                  username={username as string}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <RegistrationPage
                  jwtIsValid={jwtIsValid}
                  setJwt={setJwt}
                  setUsername={setUsername}
                />
              }
            />
            <Route
              path="/signin"
              element={
                <LoginPage
                  jwtIsValid={jwtIsValid}
                  setJwt={setJwt}
                  setUsername={setUsername}
                />
              }
            />
            <Route
              path="/trips"
              element={
                <TripsPage
                  jwt={jwt}
                  jwtIsValid={jwtIsValid}
                  username={username as string}
                />
              }
            />
            <Route
              path="/edittrip/:id"
              element={
                <TripPlannerPage
                  jwt={jwt}
                  jwtIsValid={jwtIsValid}
                  username={username as string}
                />
              }
            />
            <Route
              path="/viewtrip/:id"
              element={
                <TripPlannerPage
                  jwt={jwt}
                  jwtIsValid={jwtIsValid}
                  username={username as string}
                />
              }
            />
            <Route
              path="/logout"
              element={<LogoutPage doLogout={doLogout} />}
            />
          </Routes>
        </BrowserRouter>
      </>
    )
  );
}

export default App;
