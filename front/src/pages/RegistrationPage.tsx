import React, { useEffect } from "react";
import RegistrationComponent from "../components/RegistrationComponent";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  jwtIsValid: boolean;
  setJwt: Function;
  setUsername: Function;
}

function RegistrationPage(props: Props) {
  const { jwtIsValid, setJwt, setUsername } = { ...props };

  const navigate = useNavigate();

  function notify(input: string) {
    toast(input);
  }

  useEffect(() => {
    if (jwtIsValid) {
      navigate("/home");
      notify("You are already signed in!");
    }
  }, [jwtIsValid]);

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
        <RegistrationComponent setJwt={setJwt} setUsername={setUsername} />
      </div>
    </>
  );
}

export default RegistrationPage;
