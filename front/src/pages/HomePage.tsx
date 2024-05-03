import React from "react";
import MapComponent from "../components/display/MapComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwtIsValid, username } = { ...props };
  return (
    <>
      <NavbarComponent jwtIsValid={jwtIsValid} username={username} />
      <p>Hello there!</p>
      <p>Jwt is valid : {jwtIsValid}</p>
      <p>Logged in: {username}</p>
    </>
  );
}

export default HomePage;
