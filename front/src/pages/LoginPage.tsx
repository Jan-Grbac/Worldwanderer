import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
}

function LoginPage(props: Props) {
  const { jwtIsValid, setJwt } = { ...props };
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtIsValid) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <NavbarComponent />
      <LoginComponent setJwt={setJwt} />
    </>
  );
}

export default LoginPage;
