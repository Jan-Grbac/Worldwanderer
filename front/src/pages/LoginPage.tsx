import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
  setUsername: Function;
}

function LoginPage(props: Props) {
  const { jwtIsValid, setJwt, setUsername } = { ...props };
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtIsValid) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <NavbarComponent />
      <LoginComponent setJwt={setJwt} setUsername={setUsername} />
    </>
  );
}

export default LoginPage;
