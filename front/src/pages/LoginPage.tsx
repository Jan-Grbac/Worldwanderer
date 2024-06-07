import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import NavbarComponent from "../components/NavbarComponent";
import { toast, ToastContainer } from "react-toastify";

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
      notify("You are already signed in!");
    }
  }, [jwtIsValid]);

  function notify(input: string) {
    toast(input);
  }

  return (
    <>
      <NavbarComponent jwtIsValid={jwtIsValid} username="" />
      <div className="flex justify-center mt-20">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
        />
        <LoginComponent setJwt={setJwt} setUsername={setUsername} />
      </div>
    </>
  );
}

export default LoginPage;
