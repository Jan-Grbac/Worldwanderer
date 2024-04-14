import React from "react";
import RegistrationComponent from "../components/RegistrationComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
}

function RegistrationPage(props: Props) {
  const { jwtIsValid, setJwt } = { ...props };
  return (
    <>
      <NavbarComponent />
      <RegistrationComponent setJwt={setJwt} />
    </>
  );
}

export default RegistrationPage;
