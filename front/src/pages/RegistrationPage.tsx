import React, { useEffect } from "react";
import RegistrationComponent from "../components/RegistrationComponent";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
  setUsername: Function;
}

function RegistrationPage(props: Props) {
  const { jwtIsValid, setJwt, setUsername } = { ...props };

  const navigate = useNavigate();

  useEffect(() => {
    if (jwtIsValid) {
      navigate("/home");
      alert("You are already signed in!");
    }
  }, []);

  return (
    <>
      <RegistrationComponent setJwt={setJwt} setUsername={setUsername} />
    </>
  );
}

export default RegistrationPage;
