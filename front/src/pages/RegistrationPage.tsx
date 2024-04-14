import React from "react";
import RegistrationComponent from "../components/RegistrationComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
  setUsername: Function;
}

function RegistrationPage(props: Props) {
  const { jwtIsValid, setJwt, setUsername } = { ...props };
  return (
    <>
      <NavbarComponent />
      <RegistrationComponent setJwt={setJwt} setUsername={setUsername} />
    </>
  );
}

export default RegistrationPage;
