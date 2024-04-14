import React from "react";
import MapComponent from "../components/MapComponent";

interface Props {
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwtIsValid, username } = { ...props };
  return (
    <>
      <p>Hello there!</p>
      <p>Jwt is valid : {jwtIsValid}</p>
      <p>Logged in: {username}</p>
    </>
  );
}

export default HomePage;
